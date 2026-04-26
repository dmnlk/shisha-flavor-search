'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense, type ReactNode } from 'react'

import BrandList from '../components/BrandList'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchBar from '../components/SearchBar'
import ShishaCard from '../components/ShishaCard'
import SkeletonGrid from '../components/SkeletonGrid'
import type { ShishaFlavor, SearchResponse } from '../types/shisha'

interface SearchParams {
  query?: string
  manufacturer?: string
  page?: number
  searchType?: 'all' | 'brand' | 'flavor'
}

interface HomeContentProps {
  editorialSections?: ReactNode
  lastDataUpdated?: string | null
}

function HomeContent({ editorialSections, lastDataUpdated }: HomeContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [flavors, setFlavors] = useState<ShishaFlavor[]>([])
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [manufacturers, setManufacturers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [selectedManufacturer, setSelectedManufacturer] = useState(searchParams.get('manufacturer') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await fetch('/api/manufacturers')
        const data: string[] = await response.json()
        setManufacturers(data)
      } catch (error) {
        console.error('Error fetching manufacturers:', error)
      }
    }
    fetchManufacturers()
  }, [])

  const handleSearch = async ({ query = '', manufacturer = undefined, page = undefined, searchType = 'all' }: SearchParams) => {
    try {
      if (page === undefined && manufacturer === undefined) {
        setIsSearching(true)
      } else {
        setLoading(true)
      }
      setSearchQuery(query)

      const pageToUse = page !== undefined ? page : currentPage

      const queryParams = new URLSearchParams({
        query,
        page: pageToUse.toString(),
      })

      if (searchType && searchType !== 'all') {
        queryParams.append('searchType', searchType)
      }

      if (manufacturer !== undefined) {
        if (manufacturer) {
          queryParams.append('manufacturer', manufacturer)
        }
      } else if (selectedManufacturer) {
        queryParams.append('manufacturer', selectedManufacturer)
      }

      const response = await fetch(`/api/search?${queryParams}`)
      const data: SearchResponse = await response.json()

      setFlavors(data.items)
      setTotalPages(data.totalPages)
      setTotalResults(data.totalItems ?? data.items.length)

      if (page !== undefined) {
        setCurrentPage(page)
      }

      const urlParams = new URLSearchParams()
      if (query) urlParams.set('query', query)
      if (manufacturer !== undefined ? manufacturer : selectedManufacturer) {
        urlParams.set('manufacturer', manufacturer !== undefined ? manufacturer : selectedManufacturer)
      }
      if (pageToUse > 1) urlParams.set('page', pageToUse.toString())

      const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : '/'
      router.push(newUrl, { scroll: false })
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
      setIsSearching(false)
    }
  }

  const handleManufacturerSelect = (manufacturer: string) => {
    setCurrentPage(1)
    setSelectedManufacturer(manufacturer)
    handleSearch({ query: searchQuery, manufacturer, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    handleSearch({ query: searchQuery, manufacturer: selectedManufacturer, page: newPage })
  }

  const handleHomeReset = () => {
    setSearchQuery('')
    setSelectedManufacturer('')
    setCurrentPage(1)
    handleSearch({ query: '', manufacturer: '', page: 1 })
  }

  useEffect(() => {
    const query = searchParams.get('query') || ''
    const manufacturer = searchParams.get('manufacturer') || ''
    const page = parseInt(searchParams.get('page') || '1')
    handleSearch({ query, manufacturer, page })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderPageButton = (page: number, isCurrent = false) => {
    const base = 'min-w-[2.5rem] h-9 px-2 flex items-center justify-center font-mono-tight text-[11px] border transition-colors nums'
    if (isCurrent) {
      return (
        <span
          key={`current-${page}`}
          className={`${base} bg-ink-900 text-paper-0 border-ink-900 dark:bg-ink-100 dark:text-paper-950 dark:border-ink-100`}
        >
          {page}
        </span>
      )
    }
    return (
      <button
        key={`page-${page}`}
        onClick={() => handlePageChange(page)}
        className={`${base} border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:text-ember-500 hover:border-ember-500`}
      >
        {page}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-paper-0 dark:bg-paper-950 text-ink-950 dark:text-ink-50">
      <main className="mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-24 max-w-[1480px]">
        {/* Masthead */}
        <header className="flex flex-wrap items-center justify-between gap-3 py-3 border-t-2 border-b border-ink-900 dark:border-ink-100 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-700 dark:text-ink-200 mb-0">
          <span className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-ember-500" aria-hidden />
            <button
              type="button"
              onClick={handleHomeReset}
              className="font-sans-tight font-semibold text-sm normal-case tracking-[-0.01em] text-ink-950 dark:text-ink-50 hover:text-ember-500 transition-colors"
            >
              Shisha Flavor Ledger
            </button>
            <span className="hidden sm:inline text-ink-400 dark:text-ink-500">—</span>
            <span className="hidden sm:inline nums">Vol.&nbsp;I · Ed.&nbsp;2026</span>
          </span>
          <Link href="/brands" className="hover:text-ember-500 transition-colors">
            Brand Index →
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
              § 001 · The Ledger
            </p>
            <h1 className="font-sans-tight font-semibold leading-[0.9] tracking-[-0.04em] text-ink-950 dark:text-ink-50">
              <span className="block text-[3.5rem] sm:text-[5rem] lg:text-[7rem]">
                Shisha Flavor
              </span>
              <span className="block text-[3.5rem] sm:text-[5rem] lg:text-[7rem]">
                Ledger<span className="text-ember-500">.</span>
              </span>
            </h1>
            <p className="mt-8 font-sans-tight text-ink-600 dark:text-ink-300 text-base sm:text-lg leading-[1.5] max-w-[52ch]">
              A verified record of every shisha flavor on sale in Japan, cross-checked against the Ministry of Finance tobacco ledger. Search by brand, flavor, or country; every entry lists grammage, origin, and current retail price.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/brands"
                className="font-mono-tight text-[11px] uppercase tracking-[0.14em] px-4 py-2 bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950 hover:bg-ember-500 hover:text-paper-0 dark:hover:bg-ember-500 transition-colors"
              >
                Browse brand index →
              </Link>
              <span className="font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500">
                or search below
              </span>
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-rule-200 dark:divide-rule-800 border-t lg:border-t-0 border-rule-200 dark:border-rule-800">
            <div className="py-6 lg:py-7 px-5 lg:px-10">
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2">
                Indexed entries
              </p>
              <p className="font-sans-tight font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink-950 dark:text-ink-50 nums leading-none">
                {totalResults.toLocaleString()}
              </p>
            </div>
            <Link
              href="/brands"
              className="py-6 lg:py-7 px-5 lg:px-10 block group hover:bg-paper-100 dark:hover:bg-paper-900 transition-colors"
            >
              <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2 group-hover:text-ember-500 transition-colors">
                Brands →
              </p>
              <p className="font-sans-tight font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.04em] text-ink-950 dark:text-ink-50 nums leading-none">
                {manufacturers.length}
              </p>
            </Link>
            {lastDataUpdated && (
              <div className="col-span-2 lg:col-span-1 py-6 lg:py-7 px-5 lg:px-10 border-t lg:border-t border-rule-200 dark:border-rule-800">
                <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-2">
                  Last refresh
                </p>
                <p className="font-mono-tight text-base text-ink-950 dark:text-ink-50 nums">
                  {lastDataUpdated}
                </p>
              </div>
            )}
          </aside>
        </motion.section>

        {/* Editorial sections (Featured / Latest / Origins / Editor's Picks) */}
        {!searchQuery && !selectedManufacturer && editorialSections && (
          <section aria-label="Editorial">
            {editorialSections}
          </section>
        )}

        {/* Controls */}
        <section className="py-10">
          <SearchBar
            onSearch={(params) => handleSearch({ query: params.query, searchType: params.searchType, page: 1 })}
            manufacturers={manufacturers}
            searchQuery={searchQuery}
            isSearching={isSearching}
          />

          <BrandList
            manufacturers={manufacturers}
            selectedManufacturer={selectedManufacturer}
            onSelect={handleManufacturerSelect}
          />
        </section>

        {/* Results header */}
        <div className="flex items-baseline justify-between border-t border-ink-900 dark:border-ink-100 border-b border-rule-200 dark:border-rule-800 py-3 mb-0 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-600 dark:text-ink-300">
          <span className="flex items-center gap-3">
            <span className="text-ember-500 nums">§&nbsp;006</span>
            <span>Entries</span>
          </span>
          <span className="nums">
            <span className="text-ember-500">{String(totalResults).padStart(4, '0')}</span>
            <span className="text-ink-400 dark:text-ink-500">&nbsp;/&nbsp;results</span>
          </span>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-6">
              <SkeletonGrid count={12} />
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-6">
              {flavors.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {flavors.map((flavor, index) => (
                      <ShishaCard
                        key={flavor.id}
                        flavor={flavor}
                        index={index}
                        onManufacturerClick={handleManufacturerSelect}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-14 gap-1.5 border-t border-rule-200 dark:border-rule-800 pt-8">
                      {currentPage > 1 && (
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="h-9 px-3 font-mono-tight text-[10px] uppercase tracking-[0.14em] border border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:text-ember-500 hover:border-ember-500 transition-colors"
                        >
                          ← prev
                        </button>
                      )}

                      {currentPage > 2 && renderPageButton(1)}
                      {currentPage > 3 && (
                        <span className="h-9 px-2 flex items-center text-ink-400 dark:text-ink-500 font-mono-tight text-[10px]">···</span>
                      )}

                      {currentPage > 1 && renderPageButton(currentPage - 1)}
                      {renderPageButton(currentPage, true)}
                      {currentPage < totalPages && renderPageButton(currentPage + 1)}

                      {currentPage < totalPages - 2 && (
                        <span className="h-9 px-2 flex items-center text-ink-400 dark:text-ink-500 font-mono-tight text-[10px]">···</span>
                      )}
                      {currentPage < totalPages - 1 && renderPageButton(totalPages)}

                      {currentPage < totalPages && (
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="h-9 px-3 font-mono-tight text-[10px] uppercase tracking-[0.14em] border border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:text-ember-500 hover:border-ember-500 transition-colors"
                        >
                          next →
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24 border-b border-rule-200 dark:border-rule-800">
                  <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ember-500 mb-4">
                    § no matches
                  </p>
                  <h3 className="font-sans-tight font-semibold text-3xl sm:text-4xl tracking-[-0.02em] text-ink-950 dark:text-ink-50 mb-4">
                    The ledger is empty.
                  </h3>
                  <p className="font-sans-tight text-ink-500 dark:text-ink-400 text-base mb-8">
                    Adjust the filter or reset the archive.
                  </p>
                  <button
                    onClick={handleHomeReset}
                    className="font-mono-tight text-[11px] uppercase tracking-[0.14em] px-4 py-2 bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950 hover:bg-ember-500 transition-colors"
                  >
                    Reset →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

interface ClientHomeProps {
  children?: ReactNode
  lastDataUpdated?: string | null
}

export default function ClientHome({ children, lastDataUpdated }: ClientHomeProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-paper-0 dark:bg-paper-950">
        <LoadingSpinner />
      </div>
    }>
      <HomeContent editorialSections={children} lastDataUpdated={lastDataUpdated} />
    </Suspense>
  )
}
