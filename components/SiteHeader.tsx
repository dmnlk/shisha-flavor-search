import type { ReactNode } from 'react'

import HeaderSearchTrigger from './search/HeaderSearchTrigger'
import { ThemeToggle } from './ThemeToggle'

interface SiteHeaderProps {
  /** 左端の見出し (ロゴや戻りリンク) */
  leading: ReactNode
  /** 右端の補助リンク・ラベル */
  trailing?: ReactNode
}

/**
 * 全ページ共通のマストヘッド。検索は最上部に常設し、
 * スクロールしても追従するよう sticky で固定する。
 * 親の左右パディング (px-4 / sm:px-6 / lg:px-10) を打ち消してから
 * 同じ量を自前で持つことで、追従時に背面がガター側から覗かないようにする。
 */
export default function SiteHeader({ leading, trailing }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 bg-paper-0 dark:bg-paper-950 border-t-2 border-b border-ink-900 dark:border-ink-100 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-700 dark:text-ink-200">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
        <div className="flex items-center gap-3 min-w-0 flex-1">{leading}</div>

        <div className="order-last w-full sm:order-none sm:w-auto sm:min-w-[240px]">
          <HeaderSearchTrigger />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {trailing}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
