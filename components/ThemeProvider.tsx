'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  darkMode: boolean
  setDarkMode: (_darkMode: boolean) => void
}

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem("theme")
    setDarkMode(storedTheme === "dark")
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode, mounted])

  const value = {
    darkMode,
    setDarkMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Provider 外でも落ちない版。Provider が無ければ `undefined` を返す。
 * 存在しない Server Action ID 付きの POST などで Next が not-found を
 * root layout (= Provider) の外で描画するケースがあるため、not-found からも
 * 描画される `ThemeToggle` はこちらを使う。
 */
export const useOptionalTheme = () => useContext(ThemeContext)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}