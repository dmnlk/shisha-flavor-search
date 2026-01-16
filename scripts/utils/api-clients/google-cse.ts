import { config } from 'dotenv'
import * as path from 'path'
import axios from 'axios'
import { googleQueue, retryWithBackoff } from '../rate-limiter'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

interface GoogleCSEConfig {
  apiKey: string
  searchEngineId: string
}

interface GoogleCSEImageResult {
  link: string
  title: string
  thumbnailLink: string
}

interface GoogleCSEResponse {
  items?: GoogleCSEImageResult[]
}

export class GoogleCSEClient {
  private config: GoogleCSEConfig
  private requestCount = 0
  private readonly MAX_DAILY_REQUESTS = 100

  constructor(apiKey?: string, searchEngineId?: string) {
    this.config = {
      apiKey: apiKey || process.env.GOOGLE_CSE_API_KEY || '',
      searchEngineId: searchEngineId || process.env.GOOGLE_CSE_ID || '',
    }

    if (!this.config.apiKey || !this.config.searchEngineId) {
      console.warn('⚠️  Google CSE API key or Search Engine ID not configured')
    }
  }

  /**
   * 画像検索を実行
   * @param query 検索クエリ
   * @param num 取得する結果数（最大10）
   * @returns 画像URL、見つからない場合はnull
   */
  async searchImage(query: string, num = 3): Promise<string | null> {
    if (!this.config.apiKey || !this.config.searchEngineId) {
      console.error('❌ Google CSE API not configured')
      return null
    }

    if (this.requestCount >= this.MAX_DAILY_REQUESTS) {
      console.warn(`⚠️  Daily quota reached (${this.MAX_DAILY_REQUESTS} requests)`)
      return null
    }

    try {
      const result = await googleQueue.add(() =>
        retryWithBackoff(async () => {
          const url = 'https://www.googleapis.com/customsearch/v1'
          const params = {
            key: this.config.apiKey,
            cx: this.config.searchEngineId,
            q: query,
            searchType: 'image',
            num: Math.min(num, 10),
            safe: 'active',
          }

          const response = await axios.get<GoogleCSEResponse>(url, { params })
          this.requestCount++

          if (response.data.items && response.data.items.length > 0) {
            // 最初の結果を返す
            return response.data.items[0].link
          }

          return null
        })
      )

      return result || null
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          console.error('❌ Rate limit exceeded. Please wait before retrying.')
        } else if (error.response?.status === 403) {
          console.error('❌ API quota exceeded or invalid credentials.')
        } else {
          console.error('❌ Google CSE API error:', error.message)
        }
      } else {
        console.error('❌ Unexpected error:', error)
      }
      return null
    }
  }

  /**
   * 残りリクエスト数を取得
   */
  getRemainingRequests(): number {
    return this.MAX_DAILY_REQUESTS - this.requestCount
  }

  /**
   * リクエストカウントをリセット（テスト用）
   */
  resetRequestCount(): void {
    this.requestCount = 0
  }
}

/**
 * デフォルトのGoogle CSEクライアントインスタンス
 */
export const googleCSEClient = new GoogleCSEClient()
