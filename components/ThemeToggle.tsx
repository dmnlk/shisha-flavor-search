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
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5 text-yellow-500" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-700" />
      )}
    </button>
  )
}