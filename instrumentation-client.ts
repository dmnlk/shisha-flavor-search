// ブラウザ側の Sentry 初期化。HTML 読み込み後・React hydration 前に実行される。
// Session Replay / User Feedback はバンドルサイズと個人情報の観点から入れていない。
import * as Sentry from '@sentry/nextjs'

import { SENTRY_DSN, SENTRY_ENABLED, SENTRY_TRACES_SAMPLE_RATE } from './lib/sentry/config'

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: SENTRY_ENABLED,
  tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
})

// App Router のクライアント遷移をトランザクションとして計測する
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
