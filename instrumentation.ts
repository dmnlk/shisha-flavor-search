// Next.js のサーバー側 instrumentation。
//
// サーバー側の Sentry クライアントは `worker.ts` の `Sentry.withSentry()` (@sentry/cloudflare) が
// リクエストごとに用意する。Next.js が RSC 描画 / Route Handler / middleware で捕捉したエラーは
// Worker まで throw されない (Next 自身が 500 を描画する) ため、ここで `onRequestError` を通じて
// 同じリクエストスコープの Sentry クライアントに送る。
//
// `@sentry/nextjs` のサーバー SDK を使わないのは、Node 向け OpenTelemetry instrumentation 一式
// (MySQL / Mongo / Kafka / LLM SDK …) が Worker バンドルに入り gzip で約 1 MiB 増えて
// Cloudflare Workers Free の上限 (3 MiB) を超えるため。
import type { Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  // edge ランタイム (middleware) では @sentry/cloudflare を読み込まない (バンドル重複を避ける)。
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const Sentry = await import('@sentry/cloudflare')
  // Next.js のヘッダ型 (string | string[]) を Sentry の Record<string, string> に揃える
  const headers: Record<string, string> = {}
  for (const [key, value] of Object.entries(request.headers)) {
    if (value === undefined) continue
    headers[key] = Array.isArray(value) ? value.join(', ') : value
  }
  Sentry.withScope((scope) => {
    scope.setSDKProcessingMetadata({
      normalizedRequest: {
        headers,
        method: request.method,
      },
    })
    scope.setContext('nextjs', {
      request_path: request.path,
      router_kind: context.routerKind,
      router_path: context.routePath,
      route_type: context.routeType,
    })
    scope.setTransactionName(`${request.method} ${context.routePath}`)
    Sentry.captureException(error, {
      mechanism: { handled: false, type: 'auto.function.nextjs.on_request_error' },
    })
  })
}
