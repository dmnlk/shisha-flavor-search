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

  useEffect(() => {
    setRandomSeed(Math.random())
  }, [])

  const popularBrands = useMemo(() => {
    if (manufacturers.length <= 8) return manufacturers

    const seededRandom = (seed: number, index: number) => {
      const x = Math.sin(seed + index) * 10000
      return x - Math.floor(x)
    }

    const indices = manufacturers.map((_, i) => i)
    const shuffled = [...indices]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(randomSeed, i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, 8).map(index => manufacturers[index])
  }, [manufacturers, randomSeed])

  const filteredManufacturers = useMemo(() => {
    if (!searchQuery) return manufacturers
    return manufacturers.filter(brand =>
      brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [manufacturers, searchQuery])

  const pillClass = (isActive: boolean) =>
    `px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
      isActive
        ? 'bg-primary-500 dark:bg-primary-500/90 text-white shadow-sm'
        : 'bg-lounge-100/80 dark:bg-lounge-800/60 text-lounge-600 dark:text-lounge-400 hover:bg-lounge-200/80 dark:hover:bg-lounge-700/60 border border-lounge-200/50 dark:border-lounge-700/30'
    }`

  return (
    <div className="mb-10 max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 justify-center">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('')}
          className={pillClass(selectedManufacturer === '')}
        >
          All Brands
        </motion.button>

        {popularBrands.map((brand) => (
          <motion.button
            key={brand}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(brand)}
            className={`${pillClass(selectedManufacturer === brand)} truncate max-w-[130px] sm:max-w-none`}
          >
            {brand}
          </motion.button>
        ))}

        {manufacturers.length > 8 && (
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide bg-lounge-100/80 dark:bg-lounge-800/60 text-lounge-600 dark:text-lounge-400 hover:bg-lounge-200/80 dark:hover:bg-lounge-700/60 border border-lounge-200/50 dark:border-lounge-700/30 transition-all duration-300"
          >
            <span>More</span>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </motion.div>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-white/80 dark:bg-lounge-900/60 backdrop-blur-sm rounded-xl border border-lounge-200/60 dark:border-lounge-800/40 p-5">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="ブランドを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-lounge-50 dark:bg-lounge-800/50 text-lounge-900 dark:text-lounge-100 placeholder-lounge-400 dark:placeholder-lounge-600 rounded-lg border border-lounge-200/60 dark:border-lounge-700/40 focus:border-primary-400/60 dark:focus:border-primary-500/40 focus:outline-none transition-all text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lounge-400" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {filteredManufacturers.map((brand, idx) => (
                  <motion.button
                    key={brand}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.015 }}
                    whileHover={{ y: -1 }}
                    onClick={() => { onSelect(brand); setIsExpanded(false) }}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-center truncate ${
                      selectedManufacturer === brand
                        ? 'bg-primary-500 text-white'
                        : 'bg-lounge-50 dark:bg-lounge-800/40 text-lounge-600 dark:text-lounge-400 hover:bg-lounge-100 dark:hover:bg-lounge-700/50'
                    }`}
                  >
                    {brand}
                  </motion.button>
                ))}
              </div>

              {filteredManufacturers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-lounge-400 dark:text-lounge-500 text-sm">ブランドが見つかりません</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
