'use client'

import { useTheme } from './ThemeProvider'

/** マストヘッド内に置くインラインの Day / Night 切り替え */
export function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme()

  return (
    <div className="flex items-stretch border border-ink-900 dark:border-ink-100 bg-paper-0 dark:bg-paper-950 font-mono-tight text-[10px] uppercase tracking-[0.12em] shrink-0">
      <button
        type="button"
        onClick={() => setDarkMode(false)}
        aria-pressed={!darkMode}
        aria-label="Light mode"
        className={`px-2 py-1.5 transition-colors ${
          !darkMode
            ? 'bg-ink-900 text-paper-0'
            : 'text-ink-500 hover:text-ember-500'
        }`}
      >
        Day
      </button>
      <span aria-hidden className="self-stretch w-px bg-ink-900 dark:bg-ink-100" />
      <button
        type="button"
        onClick={() => setDarkMode(true)}
        aria-pressed={darkMode}
        aria-label="Dark mode"
        className={`px-2 py-1.5 transition-colors ${
          darkMode
            ? 'bg-ink-100 text-paper-950'
            : 'text-ink-500 hover:text-ember-500'
        }`}
      >
        Night
      </button>
    </div>
  )
}
