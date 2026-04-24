import Fuse from 'fuse.js'

import { shishaData } from '../../data/shishaData'
import type { ShishaFlavor } from '../../types/shisha'
import { normalizeForSearch, tokenizeForSearch } from '../utils/japaneseNormalizer'

export type SearchType = 'all' | 'brand' | 'flavor'

interface IndexedFlavor {
  id: number
  manufacturer: string
  productName: string
  all: string
}

const baseFuseOptions = {
  includeScore: true,
  shouldSort: true,
  ignoreLocation: true,
  threshold: 0.35,
  minMatchCharLength: 1,
  useExtendedSearch: true,
} as const

// モジュール初期化時に一度だけ全件を正規化してインデックス化する。
// 以降のリクエストで再利用することで、5.3k 件データのスキャンが 1 回に抑えられる。
const allItems = shishaData as ShishaFlavor[]
const itemsById = new Map<number, ShishaFlavor>(allItems.map(item => [item.id, item]))

const indexedFlavors: IndexedFlavor[] = allItems.map(item => ({
  id: item.id,
  manufacturer: normalizeForSearch(item.manufacturer),
  productName: normalizeForSearch(item.productName),
  all: normalizeForSearch(
    `${item.manufacturer} ${item.productName} ${item.amount} ${item.country}`
  ),
}))

const fuseByType: Record<SearchType, Fuse<IndexedFlavor>> = {
  all: new Fuse(indexedFlavors, { ...baseFuseOptions, keys: ['all'] }),
  brand: new Fuse(indexedFlavors, { ...baseFuseOptions, keys: ['manufacturer'] }),
  flavor: new Fuse(indexedFlavors, { ...baseFuseOptions, keys: ['productName'] }),
}

/**
 * クエリをファジー検索にかけて、スコア順 (ベスト先頭) の ShishaFlavor 配列を返す。
 *
 * - 複数トークンは extended search の AND セマンティクスで扱う
 *   (各トークンがファジーマッチ、全トークンが一致する項目のみ返る)
 * - 空クエリ時は全件を元の順で返す (ページネーションは呼び出し側で行う前提)
 */
export function fuzzySearch(query: string, searchType: SearchType = 'all'): ShishaFlavor[] {
  const tokens = tokenizeForSearch(query)
  if (tokens.length === 0) return allItems

  const pattern = tokens.join(' ')
  const fuse = fuseByType[searchType]
  const results = fuse.search(pattern)

  const hits: ShishaFlavor[] = []
  for (const { item } of results) {
    const original = itemsById.get(item.id)
    if (original) hits.push(original)
  }
  return hits
}
