import { shishaData } from './shishaData'
import { getUniqueBrands, normalizeBrandForSearch } from '../lib/utils/brandNormalizer'
import { normalizeForSearch } from '../lib/utils/japaneseNormalizer'
import type { ShishaFlavor } from '../types/shisha'

interface SearchParams {
  query?: string
  manufacturer?: string
  page?: number
  limit?: number
}

interface SearchResult {
  data: ShishaFlavor[]
  totalPages: number
  currentPage: number
  totalItems: number
}

export function searchFlavors({ query = '', manufacturer = '', page = 1, limit = 12 }: SearchParams): SearchResult {
  let filteredData = [...shishaData]

  // Filter by search query (日本語正規化: ひらがな/カタカナ/全角半角を吸収)
  const searchTerm = normalizeForSearch(query)
  if (searchTerm) {
    filteredData = filteredData.filter(item =>
      normalizeForSearch(item.productName).includes(searchTerm) ||
      normalizeForSearch(item.manufacturer).includes(searchTerm) ||
      normalizeForSearch(item.amount).includes(searchTerm) ||
      normalizeForSearch(item.country).includes(searchTerm)
    )
  }

  // Filter by manufacturer (大文字小文字を無視して比較)
  if (manufacturer) {
    const normalizedSearchBrand = normalizeBrandForSearch(manufacturer)
    filteredData = filteredData.filter(item => {
      const normalizedItemBrand = normalizeBrandForSearch(item.manufacturer)
      return normalizedItemBrand === normalizedSearchBrand
    })
  }

  // Calculate pagination
  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = filteredData.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    totalPages,
    currentPage: page,
    totalItems,
  }
}

export function getFlavorById(id: number): ShishaFlavor | undefined {
  return shishaData.find(item => item.id === id)
}

export function getManufacturers(): string[] {
  const allManufacturers = shishaData.map(item => item.manufacturer)
  return getUniqueBrands(allManufacturers)
}

export function getRandomFlavors(count = 12): ShishaFlavor[] {
  const shuffled = [...shishaData].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}