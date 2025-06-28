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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 max-w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
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
              className="w-[200px] sm:w-[240px] h-[60px] sm:h-[80px] object-contain mb-4 mx-auto"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
              Shisha Flavor Search
            </h1>
          </motion.div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
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
                    <div className="flex justify-center mt-8 gap-2">
                      {/* Previous button */}
                      {currentPage > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="px-3 py-2 rounded-xl bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        >
                          ←
                        </motion.button>
                      )}

                      {/* First page */}
                      {currentPage > 2 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-2 rounded-xl bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        >
                          1
                        </motion.button>
                      )}

                      {/* Ellipsis */}
                      {currentPage > 3 && (
                        <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      )}

                      {/* Previous page */}
                      {currentPage > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="px-3 py-2 rounded-xl bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        >
                          {currentPage - 1}
                        </motion.button>
                      )}

                      {/* Current page */}
                      <span className="px-3 py-2 rounded-xl bg-primary-600 text-white shadow-sm border border-primary-600">
                        {currentPage}
                      </span>

                      {/* Next page */}
                      {currentPage < totalPages && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="px-3 py-2 rounded-xl bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        >
                          {currentPage + 1}
                        </motion.button>
                      )}

                      {/* Ellipsis */}
                      {currentPage < totalPages - 2 && (
                        <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 rounded-xl bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                        >
                          {totalPages}
                        </motion.button>
                      )}

                      {/* Next button */}
                      {currentPage < totalPages && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="px-3 py-2 rounded-xl bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
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
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    フレーバーが見つかりません
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    検索条件を変更してもう一度お試しください
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleHomeReset}
                    className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg"
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}