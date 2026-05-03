'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'

import { brandSlug } from '../lib/utils/brandNormalizer'

interface BrandListProps {
  manufacturers: string[]
  selectedManufacturer: string
  onSelect: (_manufacturer: string) => void
}

function getTodaySeed(): number {
  return parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10)
}

export default function BrandList({ manufacturers, selectedManufacturer, onSelect }: BrandListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [randomSeed, setRandomSeed] = useState(0)

  useEffect(() => {
    setRandomSeed(getTodaySeed())
  }, [])

  const popularBrands = useMemo(() => {
    if (manufacturers.length <= 10) return manufacturers

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
    return shuffled.slice(0, 10).map(index => manufacturers[index])
  }, [manufacturers, randomSeed])

  const filteredManufacturers = useMemo(() => {
    if (!searchQuery) return manufacturers
    return manufacturers.filter(brand =>
      brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [manufacturers, searchQuery])

  const chipClass = (isActive: boolean) =>
    `font-mono-tight text-[10px] uppercase tracking-[0.12em] px-2.5 py-1.5 border transition-colors ${
      isActive
        ? 'bg-ink-900 text-paper-0 border-ink-900 dark:bg-ink-100 dark:text-paper-950 dark:border-ink-100'
        : 'border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:border-ember-500 hover:text-ember-500'
    }`

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-3 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400">
        <span className="text-ember-500">§</span>
        <span>Brands</span>
        <span className="flex-1 h-px bg-rule-200 dark:bg-rule-800" />
        <span className="text-ink-400 dark:text-ink-500">
          {String(manufacturers.length).padStart(3, '0')}&nbsp;total
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button onClick={() => onSelect('')} className={chipClass(selectedManufacturer === '')}>
          All
        </button>
        {popularBrands.map((brand) => (
          <Link
            key={brand}
            href={`/brands/${brandSlug(brand)}`}
            className={`${chipClass(selectedManufacturer === brand)} truncate max-w-[200px]`}
          >
            {brand}
          </Link>
        ))}

        {manufacturers.length > 10 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="font-mono-tight text-[10px] uppercase tracking-[0.12em] px-2.5 py-1.5 border border-ember-500 text-ember-500 hover:bg-ember-500 hover:text-paper-0 transition-colors"
          >
            {isExpanded ? '— close' : `+${manufacturers.length - popularBrands.length} more`}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-5 border border-rule-200 dark:border-rule-800 bg-paper-0 dark:bg-paper-950">
              <div className="flex items-center gap-3 border-b border-rule-200 dark:border-rule-800 px-3 py-2.5">
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400 shrink-0">
                  Q.
                </span>
                <input
                  type="text"
                  placeholder="filter by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent font-sans-tight text-sm text-ink-950 dark:text-ink-50 placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 -m-px">
                {filteredManufacturers.map((brand, idx) => (
                  <Link
                    key={brand}
                    href={`/brands/${brandSlug(brand)}`}
                    onClick={() => setIsExpanded(false)}
                    className={`group relative text-left px-3 py-3 border border-rule-200 dark:border-rule-800 -mt-px -ml-px transition-colors ${
                      selectedManufacturer === brand
                        ? 'bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950 border-ink-900 dark:border-ink-100 z-10'
                        : 'text-ink-700 dark:text-ink-200 hover:text-ember-500 hover:border-ember-500 hover:z-10'
                    }`}
                  >
                    <span className="font-mono-tight text-[9px] uppercase tracking-[0.1em] text-ink-400 dark:text-ink-500 group-hover:text-ember-500 block mb-0.5 nums">
                      № {String(idx + 1).padStart(3, '0')}
                    </span>
                    <span className="font-sans-tight text-sm font-medium truncate block">{brand}</span>
                  </Link>
                ))}
              </div>

              {filteredManufacturers.length === 0 && (
                <p className="text-center py-8 font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500">
                  no matches
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
