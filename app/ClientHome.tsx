'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

import BrandList from '../components/BrandList'
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
  
  // URLパラメータから初期値を取得
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
      // インクリメンタルサーチの場合は isSearching を使用
      if (page === undefined && manufacturer === undefined) {
        setIsSearching(true)
      } else {
        setLoading(true)
      }
      setSearchQuery(query)
      
      // Use provided page or current page
      const pageToUse = page !== undefined ? page : currentPage
      
      // Only include manufacturer in query params if it's not empty
      const queryParams = new URLSearchParams({
        query,
        page: pageToUse.toString(),
      })
      
      // Add searchType to query params
      if (searchType && searchType !== 'all') {
        queryParams.append('searchType', searchType)
      }
      
      // Add manufacturer to query params only if it's provided and not empty
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
      
      // Update current page if it was explicitly provided
      if (page !== undefined) {
        setCurrentPage(page)
      }
      
      // URLパラメータを更新
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
    // Reset to page 1 when changing manufacturer
    setCurrentPage(1)
    // Update selected manufacturer (empty string for "All Brands")
    setSelectedManufacturer(manufacturer)
    // Perform search with new manufacturer
    handleSearch({ 
      query: searchQuery, 
      manufacturer,
      page: 1,
    })
  }

  const handlePageChange = (newPage: number) => {
    handleSearch({ 
      query: searchQuery, 
      manufacturer: selectedManufacturer,
      page: newPage,
    })
  }

  const handleHomeReset = () => {
    setSearchQuery('')
    setSelectedManufacturer('')
    setCurrentPage(1)
    handleSearch({ query: '', manufacturer: '', page: 1 })
  }

  // Initial load - URLパラメータから状態を復元
  useEffect(() => {
    const query = searchParams.get('query') || ''
    const manufacturer = searchParams.get('manufacturer') || ''
    const page = parseInt(searchParams.get('page') || '1')
    
    handleSearch({ query, manufacturer, page })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 bg-gradient-mesh relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <main className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 max-w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            onClick={handleHomeReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer inline-block"
          >
            <Image
              src="/images/logo.png"
              alt="Shisha Search Logo"
              width={240}
              height={80}
              priority
              className="w-[200px] sm:w-[280px] h-[60px] sm:h-[90px] object-contain mb-6 mx-auto drop-shadow-2xl"
            />
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 dark:from-primary-400 dark:via-primary-300 dark:to-accent-400 bg-clip-text text-transparent mb-4 tracking-tight">
              Shisha Flavor Search
            </h1>
          </motion.div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
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
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonGrid count={12} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {flavors.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
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
                    <div className="flex justify-center mt-12 gap-2">
                      {/* Previous button */}
                      {currentPage > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold transition-all"
                        >
                          ←
                        </motion.button>
                      )}

                      {/* First page */}
                      {currentPage > 2 && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(1)}
                          className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold transition-all"
                        >
                          1
                        </motion.button>
                      )}

                      {/* Ellipsis */}
                      {currentPage > 3 && (
                        <span className="px-4 py-2.5 text-gray-400 dark:text-gray-500 font-bold">
                          ...
                        </span>
                      )}

                      {/* Previous page */}
                      {currentPage > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold transition-all"
                        >
                          {currentPage - 1}
                        </motion.button>
                      )}

                      {/* Current page */}
                      <motion.span
                        layoutId="activePage"
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-xl border-2 border-white/20 font-bold glow"
                      >
                        {currentPage}
                      </motion.span>

                      {/* Next page */}
                      {currentPage < totalPages && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold transition-all"
                        >
                          {currentPage + 1}
                        </motion.button>
                      )}

                      {/* Ellipsis */}
                      {currentPage < totalPages - 2 && (
                        <span className="px-4 py-2.5 text-gray-400 dark:text-gray-500 font-bold">
                          ...
                        </span>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(totalPages)}
                          className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold transition-all"
                        >
                          {totalPages}
                        </motion.button>
                      )}

                      {/* Next button */}
                      {currentPage < totalPages && (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold transition-all"
                        >
                          →
                        </motion.button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-full flex items-center justify-center shadow-2xl">
                    <svg
                      className="w-16 h-16 text-primary-500 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    フレーバーが見つかりません
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    検索条件を変更してもう一度お試しください
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleHomeReset}
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all shadow-xl glow"
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
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-950 bg-gradient-mesh">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin glow" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-accent-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}