import { NextRequest, NextResponse } from 'next/server'

import { shishaData } from '../../../data/shishaData'
import { normalizeBrandForSearch } from '../../../lib/utils/brandNormalizer'
import type { SearchResponse } from '../../../types/shisha'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse | { error: string }>> {
  try {
    // Safely parse URL parameters with validation
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    // Get and validate parameters
    const query = searchParams.get('query') || ''
    const manufacturer = searchParams.get('manufacturer') || ''
    const searchType = searchParams.get('searchType') as 'all' | 'brand' | 'flavor' | null
    const pageParam = searchParams.get('page')
    const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1
    
    if (isNaN(page)) {
      return NextResponse.json(
        { error: 'Invalid page parameter' },
        { status: 400 }
      )
    }

    const itemsPerPage = 12

    // Start with all data
    let filteredData = [...shishaData]

    // Filter by manufacturer if specified (大文字小文字を無視)
    if (manufacturer) {
      const normalizedSearchBrand = normalizeBrandForSearch(manufacturer)
      filteredData = filteredData.filter(item => {
        const normalizedItemBrand = normalizeBrandForSearch(item.manufacturer)
        return normalizedItemBrand === normalizedSearchBrand
      })
    }

    // Then apply search query if specified
    if (query) {
      const searchTerms = query.toLowerCase().split(' ')
      filteredData = filteredData.filter(item => {
        // 検索タイプに基づいてフィルタリング
        if (searchType === 'brand') {
          // ブランド名のみで検索
          const brandText = item.manufacturer.toLowerCase()
          return searchTerms.every(term => brandText.includes(term))
        } else if (searchType === 'flavor') {
          // フレーバー名のみで検索
          const flavorText = item.productName.toLowerCase()
          return searchTerms.every(term => flavorText.includes(term))
        } else {
          // すべてで検索（デフォルト）
          const searchText = `${item.manufacturer} ${item.productName} ${item.amount} ${item.country}`.toLowerCase()
          return searchTerms.every(term => searchText.includes(term))
        }
      })
    }

    // Calculate pagination
    const totalItems = filteredData.length
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
    const validPage = Math.min(page, totalPages) // Ensure page doesn't exceed total pages
    const startIndex = (validPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const paginatedItems = filteredData.slice(startIndex, endIndex)

    return NextResponse.json({
      items: paginatedItems,
      totalPages,
      currentPage: validPage,
      totalItems,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}