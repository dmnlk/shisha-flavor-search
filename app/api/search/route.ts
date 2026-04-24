import { NextRequest, NextResponse } from 'next/server'

import { resolveFlavorImage } from '../../../data/flavorImages'
import { shishaData } from '../../../data/shishaData'
import { fuzzySearch, type SearchType } from '../../../lib/search/fuzzySearch'
import { normalizeBrandForSearch } from '../../../lib/utils/brandNormalizer'
import type { SearchResponse, ShishaFlavor } from '../../../types/shisha'

export const dynamic = 'force-dynamic'

function coerceSearchType(value: string | null): SearchType {
  return value === 'brand' || value === 'flavor' ? value : 'all'
}

export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse | { error: string }>> {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const query = searchParams.get('query') || ''
    const manufacturer = searchParams.get('manufacturer') || ''
    const searchType = coerceSearchType(searchParams.get('searchType'))
    const pageParam = searchParams.get('page')
    const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1

    if (isNaN(page)) {
      return NextResponse.json(
        { error: 'Invalid page parameter' },
        { status: 400 }
      )
    }

    const itemsPerPage = 12

    // クエリがあれば fuzzy 検索 (スコア順) にかける。空クエリ時は全件そのまま。
    let filteredData: ShishaFlavor[] = query
      ? fuzzySearch(query, searchType)
      : (shishaData as ShishaFlavor[])

    // メーカー絞り込みはファジー結果の順序を保ったまま後段でフィルタ。
    if (manufacturer) {
      const normalizedSearchBrand = normalizeBrandForSearch(manufacturer)
      filteredData = filteredData.filter(
        item => normalizeBrandForSearch(item.manufacturer) === normalizedSearchBrand
      )
    }

    const totalItems = filteredData.length
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
    const validPage = Math.min(page, totalPages)
    const startIndex = (validPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const paginatedItems = filteredData.slice(startIndex, endIndex).map(resolveFlavorImage)

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
