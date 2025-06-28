'use client'

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, FormEvent, useCallback } from 'react'

import { debounce } from '../utils/debounce'

interface SearchBarProps {
  onSearch: (_params: { query: string; searchType?: 'all' | 'brand' | 'flavor' }) => void
  manufacturers?: string[]
  searchQuery?: string
  isSearching?: boolean
}

export default function SearchBar({ onSearch, searchQuery = '', isSearching = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [searchType, setSearchType] = useState<'all' | 'brand' | 'flavor'>('all')

  useEffect(() => {
    setSearchTerm(searchQuery)
  }, [searchQuery])
  const [isFocused, setIsFocused] = useState(false)

  // デバウンスされた検索関数を作成
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string, type: 'all' | 'brand' | 'flavor') => {
      onSearch({ query, searchType: type })
    }, 300),
    [onSearch]
  )

  // 入力変更時の処理
  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    debouncedSearch(value, searchType)
  }

  // 検索タイプ変更時の処理
  const handleSearchTypeChange = (type: 'all' | 'brand' | 'flavor') => {
    setSearchType(type)
    if (searchTerm) {
      debouncedSearch(searchTerm, type)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // インクリメンタルサーチなので、Enterキーでの送信は特に処理しない
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch({ query: '', searchType })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* 検索タイプセレクター */}
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => handleSearchTypeChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              searchType === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            すべて
          </button>
          <button
            type="button"
            onClick={() => handleSearchTypeChange('brand')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              searchType === 'brand'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            ブランド名
          </button>
          <button
            type="button"
            onClick={() => handleSearchTypeChange('flavor')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              searchType === 'flavor'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            フレーバー名
          </button>
        </div>

        {/* 検索入力欄 */}
        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              searchType === 'brand' 
                ? "ブランド名で検索..." 
                : searchType === 'flavor' 
                ? "フレーバー名で検索..." 
                : "お気に入りのフレーバーを検索..."
            }
            className="w-full px-5 py-4 pl-14 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl shadow-lg border-2 border-transparent focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-all text-base"
          />
          
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-6 w-6"
              >
                <svg
                  className="h-6 w-6 text-primary-500 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </motion.div>
            ) : (
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            )}
          </div>
          
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </form>
  )
}