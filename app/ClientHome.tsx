'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { type ReactNode, Suspense, useCallback, useEffect, useRef, useState } from 'react'

import BrandList from '../components/BrandList'
import HeroFallback from '../components/home/HeroFallback'
import SearchBar from '../components/SearchBar'
import ShishaCard from '../components/ShishaCard'
import SiteHeader from '../components/SiteHeader'
import SkeletonGrid from '../components/SkeletonGrid'
import { useSearchCommand } from '../components/search/SearchCommandContext'
import TagFilter from '../components/TagFilter'
import { type FlavorTagSlug, isFlavorTagSlug } from '../data/flavorTagTaxonomy'
import type { SearchResponse, ShishaFlavor } from '../types/shisha'

interface SearchParams {
  query?: string
  manufacturer?: string
  page?: number
  searchType?: 'all' | 'brand' | 'flavor'
  tags?: FlavorTagSlug[]
}

function parseTagsParam(value: string | null): FlavorTagSlug[] {
  if (!value) return []
  return value.split(',').filter(isFlavorTagSlug)
}

interface HomeContentProps {
  editorialSections?: ReactNode
  lastDataUpdated?: string | null
  initialManufacturers?: string[]
  initialTotalItems?: number
}

function HomeContent({ editorialSections, lastDataUpdated, initialManufacturers = [], initialTotalItems = 0 }: HomeContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { registerQuerySubmitHandler } = useSearchCommand()

  const [flavors, setFlavors] = useState<ShishaFlavor[]>([])
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [manufacturers, setManufacturers] = useState<string[]>(initialManufacturers)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10))
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(initialTotalItems)
  const [selectedManufacturer, setSelectedManufacturer] = useState(searchParams.get('manufacturer') || '')
  const [selectedTags, setSelectedTags] = useState<FlavorTagSlug[]>(parseTagsParam(searchParams.get('tags')))
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')

  useEffect(() => {
    if (initialManufacturers.length > 0) return
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
  }, [initialManufacturers.length])

  const handleSearch = async ({ query = '', manufacturer = undefined, page = undefined, searchType = 'all', tags = undefined }: SearchParams) => {
    try {
      if (page === undefined && manufacturer === undefined && tags === undefined) {
        setIsSearching(true)
      } else {
        setLoading(true)
      }
      setSearchQuery(query)

      const pageToUse = page !== undefined ? page : currentPage
      const tagsToUse = tags !== undefined ? tags : selectedTags

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

      if (tagsToUse.length > 0) {
        queryParams.append('tags', tagsToUse.join(','))
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
      if (tagsToUse.length > 0) urlParams.set('tags', tagsToUse.join(','))
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

  const handleTagToggle = (slug: FlavorTagSlug) => {
    const nextTags = selectedTags.includes(slug)
      ? selectedTags.filter(t => t !== slug)
      : [...selectedTags, slug]
    setSelectedTags(nextTags)
    setCurrentPage(1)
    handleSearch({ query: searchQuery, page: 1, tags: nextTags })
  }

  const handlePageChange = (newPage: number) => {
    handleSearch({ query: searchQuery, manufacturer: selectedManufacturer, page: newPage })
  }

  // ⌘K モーダルで確定した検索語は、遷移せずこのページの検索状態へ反映する。
  // handleSearch は毎レンダー再生成されるため、ref 経由で最新版を呼ぶ。
  const paletteSubmitRef = useRef<(_query: string) => void>(() => {})
  const pendingResultScrollRef = useRef(false)

  useEffect(() => {
    paletteSubmitRef.current = (query: string) => {
      setCurrentPage(1)
      setSelectedManufacturer('')
      setSelectedTags([])
      pendingResultScrollRef.current = true
      handleSearch({ query, manufacturer: '', page: 1, tags: [] })
    }
  })

  // 結果が描画されてからスクロールする。検索語が入るとエディトリアル節が
  // 消えて高さが変わるため、先にスクロールすると位置がずれる。
  // biome-ignore lint/correctness/useExhaustiveDependencies: 新しい結果が描画された後に走らせたいので flavors も依存に含める
  useEffect(() => {
    if (!pendingResultScrollRef.current || loading) return
    pendingResultScrollRef.current = false
    document.getElementById('ledger-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [loading, flavors])

  const handlePaletteSubmit = useCallback((query: string) => {
    paletteSubmitRef.current(query)
  }, [])

  useEffect(() => {
    registerQuerySubmitHandler(handlePaletteSubmit)
    return () => registerQuerySubmitHandler(null)
  }, [registerQuerySubmitHandler, handlePaletteSubmit])

  const handleHomeReset = () => {
    setSearchQuery('')
    setSelectedManufacturer('')
    setSelectedTags([])
    setCurrentPage(1)
    handleSearch({ query: '', manufacturer: '', page: 1, tags: [] })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時に一度だけ URL パラメータで検索する
  useEffect(() => {
    const query = searchParams.get('query') || ''
    const manufacturer = searchParams.get('manufacturer') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const tags = parseTagsParam(searchParams.get('tags'))
    handleSearch({ query, manufacturer, page, tags })
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
        type="button"
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
        <SiteHeader
          leading={
            <>
              <span className="inline-block w-2 h-2 bg-ember-500 shrink-0" aria-hidden />
              <button
                type="button"
                onClick={handleHomeReset}
                className="font-sans-tight font-semibold text-sm normal-case tracking-[-0.01em] text-ink-950 dark:text-ink-50 hover:text-ember-500 transition-colors truncate"
              >
                Shisha Flavor Ledger
              </button>
              <span className="hidden lg:inline text-ink-400 dark:text-ink-500">—</span>
              <span className="hidden lg:inline nums">Vol.&nbsp;I · Ed.&nbsp;2026</span>
            </>
          }
          trailing={
            <Link href="/brands" className="hover:text-ember-500 transition-colors whitespace-nowrap">
              Brand Index →
            </Link>
          }
        />

        {/* Hero */}
        <section className="grid grid-cols-12 gap-0 border-b border-ink-900 dark:border-ink-100">
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
            <p className="mt-4 font-sans-tight text-ink-500 dark:text-ink-400 text-sm sm:text-base leading-[1.6] max-w-[52ch]">
              日本国内で流通しているシーシャ(水たばこ)フレーバーを、ブランド名・フレーバー名・原産国から横断検索できる無料データベースです。AlFakher・STARBUZZ・Adalya・Fumari など主要銘柄の内容量・小売定価・産地を、財務省「製造たばこ小売定価」公告に基づいて随時更新しています。
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
        </section>

        {/* Editorial sections (Featured / Latest / Origins / Editor's Picks) */}
        {!searchQuery && !selectedManufacturer && selectedTags.length === 0 && editorialSections && (
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

          <TagFilter selectedTags={selectedTags} onToggle={handleTagToggle} />
        </section>

        {/* Results header */}
        <div
          id="ledger-results"
          className="scroll-mt-28 sm:scroll-mt-20 flex items-baseline justify-between border-t border-ink-900 dark:border-ink-100 border-b border-rule-200 dark:border-rule-800 py-3 mb-0 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-600 dark:text-ink-300">
          <span className="flex items-center gap-3">
            <span className="text-ember-500 nums">§&nbsp;006</span>
            <span>Entries</span>
          </span>
          <span className="nums">
            <span className="text-ember-500">{String(totalResults).padStart(4, '0')}</span>
            <span className="text-ink-400 dark:text-ink-500">&nbsp;/&nbsp;results</span>
          </span>
        </div>

        {loading ? (
          <div key="loader" className="pt-6">
            <SkeletonGrid count={12} />
          </div>
        ) : (
          <div key="results" className="pt-6">
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
                          type="button"
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
                          type="button"
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
                    type="button"
                    onClick={handleHomeReset}
                    className="font-mono-tight text-[11px] uppercase tracking-[0.14em] px-4 py-2 bg-ink-900 text-paper-0 dark:bg-ink-100 dark:text-paper-950 hover:bg-ember-500 transition-colors"
                  >
                    Reset →
                  </button>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  )
}

interface ClientHomeProps {
  children?: ReactNode
  lastDataUpdated?: string | null
  initialManufacturers?: string[]
  initialTotalItems?: number
}

export default function ClientHome({ children, lastDataUpdated, initialManufacturers = [], initialTotalItems = 0 }: ClientHomeProps) {
  return (
    <Suspense fallback={
      <HeroFallback
        initialTotalItems={initialTotalItems}
        initialBrandsCount={initialManufacturers.length}
        lastDataUpdated={lastDataUpdated ?? null}
      />
    }>
      <HomeContent
        editorialSections={children}
        lastDataUpdated={lastDataUpdated}
        initialManufacturers={initialManufacturers}
        initialTotalItems={initialTotalItems}
      />
    </Suspense>
  )
}
