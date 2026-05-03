'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, FormEvent, useMemo } from 'react'

import { debounce } from '../utils/debounce'

interface SearchBarProps {
  onSearch: (_params: { query: string; searchType?: 'all' | 'brand' | 'flavor' }) => void
  manufacturers?: string[]
  searchQuery?: string
  isSearching?: boolean
}

const searchTypes = [
  { key: 'all' as const, label: 'All' },
  { key: 'brand' as const, label: 'Brand' },
  { key: 'flavor' as const, label: 'Flavor' },
]

export default function SearchBar({ onSearch, searchQuery = '', isSearching = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [searchType, setSearchType] = useState<'all' | 'brand' | 'flavor'>('all')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setSearchTerm(searchQuery)
  }, [searchQuery])

  const debouncedSearch = useMemo(
    () =>
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

  const placeholder =
    searchType === 'brand'
      ? 'Search brand name'
      : searchType === 'flavor'
      ? 'Search flavor name'
      : 'Search the ledger'

  return (
    <form onSubmit={handleSubmit} className="mb-10">
      <div className="space-y-3">
        <div className="flex items-center gap-4 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
          <span className="text-ember-500">§</span>
          <span>Filter</span>
          <div className="flex border border-rule-200 dark:border-rule-800">
            {searchTypes.map(({ key, label }, idx) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSearchTypeChange(key)}
                aria-pressed={searchType === key}
                className={`px-3 py-1.5 transition-colors ${
                  searchType === key
                    ? 'bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950'
                    : 'text-ink-500 dark:text-ink-400 hover:text-ember-500'
                } ${idx > 0 ? 'border-l border-rule-200 dark:border-rule-800' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={`relative border ${isFocused ? 'border-ember-500' : 'border-ink-900 dark:border-ink-100'} bg-paper-0 dark:bg-paper-950 transition-colors`}>
          <div className="flex items-center">
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400 pl-3 shrink-0">
              Q.
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              aria-label="フレーバーを検索"
              className="flex-1 bg-transparent font-sans-tight text-base sm:text-lg text-ink-950 dark:text-ink-50 placeholder:text-ink-300 dark:placeholder:text-ink-500 focus:outline-none py-3 px-3"
            />
            <div className="flex items-center gap-0 shrink-0 pr-1">
              {isSearching && (
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.12em] text-ember-500 flex items-center gap-1.5 mr-2">
                  <span className="inline-block w-1.5 h-1.5 bg-ember-500 animate-caret" />
                  searching
                </span>
              )}
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="button"
                    onClick={handleClear}
                    className="font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-500 dark:text-ink-400 hover:text-ember-500 transition-colors px-3 py-3"
                  >
                    clear ×
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
