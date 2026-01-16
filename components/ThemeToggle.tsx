'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { darkMode, setDarkMode } = useTheme()

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-primary-500/50 dark:hover:shadow-accent-500/50 transition-all duration-300 hover:scale-110 hover:-rotate-12 group"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <SunIcon className="h-6 w-6 text-yellow-500 group-hover:rotate-90 transition-transform duration-300" />
      ) : (
        <MoonIcon className="h-6 w-6 text-primary-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  )
}