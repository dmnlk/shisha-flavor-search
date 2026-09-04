'use client'

import { useRouter } from 'next/navigation'
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import SearchCommandPalette from './SearchCommandPalette'

type QuerySubmitHandler = (_query: string) => void

interface SearchCommandContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  /**
   * 「すべての結果を見る」時の挙動を差し替えるハンドラを登録する。
   * ホームは同一ページ内で検索状態を更新したいので ClientHome が登録し、
   * 未登録のページ (ブランド / フレーバー詳細) は `/?query=` へ遷移する。
   */
  registerQuerySubmitHandler: (_handler: QuerySubmitHandler | null) => void
  submitQuery: (_query: string) => void
}

const SearchCommandContext = createContext<SearchCommandContextValue | undefined>(undefined)

/** input / textarea / contenteditable にフォーカスがある間は "/" ショートカットを無効にする */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export function SearchCommandProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const submitHandlerRef = useRef<QuerySubmitHandler | null>(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const registerQuerySubmitHandler = useCallback((handler: QuerySubmitHandler | null) => {
    submitHandlerRef.current = handler
  }, [])

  const submitQuery = useCallback(
    (query: string) => {
      setIsOpen(false)
      const handler = submitHandlerRef.current
      if (handler) {
        handler(query)
        return
      }
      router.push(query ? `/?query=${encodeURIComponent(query)}` : '/')
    },
    [router]
  )

  // PC: ⌘K / Ctrl+K で開閉。入力中でなければ "/" でも開く。
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsOpen(prev => !prev)
        return
      }
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const value = useMemo(
    () => ({ isOpen, open, close, registerQuerySubmitHandler, submitQuery }),
    [isOpen, open, close, registerQuerySubmitHandler, submitQuery]
  )

  return (
    <SearchCommandContext.Provider value={value}>
      {children}
      <SearchCommandPalette />
    </SearchCommandContext.Provider>
  )
}

export function useSearchCommand(): SearchCommandContextValue {
  const context = useContext(SearchCommandContext)
  if (context === undefined) {
    throw new Error('useSearchCommand must be used within a SearchCommandProvider')
  }
  return context
}
