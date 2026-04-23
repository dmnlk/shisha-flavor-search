'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import BackgroundOrbs from '../../components/BackgroundOrbs'
import BrandCard from '../../components/BrandCard'
import type { BrandSummary } from '../api/brands/route'

type SortKey = 'alpha' | 'popularity'

interface BrandsClientProps {
  brands: BrandSummary[]
}

export default function BrandsClient({ brands }: BrandsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('popularity')

  const filteredBrands = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    const base = term
      ? brands.filter(b => b.name.toLowerCase().includes(term))
      : brands
    const sorted = [...base]
    if (sortKey === 'popularity') {
      sorted.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
    return sorted
  }, [brands, searchQuery, sortKey])

  const totalFlavors = useMemo(
    () => brands.reduce((sum, b) => sum + b.count, 0),
    [brands]
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-atmosphere-light dark:bg-atmosphere-dark">
      <BackgroundOrbs />

      <main className="relative mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-lounge-400 dark:text-lounge-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors mb-6"
          >
            <span>←</span>
            <span>Back to Search</span>
          </Link>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-lounge-900 dark:text-lounge-100 mb-4 tracking-tight leading-[0.95]"
            style={{ fontFamily: 'var(--font-display), serif' }}
          >
            Brand <span className="text-gold-gradient">Directory</span>
          </h1>

          <div className="w-12 h-px bg-primary-400/60 mx-auto mb-5" />

          <p className="text-sm sm:text-base text-lounge-400 dark:text-lounge-500 tracking-wide">
            {brands.length} ブランド · {totalFlavors.toLocaleString()} フレーバー
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 max-w-3xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ブランド名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-white/80 dark:bg-lounge-900/60 backdrop-blur-sm text-lounge-900 dark:text-lounge-100 placeholder-lounge-400 dark:placeholder-lounge-600 rounded-lg border border-lounge-200/60 dark:border-lounge-800/40 focus:border-primary-400/60 dark:focus:border-primary-500/40 focus:outline-none transition-all text-sm"
              />
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-lounge-400" />
            </div>

            <div className="inline-flex rounded-lg bg-white/80 dark:bg-lounge-900/60 backdrop-blur-sm border border-lounge-200/60 dark:border-lounge-800/40 p-1">
              {(['popularity', 'alpha'] as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSortKey(key)}
                  className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                    sortKey === key
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-lounge-600 dark:text-lounge-400 hover:text-lounge-900 dark:hover:text-lounge-100'
                  }`}
                >
                  {key === 'popularity' ? '人気順' : 'A–Z'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filteredBrands.map((brand, idx) => (
              <BrandCard
                key={brand.name}
                name={brand.name}
                count={brand.count}
                sampleFlavors={brand.sampleFlavors}
                imageUrl={brand.imageUrl}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 border border-lounge-200 dark:border-lounge-700 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="w-8 h-8 text-lounge-300 dark:text-lounge-600" />
            </div>
            <h3
              className="text-xl font-medium text-lounge-700 dark:text-lounge-300 mb-2"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              ブランドが見つかりません
            </h3>
            <p className="text-sm text-lounge-400 dark:text-lounge-500">
              検索条件を変更してもう一度お試しください
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
