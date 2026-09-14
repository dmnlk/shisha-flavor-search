// Cloudflare Workers のエントリポイント (wrangler.jsonc の `main`)。
//
// `opennextjs-cloudflare build` が生成する `.open-next/worker.js` (wrangler の `alias` で
// `open-next-worker` として解決) を `@sentry/cloudflare` の `withSentry()` で包む。これにより
// リクエストごとに Sentry クライアントが用意され、Worker から漏れた例外の捕捉と、レスポンス返却後の
// 送信 (`ctx.waitUntil` による flush) が行われる。Next.js 内部で捕捉されたエラーは
// `instrumentation.ts` の `onRequestError` から同じクライアントに送られる。
import * as Sentry from '@sentry/cloudflare'
import handler from 'open-next-worker'

import { SENTRY_DSN, SENTRY_ENABLED, SENTRY_TRACES_SAMPLE_RATE } from './lib/sentry/config'

// 生成された worker.js と同じ公開面 (OpenNext の Durable Object クラス) を保つ。
export { BucketCachePurge, DOQueueHandler, DOShardedTagCache } from 'open-next-worker'

export default Sentry.withSentry(
  () => ({
    dsn: SENTRY_DSN,
    enabled: SENTRY_ENABLED,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
  }),
  handler
)
