'use client'

import { useEffect, useState } from 'react'

import { useSearchCommand } from './SearchCommandContext'

export default function HeaderSearchTrigger() {
  const { open } = useSearchCommand()
  // ショートカット表記はマウント後に決める (SSR とクライアントで差が出るため)
  const [shortcut, setShortcut] = useState<string | null>(null)

  useEffect(() => {
    const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
    setShortcut(isApple ? '⌘K' : 'Ctrl K')
  }, [])

  return (
    <button
      type="button"
      onClick={open}
      aria-label="検索を開く"
      aria-keyshortcuts="Meta+K Control+K"
      className="group flex items-center gap-2 w-full sm:w-auto sm:min-w-[240px] px-3 py-2 border border-rule-200 dark:border-rule-800 bg-paper-0 dark:bg-paper-950 hover:border-ember-500 transition-colors font-mono-tight text-[10px] uppercase tracking-[0.14em] text-left"
    >
      <span aria-hidden className="text-ember-500 shrink-0">
        Q.
      </span>
      <span className="text-ink-400 dark:text-ink-500 group-hover:text-ink-700 dark:group-hover:text-ink-200 transition-colors truncate">
        Search flavors
      </span>
      {shortcut && (
        <kbd className="ml-auto hidden md:inline-block shrink-0 px-1.5 py-0.5 border border-rule-200 dark:border-rule-800 font-mono-tight text-[9px] tracking-[0.1em] text-ink-400 dark:text-ink-500">
          {shortcut}
        </kbd>
      )}
    </button>
  )
}
