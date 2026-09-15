'use client'

// ルートレイアウトは生きているが、配下のページ (RSC / client) の描画に失敗したときの
// フォールバック。global-error.tsx はレイアウト自体が崩壊したときの最終防衛線で、
// こちらはヘッダー付きの通常レイアウトの中に収まる。
//
// `@sentry/nextjs` ではなく `@sentry/browser` から import する理由は global-error.tsx と同じ
// (client component を SSR バンドルする際にサーバー向けエントリへ解決され Worker が肥大化する)。
import { captureException } from '@sentry/browser'
import Link from 'next/link'
import { useEffect } from 'react'

import SiteHeader from '../components/SiteHeader'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    captureException(error)
  }, [error])

  return (
    <div className="min-h-screen bg-paper-0 dark:bg-paper-950 text-ink-950 dark:text-ink-50">
      <main className="mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-24 max-w-[1480px]">
        <SiteHeader
          leading={
            <>
              <span className="inline-block w-2 h-2 bg-ember-500 shrink-0" aria-hidden />
              <Link
                href="/"
                className="font-sans-tight font-semibold text-sm normal-case tracking-[-0.01em] text-ink-950 dark:text-ink-50 hover:text-ember-500 transition-colors truncate"
              >
                Shisha Flavor Ledger
              </Link>
            </>
          }
          trailing={
            <Link href="/brands" className="hover:text-ember-500 transition-colors whitespace-nowrap">
              Brand Index →
            </Link>
          }
        />

        <section className="border-b border-ink-900 dark:border-ink-100 py-16 sm:py-24">
          <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ember-500 mb-5">
            § Error
          </p>
          <h1 className="font-sans-tight font-semibold leading-[0.9] tracking-[-0.04em] text-ink-950 dark:text-ink-50 text-[2.5rem] sm:text-[4rem] lg:text-[5rem]">
            ページの表示中にエラーが発生しました<span className="text-ember-500">.</span>
          </h1>
          <p className="mt-8 font-sans-tight text-ink-600 dark:text-ink-300 text-base sm:text-lg leading-[1.6] max-w-[52ch]">
            問題は自動的に記録されました。時間をおいて再度お試しください。
          </p>
          {error.digest && (
            <p className="mt-3 font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500 nums">
              digest: {error.digest}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="font-mono-tight text-[11px] uppercase tracking-[0.14em] normal-case px-4 py-2 bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950 hover:bg-ember-500 hover:text-paper-0 dark:hover:bg-ember-500 transition-colors"
            >
              再試行 →
            </button>
            <Link
              href="/"
              className="font-mono-tight text-[11px] uppercase tracking-[0.14em] px-4 py-2 border border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:border-ember-500 hover:text-ember-500 transition-colors"
            >
              トップへ戻る
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
