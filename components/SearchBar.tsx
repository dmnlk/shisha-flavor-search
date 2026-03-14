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

const searchTypes = [
  { key: 'all' as const, label: 'すべて' },
  { key: 'brand' as const, label: 'ブランド' },
  { key: 'flavor' as const, label: 'フレーバー' },
]

export default function SearchBar({ onSearch, searchQuery = '', isSearching = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [searchType, setSearchType] = useState<'all' | 'brand' | 'flavor'>('all')

  useEffect(() => {
    setSearchTerm(searchQuery)
  }, [searchQuery])

  const [isFocused, setIsFocused] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string, type: 'all' | 'brand' | 'flavor') => {
      onSearch({ query, searchType: type })
    }, 300),
    [onSearch]
  )

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    debouncedSearch(value, searchType)
  }

  const handleSearchTypeChange = (type: 'all' | 'brand' | 'flavor') => {
    setSearchType(type)
    if (searchTerm) {
      debouncedSearch(searchTerm, type)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch({ query: '', searchType })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-10 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-4"
      >
        {/* Search type tabs */}
        <div className="flex justify-center gap-1">
          {searchTypes.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSearchTypeChange(key)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                searchType === key
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-lounge-400 dark:text-lounge-500 hover:text-lounge-700 dark:hover:text-lounge-300'
              }`}
            >
              {label}
              {searchType === key && (
                <motion.div
                  layoutId="searchTab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 dark:bg-primary-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              searchType === 'brand'
                ? 'ブランド名で検索...'
                : searchType === 'flavor'
                ? 'フレーバー名で検索...'
                : 'フレーバーを探す...'
            }
            className={`w-full px-5 py-4 pl-12 pr-12 bg-white/90 dark:bg-lounge-900/80 backdrop-blur-sm text-lounge-900 dark:text-lounge-100 placeholder-lounge-400 dark:placeholder-lounge-600 rounded-xl border transition-all duration-300 text-[15px] font-medium outline-none ${
              isFocused
                ? 'border-primary-400/60 dark:border-primary-500/40 shadow-[0_0_0_3px_rgba(201,165,94,0.08)] dark:shadow-[0_0_0_3px_rgba(201,165,94,0.06)]'
                : 'border-lounge-200/80 dark:border-lounge-800/60 shadow-sm'
            }`}
          />

          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <svg className="h-5 w-5 text-primary-500/70 dark:text-primary-400/70" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </motion.div>
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5 text-lounge-400 dark:text-lounge-500" />
            )}
          </div>

          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-lounge-400 hover:text-lounge-600 dark:text-lounge-500 dark:hover:text-lounge-300 transition-colors"
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
