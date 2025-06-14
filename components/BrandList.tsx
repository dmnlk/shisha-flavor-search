'use client'

import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'

interface BrandListProps {
  manufacturers: string[]
  selectedManufacturer: string
  onSelect: (manufacturer: string) => void
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
    <div className="mb-6 px-4 sm:px-0">
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
        {/* All Brands button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('')}
          className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all
            ${selectedManufacturer === '' 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-md'
            }`}
        >
          All Brands
        </motion.button>

        {/* Popular brands */}
        {popularBrands.map((brand) => (
          <motion.button
            key={brand}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(brand)}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all truncate max-w-[120px] sm:max-w-none
              ${selectedManufacturer === brand 
                ? 'bg-primary-600 text-white shadow-lg' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-md'
              }`}
          >
            {brand}
          </motion.button>
        ))}

        {/* More brands button */}
        {manufacturers.length > 8 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-md"
          >
            <span>More</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Expanded brand list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4">
              {/* Search input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="ブランドを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-all text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>

              {/* Brand grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredManufacturers.map((brand) => (
                  <motion.button
                    key={brand}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelect(brand)
                      setIsExpanded(false)
                    }}
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all text-left truncate
                      ${selectedManufacturer === brand 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-600'
                      }`}
                  >
                    {brand}
                  </motion.button>
                ))}
              </div>

              {filteredManufacturers.length === 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  ブランドが見つかりません
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}