'use client'

// ルートレイアウト自体が描画に失敗したときのフォールバック。root layout を置き換えるため
// <html> / <body> を自前で持つ。捕捉したエラーは Sentry に送る (React の error boundary は
// 通常の window.onerror に流れないため、ここで明示的に captureException する)。
//
// `@sentry/nextjs` ではなく `@sentry/browser` から import する理由: client component は SSR 用にも
// バンドルされ、その際 `@sentry/nextjs` はサーバー向けエントリ (Node SDK + OpenTelemetry 一式、
// 約 2 MB) に解決されて Worker バンドルを肥大化させる。`@sentry/browser` は `@sentry/nextjs` の
// クライアント側の実体で、`instrumentation-client.ts` が初期化したクライアントをそのまま共有する。
import './globals.css'
import { captureException } from '@sentry/browser'
import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  retry: () => void
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    captureException(error)
  }, [error])

  return (
    <html lang="ja">
      <body className="min-h-screen bg-paper-0 text-ink-900 font-sans-tight">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
          <p className="font-mono-tight text-xs uppercase tracking-widest text-ember-500">Error</p>
          <h1 className="text-2xl font-semibold">ページの表示中にエラーが発生しました</h1>
          <p className="text-sm text-ink-600">
            問題は自動的に記録されました。時間をおいて再度お試しください。
            {error.digest ? (
              <>
                <br />
                <span className="font-mono-tight nums">digest: {error.digest}</span>
              </>
            ) : null}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="border border-ink-900 px-4 py-2 text-sm normal-case hover:bg-ink-900 hover:text-paper-0"
            >
              再試行
            </button>
            <a href="/" className="border border-rule-300 px-4 py-2 text-sm hover:border-ink-900">
              トップへ戻る
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
