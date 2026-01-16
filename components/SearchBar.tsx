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
    <form onSubmit={handleSubmit} className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
      >
        {/* 検索タイプセレクター */}
        <div className="flex justify-center gap-3 flex-wrap">
          <motion.button
            type="button"
            onClick={() => handleSearchTypeChange('all')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              searchType === 'all'
                ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-xl border-2 border-white/20 glow'
                : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50'
            }`}
          >
            すべて
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleSearchTypeChange('brand')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              searchType === 'brand'
                ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-xl border-2 border-white/20 glow'
                : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50'
            }`}
          >
            ブランド名
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleSearchTypeChange('flavor')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              searchType === 'flavor'
                ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-xl border-2 border-white/20 glow'
                : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50'
            }`}
          >
            フレーバー名
          </motion.button>
        </div>

        {/* 検索入力欄 */}
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            y: isFocused ? -4 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
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
            className={`w-full px-6 py-5 pl-16 pr-14 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-3xl shadow-2xl border-2 transition-all text-lg font-medium ${
              isFocused
                ? 'border-primary-500 dark:border-primary-400 glow'
                : 'border-gray-200/50 dark:border-gray-700/50'
            }`}
          />

          <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-7 w-7"
              >
                <svg
                  className="h-7 w-7 text-primary-500 dark:text-primary-400"
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
              <MagnifyingGlassIcon className="h-7 w-7 text-primary-500 dark:text-primary-400" />
            )}
          </div>

          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleClear}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-accent-500 dark:text-gray-400 dark:hover:text-accent-400 transition-colors"
              >
                <XMarkIcon />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </form>
  )
}