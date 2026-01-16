import { config } from 'dotenv'
import * as path from 'path'
import axios from 'axios'
import { unsplashQueue, retryWithBackoff } from '../rate-limiter'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

interface UnsplashConfig {
  accessKey: string
}

interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: {
    name: string
    username: string
  }
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[]
  total: number
}

export class UnsplashClient {
  private config: UnsplashConfig
  private requestCount = 0
  private readonly MAX_HOURLY_REQUESTS = 50

  constructor(accessKey?: string) {
    this.config = {
      accessKey: accessKey || process.env.UNSPLASH_ACCESS_KEY || '',
    }

    if (!this.config.accessKey) {
      console.warn('⚠️  Unsplash API access key not configured')
    }
  }

  /**
   * 画像検索を実行
   * @param query 検索クエリ
   * @param perPage 取得する結果数（最大30）
   * @returns 画像URL、見つからない場合はnull
   */
  async searchImage(query: string, perPage = 5): Promise<string | null> {
    if (!this.config.accessKey) {
      console.error('❌ Unsplash API not configured')
      return null
    }

    if (this.requestCount >= this.MAX_HOURLY_REQUESTS) {
      console.warn(`⚠️  Hourly quota reached (${this.MAX_HOURLY_REQUESTS} requests)`)
      return null
    }

    try {
      const result = await unsplashQueue.add(() =>
        retryWithBackoff(async () => {
          const url = 'https://api.unsplash.com/search/photos'
          const params = {
            query: query,
            per_page: Math.min(perPage, 30),
            content_filter: 'high',
          }

          const response = await axios.get<UnsplashSearchResponse>(url, {
            params,
            headers: {
              Authorization: `Client-ID ${this.config.accessKey}`,
            },
          })

          this.requestCount++

          if (response.data.results && response.data.results.length > 0) {
            // regular サイズ（標準的な画質）を返す
            return response.data.results[0].urls.regular
          }

          return null
        })
      )

      return result || null
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          console.error('❌ Rate limit exceeded. Please wait before retrying.')
        } else if (error.response?.status === 401) {
          console.error('❌ Invalid Unsplash API credentials.')
        } else {
          console.error('❌ Unsplash API error:', error.message)
        }
      } else {
        console.error('❌ Unexpected error:', error)
      }
      return null
    }
  }

  /**
   * シーシャ/フレーバー用の画像検索
   * @param brandName ブランド名
   * @param flavorName フレーバー名（オプション）
   * @returns 画像URL、見つからない場合はnull
   */
  async searchShishaImage(brandName: string, flavorName?: string): Promise<string | null> {
    // 優先度順に検索を試行
    const queries = flavorName
      ? [
          `${brandName} ${flavorName} shisha tobacco`,
          `${brandName} hookah tobacco`,
          `hookah ${flavorName}`,
          `shisha tobacco`,
        ]
      : [`${brandName} shisha tobacco`, `${brandName} hookah`, `hookah tobacco`]

    for (const query of queries) {
      const imageUrl = await this.searchImage(query)
      if (imageUrl) {
        console.log(`✅ Found image for "${brandName}" using query: "${query}"`)
        return imageUrl
      }
    }

    console.warn(`⚠️  No image found for brand: ${brandName}`)
    return null
  }

  /**
   * 残りリクエスト数を取得
   */
  getRemainingRequests(): number {
    return this.MAX_HOURLY_REQUESTS - this.requestCount
  }

  /**
   * リクエストカウントをリセット（新しい時間枠用）
   */
  resetRequestCount(): void {
    this.requestCount = 0
  }
}

/**
 * デフォルトのUnsplashクライアントインスタンス
 */
export const unsplashClient = new UnsplashClient()
