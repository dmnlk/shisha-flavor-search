'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme()

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-5 right-5 z-50 p-3 rounded-xl bg-lounge-50/90 dark:bg-lounge-800/90 backdrop-blur-md border border-lounge-200/60 dark:border-lounge-700/40 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5 text-primary-400 group-hover:rotate-45 transition-transform duration-500" />
      ) : (
        <MoonIcon className="h-5 w-5 text-lounge-600 group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  )
}
