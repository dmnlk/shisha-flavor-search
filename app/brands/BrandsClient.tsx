'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import BrandCard from '../../components/BrandCard'
import { normalizeForSearch } from '../../lib/utils/japaneseNormalizer'
import type { BrandSummary } from '../api/brands/route'

type SortKey = 'alpha' | 'popularity'

interface BrandsClientProps {
  brands: BrandSummary[]
}

export default function BrandsClient({ brands }: BrandsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('popularity')

  const filteredBrands = useMemo(() => {
    const term = normalizeForSearch(searchQuery)
    const base = term
      ? brands.filter(b => normalizeForSearch(b.name).includes(term))
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
    <div className="min-h-screen bg-paper-0 dark:bg-paper-950 text-ink-950 dark:text-ink-50">
      <main className="mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-24 max-w-[1480px]">
        {/* Masthead */}
        <header className="flex flex-wrap items-center justify-between gap-3 py-3 border-t-2 border-b border-ink-900 dark:border-ink-100 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-700 dark:text-ink-200 mb-0">
          <span className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-ember-500" aria-hidden />
            <Link
              href="/"
              className="font-sans-tight font-semibold text-sm normal-case tracking-[-0.01em] text-ink-950 dark:text-ink-50 hover:text-ember-500 transition-colors"
            >
              Shisha Flavor Ledger
            </Link>
            <span className="hidden sm:inline text-ink-400 dark:text-ink-500">—</span>
            <span className="hidden sm:inline nums">Vol.&nbsp;I · Ed.&nbsp;2026</span>
          </span>
          <Link href="/" className="hover:text-ember-500 transition-colors">
            ← Flavor Ledger
          </Link>
        </header>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-12 gap-0 border-b border-ink-900 dark:border-ink-100"
        >
          <div className="col-span-12 lg:col-span-8 lg:border-r lg:border-rule-200 lg:dark:border-rule-800 py-10 lg:py-14 lg:pr-10">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ember-500 mb-5">
              § 002 · The Brands
            </p>
            <h1 className="font-sans-tight font-semibold leading-[0.9] tracking-[-0.04em] text-ink-950 dark:text-ink-50">
              <span className="block text-[3.5rem] sm:text-[5rem] lg:text-[7rem]">
                Brand
              </span>
              <span className="block text-[3.5rem] sm:text-[5rem] lg:text-[7rem]">
                Index<span className="text-ember-500">.</span>
              </span>
            </h1>
            <p className="mt-8 font-sans-tight text-ink-600 dark:text-ink-300 text-base sm:text-lg leading-[1.5] max-w-[52ch]">
              Every house represented in the ledger — {brands.length} verified brands producing{' '}
              <span className="text-ember-500 nums font-semibold">{totalFlavors.toLocaleString()}</span>{' '}
              distinct flavors. Click any brand to see their full catalog.
            </p>
          </div>

          <aside className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-rule-200 dark:divide-rule-800 border-t lg:border-t-0 border-rule-200 dark:border-rule-800">
            <div className="py-6 lg:py-7 px-5 lg:px-10">
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2">
                Brands
              </p>
              <p className="font-sans-tight font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink-950 dark:text-ink-50 nums leading-none">
                {brands.length}
              </p>
            </div>
            <div className="py-6 lg:py-7 px-5 lg:px-10">
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2">
                Entries total
              </p>
              <p className="font-sans-tight font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink-950 dark:text-ink-50 nums leading-none">
                {totalFlavors.toLocaleString()}
              </p>
            </div>
            <div className="col-span-2 lg:col-span-1 py-6 lg:py-7 px-5 lg:px-10 border-t lg:border-t border-rule-200 dark:border-rule-800">
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2">
                Logos on file
              </p>
              <p className="font-mono-tight text-base text-ink-950 dark:text-ink-50 nums">
                74 / {brands.length}
              </p>
            </div>
          </aside>
        </motion.section>

        {/* Controls */}
        <section className="py-10 grid grid-cols-12 gap-4 border-b border-rule-200 dark:border-rule-800">
          <div className="col-span-12 md:col-span-8">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400 mb-2">
              <span className="text-ember-500">§</span>&nbsp;Query
            </p>
            <div className="flex items-center border border-ink-900 dark:border-ink-100 bg-paper-0 dark:bg-paper-950">
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400 pl-3 shrink-0">
                Q.
              </span>
              <input
                type="text"
                placeholder="search by brand name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent font-sans-tight text-base sm:text-lg text-ink-950 dark:text-ink-50 placeholder:text-ink-300 dark:placeholder:text-ink-500 focus:outline-none py-3 px-3"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-500 dark:text-ink-400 mb-2">
              <span className="text-ember-500">§</span>&nbsp;Sort
            </p>
            <div className="flex border border-rule-200 dark:border-rule-800">
              {(['popularity', 'alpha'] as SortKey[]).map((key, idx) => (
                <button
                  key={key}
                  onClick={() => setSortKey(key)}
                  className={`flex-1 font-mono-tight text-[11px] uppercase tracking-[0.12em] px-4 py-3 transition-colors ${
                    sortKey === key
                      ? 'bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950'
                      : 'text-ink-500 dark:text-ink-400 hover:text-ember-500'
                  } ${idx > 0 ? 'border-l border-rule-200 dark:border-rule-800' : ''}`}
                >
                  {key === 'popularity' ? 'By popularity' : 'A → Z'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results header */}
        <div className="flex items-baseline justify-between border-b border-rule-200 dark:border-rule-800 py-3 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-600 dark:text-ink-300">
          <span className="flex items-center gap-3">
            <span className="text-ember-500">§</span>
            <span>Brands</span>
          </span>
          <span className="nums">
            <span className="text-ember-500">{String(filteredBrands.length).padStart(3, '0')}</span>
            <span className="text-ink-400 dark:text-ink-500">&nbsp;/&nbsp;shown</span>
          </span>
        </div>

        {filteredBrands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-6">
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
          <div className="text-center py-24 border-b border-rule-200 dark:border-rule-800">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ember-500 mb-4">
              § no matches
            </p>
            <h3 className="font-sans-tight font-semibold text-3xl sm:text-4xl tracking-[-0.02em] text-ink-950 dark:text-ink-50 mb-4">
              No brand matches.
            </h3>
            <p className="font-sans-tight text-ink-500 dark:text-ink-400 text-base">
              Try a shorter term or clear the search.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
