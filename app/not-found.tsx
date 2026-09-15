import type { Metadata } from 'next'
import Link from 'next/link'

import SiteHeader from '../components/SiteHeader'

export const metadata: Metadata = {
  title: 'ページが見つかりませんでした',
  robots: { index: false, follow: false },
}

/**
 * 404 ページ。存在しない /flavor/<id> や /brands/<slug> (dynamicParams=false) で
 * notFound() が呼ばれたときに使われる。Next のデフォルト 404 はヘッダーもナビも
 * 無い素のページになるため、他ページと同じマストヘッドと導線を持たせる。
 */
export default function NotFound() {
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
            § 404 · Not on file
          </p>
          <h1 className="font-sans-tight font-semibold leading-[0.9] tracking-[-0.04em] text-ink-950 dark:text-ink-50 text-[3rem] sm:text-[4.5rem] lg:text-[6rem]">
            ページが見つかりません<span className="text-ember-500">.</span>
          </h1>
          <p className="mt-8 font-sans-tight text-ink-600 dark:text-ink-300 text-base sm:text-lg leading-[1.6] max-w-[52ch]">
            お探しのフレーバーやブランドは台帳に登録されていないか、URL が変更された可能性があります。
            トップページの検索、またはブランド一覧からお探しください。
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="font-mono-tight text-[11px] uppercase tracking-[0.14em] px-4 py-2 bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950 hover:bg-ember-500 hover:text-paper-0 dark:hover:bg-ember-500 transition-colors"
            >
              トップへ戻る →
            </Link>
            <Link
              href="/brands"
              className="font-mono-tight text-[11px] uppercase tracking-[0.14em] px-4 py-2 border border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:border-ember-500 hover:text-ember-500 transition-colors"
            >
              ブランド一覧
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
