import Link from 'next/link'

interface HeroFallbackProps {
  initialTotalItems: number
  initialBrandsCount: number
  lastDataUpdated: string | null
}

/**
 * Server-rendered Suspense fallback for the home page.
 * Puts the LCP element (<p> description) in the initial HTML so it is
 * visible before JavaScript loads, improving LCP.
 */
export default function HeroFallback({ initialTotalItems, initialBrandsCount, lastDataUpdated }: HeroFallbackProps) {
  return (
    <div className="min-h-screen bg-paper-0 dark:bg-paper-950 text-ink-950 dark:text-ink-50">
      <main className="mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-24 max-w-[1480px]">
        <header className="flex flex-wrap items-center justify-between gap-3 py-3 border-t-2 border-b border-ink-900 dark:border-ink-100 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-700 dark:text-ink-200 mb-0">
          <span className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-ember-500" aria-hidden />
            <span className="font-sans-tight font-semibold text-sm normal-case tracking-[-0.01em] text-ink-950 dark:text-ink-50">
              Shisha Flavor Ledger
            </span>
            <span className="hidden sm:inline text-ink-400 dark:text-ink-500">—</span>
            <span className="hidden sm:inline nums">Vol.&nbsp;I · Ed.&nbsp;2026</span>
          </span>
          <Link href="/brands" className="hover:text-ember-500 transition-colors">
            Brand Index →
          </Link>
        </header>

        <section className="grid grid-cols-12 gap-0 border-b border-ink-900 dark:border-ink-100">
          <div className="col-span-12 lg:col-span-8 lg:border-r lg:border-rule-200 lg:dark:border-rule-800 py-10 lg:py-14 lg:pr-10">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ember-500 mb-5">
              § 001 · The Ledger
            </p>
            <h1 className="font-sans-tight font-semibold leading-[0.9] tracking-[-0.04em] text-ink-950 dark:text-ink-50">
              <span className="block text-[3.5rem] sm:text-[5rem] lg:text-[7rem]">
                Shisha Flavor
              </span>
              <span className="block text-[3.5rem] sm:text-[5rem] lg:text-[7rem]">
                Ledger<span className="text-ember-500">.</span>
              </span>
            </h1>
            <p className="mt-8 font-sans-tight text-ink-600 dark:text-ink-300 text-base sm:text-lg leading-[1.5] max-w-[52ch]">
              A verified record of every shisha flavor on sale in Japan, cross-checked against the Ministry of Finance tobacco ledger. Search by brand, flavor, or country; every entry lists grammage, origin, and current retail price.
            </p>
            <p className="mt-4 font-sans-tight text-ink-500 dark:text-ink-400 text-sm sm:text-base leading-[1.6] max-w-[52ch]">
              日本国内で流通しているシーシャ(水たばこ)フレーバーを、ブランド名・フレーバー名・原産国から横断検索できる無料データベースです。AlFakher・STARBUZZ・Adalya・Fumari など主要銘柄の内容量・小売定価・産地を、財務省「製造たばこ小売定価」公告に基づいて随時更新しています。
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/brands"
                className="font-mono-tight text-[11px] uppercase tracking-[0.14em] px-4 py-2 bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950 hover:bg-ember-500 hover:text-paper-0 dark:hover:bg-ember-500 transition-colors"
              >
                Browse brand index →
              </Link>
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
                or search below
              </span>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-rule-200 dark:divide-rule-800 border-t lg:border-t-0 border-rule-200 dark:border-rule-800">
            <div className="py-6 lg:py-7 px-5 lg:px-10">
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2">
                Indexed entries
              </p>
              <p className="font-sans-tight font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink-950 dark:text-ink-50 nums leading-none">
                {initialTotalItems.toLocaleString()}
              </p>
            </div>
            <Link
              href="/brands"
              className="py-6 lg:py-7 px-5 lg:px-10 block group hover:bg-paper-100 dark:hover:bg-paper-900 transition-colors"
            >
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2 group-hover:text-ember-500 transition-colors">
                Brands →
              </p>
              <p className="font-sans-tight font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink-950 dark:text-ink-50 nums leading-none">
                {initialBrandsCount}
              </p>
            </Link>
            {lastDataUpdated && (
              <div className="col-span-2 lg:col-span-1 py-6 lg:py-7 px-5 lg:px-10 border-t lg:border-t border-rule-200 dark:border-rule-800">
                <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2">
                  Last refresh
                </p>
                <p className="font-mono-tight text-base text-ink-950 dark:text-ink-50 nums">
                  {lastDataUpdated}
                </p>
              </div>
            )}
          </aside>
        </section>
      </main>
    </div>
  )
}
