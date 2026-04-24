'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme()

  return (
    <div className="fixed top-5 right-5 z-50 font-mono-tight text-[10px] uppercase tracking-[0.12em]">
      <div className="flex items-stretch border border-ink-900 dark:border-ink-100 bg-paper-0 dark:bg-paper-950">
        <button
          onClick={() => setDarkMode(false)}
          aria-pressed={!darkMode}
          aria-label="Light mode"
          className={`px-2.5 py-1.5 transition-colors ${
            !darkMode
              ? 'bg-ink-900 text-paper-0'
              : 'text-ink-500 hover:text-ember-500'
          }`}
        >
          Day
        </button>
        <span aria-hidden className="self-stretch w-px bg-ink-900 dark:bg-ink-100" />
        <button
          onClick={() => setDarkMode(true)}
          aria-pressed={darkMode}
          aria-label="Dark mode"
          className={`px-2.5 py-1.5 transition-colors ${
            darkMode
              ? 'bg-ink-100 text-paper-950'
              : 'text-ink-500 hover:text-ember-500'
          }`}
        >
          Night
        </button>
      </div>
    </div>
  )
}
