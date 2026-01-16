'use client'

import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'

interface BrandListProps {
  manufacturers: string[]
  selectedManufacturer: string
  onSelect: (_manufacturer: string) => void
}

export default function BrandList({ manufacturers, selectedManufacturer, onSelect }: BrandListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [randomSeed, setRandomSeed] = useState(0)
  
  // コンポーネントマウント時にランダムシードを設定
  useEffect(() => {
    setRandomSeed(Math.random())
  }, [])
  
  // 人気ブランドをランダムに選択
  const popularBrands = useMemo(() => {
    if (manufacturers.length <= 8) {
      return manufacturers
    }
    
    // シード値を使用して一貫性のあるランダム選択を行う
    const seededRandom = (seed: number, index: number) => {
      const x = Math.sin(seed + index) * 10000
      return x - Math.floor(x)
    }
    
    // インデックスの配列を作成してシャッフル
    const indices = manufacturers.map((_, i) => i)
    const shuffled = [...indices]
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(randomSeed, i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    // シャッフルしたインデックスから8個のブランドを選択
    return shuffled.slice(0, 8).map(index => manufacturers[index])
  }, [manufacturers, randomSeed])

  // フィルタリングされたブランド
  const filteredManufacturers = useMemo(() => {
    if (!searchQuery) return manufacturers
    return manufacturers.filter(brand =>
      brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [manufacturers, searchQuery])

  return (
    <div className="mb-8 px-4 sm:px-0">
      <div className="flex flex-wrap gap-3 mb-4 justify-center">
        {/* All Brands button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('')}
          className={`px-5 sm:px-6 py-2.5 rounded-2xl text-sm font-bold transition-all
            ${selectedManufacturer === ''
              ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-xl border-2 border-white/20 glow'
              : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50'
            }`}
        >
          All Brands
        </motion.button>

        {/* Popular brands */}
        {popularBrands.map((brand) => (
          <motion.button
            key={brand}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(brand)}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all truncate max-w-[140px] sm:max-w-none
              ${selectedManufacturer === brand
                ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-xl border-2 border-white/20 glow'
                : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 shadow-lg border border-gray-200/50 dark:border-gray-700/50'
              }`}
          >
            {brand}
          </motion.button>
        ))}

        {/* More brands button */}
        {manufacturers.length > 8 && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center px-5 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          >
            <span>More</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Expanded brand list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 mb-6 border border-gray-200/50 dark:border-gray-700/50">
              {/* Search input */}
              <div className="relative mb-5">
                <input
                  type="text"
                  placeholder="ブランドを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 pr-5 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-all text-sm font-medium shadow-inner"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500 dark:text-primary-400" />
              </div>

              {/* Brand grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredManufacturers.map((brand, idx) => (
                  <motion.button
                    key={brand}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onSelect(brand)
                      setIsExpanded(false)
                    }}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-center truncate
                      ${selectedManufacturer === brand
                        ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-600 shadow-md border border-gray-200/50 dark:border-gray-600/50'
                      }`}
                  >
                    {brand}
                  </motion.button>
                ))}
              </div>

              {filteredManufacturers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-full flex items-center justify-center">
                    <MagnifyingGlassIcon className="h-8 w-8 text-primary-500 dark:text-primary-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    ブランドが見つかりません
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}