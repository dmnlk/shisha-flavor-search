'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

import BackgroundOrbs from '../components/BackgroundOrbs'
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

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [flavors, setFlavors] = useState<ShishaFlavor[]>([])
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [manufacturers, setManufacturers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [totalPages, setTotalPages] = useState(0)
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
    if (isCurrent) {
      return (
        <span
          key={`current-${page}`}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-500 text-white text-sm font-semibold"
        >
          {page}
        </span>
      )
    }
    return (
      <motion.button
        key={`page-${page}`}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handlePageChange(page)}
        className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium text-lounge-500 dark:text-lounge-400 hover:bg-lounge-100 dark:hover:bg-lounge-800/60 transition-colors"
      >
        {page}
      </motion.button>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-atmosphere-light dark:bg-atmosphere-dark">
      <BackgroundOrbs />

      <main className="relative mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <motion.div
            onClick={handleHomeReset}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer inline-block"
          >
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-lounge-900 dark:text-lounge-100 mb-4 tracking-tight leading-[0.95]"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              Shisha Flavor
              <br />
              <span className="text-gold-gradient">Search</span>
            </h1>
          </motion.div>

          <div className="w-12 h-px bg-primary-400/60 mx-auto mb-5" />

          <p className="text-sm sm:text-base text-lounge-400 dark:text-lounge-500 tracking-wide">
            あなただけの特別なフレーバーを見つけよう
          </p>
        </motion.div>

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

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonGrid count={12} />
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {flavors.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
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
                    <div className="flex justify-center items-center mt-14 gap-1">
                      {currentPage > 1 && (
                        <motion.button
                          whileHover={{ x: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-lounge-400 dark:text-lounge-500 hover:bg-lounge-100 dark:hover:bg-lounge-800/60 transition-colors mr-1"
                        >
                          ←
                        </motion.button>
                      )}

                      {currentPage > 2 && renderPageButton(1)}

                      {currentPage > 3 && (
                        <span className="w-10 h-10 flex items-center justify-center text-lounge-300 dark:text-lounge-600 text-sm">
                          ···
                        </span>
                      )}

                      {currentPage > 1 && renderPageButton(currentPage - 1)}
                      {renderPageButton(currentPage, true)}
                      {currentPage < totalPages && renderPageButton(currentPage + 1)}

                      {currentPage < totalPages - 2 && (
                        <span className="w-10 h-10 flex items-center justify-center text-lounge-300 dark:text-lounge-600 text-sm">
                          ···
                        </span>
                      )}

                      {currentPage < totalPages - 1 && renderPageButton(totalPages)}

                      {currentPage < totalPages && (
                        <motion.button
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg text-lounge-400 dark:text-lounge-500 hover:bg-lounge-100 dark:hover:bg-lounge-800/60 transition-colors ml-1"
                        >
                          →
                        </motion.button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 mx-auto mb-6 border border-lounge-200 dark:border-lounge-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-lounge-300 dark:text-lounge-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-medium text-lounge-700 dark:text-lounge-300 mb-2"
                    style={{ fontFamily: 'var(--font-display), serif' }}
                  >
                    フレーバーが見つかりません
                  </h3>
                  <p className="text-sm text-lounge-400 dark:text-lounge-500 mb-8">
                    検索条件を変更してもう一度お試しください
                  </p>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleHomeReset}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors shadow-sm"
                  >
                    すべてのフレーバーを見る
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function ClientHome() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-lounge-50 dark:bg-lounge-950">
        <LoadingSpinner />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
