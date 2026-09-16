import Link from 'next/link'

import SiteHeader from '../../../components/SiteHeader'
import SkeletonGrid from '../../../components/SkeletonGrid'

/**
 * /flavor/[id] は SSR (サーバーで shishaData を読む) のため、遷移中は
 * 詳細ページと同じ骨格のスケルトンを出す。それ以外のページは静的 / SSG なので
 * ルート直下には置かず、このセグメントだけに限定している。
 */
export default function FlavorDetailLoading() {
  return (
    <div className="min-h-screen bg-paper-0 dark:bg-paper-950 text-ink-950 dark:text-ink-50">
      <main className="mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-24 max-w-[1480px]">
        <SiteHeader
          leading={
            <Link href="/" className="flex items-center gap-2 hover:text-ember-500 transition-colors truncate">
              <span aria-hidden>←</span>
              <span>Back to Ledger</span>
            </Link>
          }
          trailing={<span className="hidden sm:inline nums text-ember-500">ENTRY · № ····</span>}
        />

        <article
          aria-busy="true"
          aria-label="読み込み中"
          className="grid grid-cols-12 gap-0 border-b border-ink-900 dark:border-ink-100"
        >
          <div className="col-span-12 md:col-span-7 md:border-r border-rule-200 dark:border-rule-800 bg-paper-50 dark:bg-paper-900">
            <div className="aspect-[3/4] md:aspect-auto md:h-full md:min-h-[640px] animate-pulse bg-paper-100 dark:bg-paper-900" />
          </div>
          <div className="col-span-12 md:col-span-5 px-6 md:px-10 py-10 animate-pulse">
            <div className="h-2.5 w-24 bg-paper-200 dark:bg-paper-800 mb-6" />
            <div className="h-10 w-4/5 bg-paper-200 dark:bg-paper-800 mb-3" />
            <div className="h-10 w-3/5 bg-paper-200 dark:bg-paper-800 mb-10" />
            <div className="h-12 w-40 bg-paper-200 dark:bg-paper-800 mb-10 border-b border-rule-200 dark:border-rule-800" />
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="h-8 bg-paper-200 dark:bg-paper-800" />
              <div className="h-8 bg-paper-200 dark:bg-paper-800" />
            </div>
            <div className="h-3 w-full bg-paper-200 dark:bg-paper-800 mb-2" />
            <div className="h-3 w-5/6 bg-paper-200 dark:bg-paper-800" />
          </div>
        </article>

        <section className="mt-16">
          <div className="py-3 border-t-2 border-b border-ink-900 dark:border-ink-100 mb-6 h-9" />
          <SkeletonGrid count={6} />
        </section>
      </main>
    </div>
  )
}
