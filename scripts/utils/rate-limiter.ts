import PQueue from 'p-queue'

/**
 * Google Custom Search API用のレート制限キュー
 * 無料枠: 100クエリ/日 → 安全のため1リクエスト/秒に制限
 */
export const googleQueue = new PQueue({
  interval: 1000, // 1秒
  intervalCap: 1, // 1リクエスト/秒
})

/**
 * Unsplash API用のレート制限キュー
 * 無料枠: 50リクエスト/時、5000/月 → 10リクエスト/秒で制限
 */
export const unsplashQueue = new PQueue({
  interval: 1000, // 1秒
  intervalCap: 10, // 10リクエスト/秒
})

/**
 * 汎用レート制限キューを作成
 * @param requestsPerSecond 1秒あたりのリクエスト数
 * @returns PQueueインスタンス
 */
export function createRateLimiter(requestsPerSecond: number): PQueue {
  return new PQueue({
    interval: 1000,
    intervalCap: requestsPerSecond,
  })
}

/**
 * 指定時間待機する
 * @param ms 待機時間（ミリ秒）
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Exponential backoffで再試行
 * @param fn 実行する関数
 * @param maxRetries 最大再試行回数
 * @param initialDelay 初期遅延時間（ミリ秒）
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      const delay = initialDelay * Math.pow(2, i)
      console.warn(`⚠️  Retry ${i + 1}/${maxRetries} after ${delay}ms...`)
      await sleep(delay)
    }
  }

  throw lastError
}
