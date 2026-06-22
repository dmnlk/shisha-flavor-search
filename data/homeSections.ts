import { BRAND_DESCRIPTIONS } from './brandDescriptions'
import { getBrandImageUrl } from './brandImages'
import { EDITORS_PICKS } from './curatedPicks'
import { resolveFlavorImage } from './flavorImages'
import updateState from './generated/updateState.json'
import { shishaData } from './shishaData'
import { brandSlug, getUniqueBrands, normalizeBrandForSearch, normalizeBrandName } from '../lib/utils/brandNormalizer'
import { getCountryDisplay } from '../lib/utils/countryDisplay'
import type { ShishaFlavor } from '../types/shisha'

/**
 * Server-only helpers for the home page editorial sections.
 * Imports build-time generated JSON for fs-derived data so this module
 * stays Workers-runtime-safe.
 */

export interface FeaturedBrand {
  name: string
  slug: string
  description: string
  imageUrl?: string
  count: number
}

export interface OriginBucket {
  code: string
  label: string
  flag: string
  total: number
  flavors: ShishaFlavor[]
}

export interface EditorsPickFlavor {
  flavor: ShishaFlavor
  note?: string
}

function hasImage(flavor: ShishaFlavor): boolean {
  if (flavor.imageUrl && flavor.imageUrl.trim() !== '') return true
  const resolved = resolveFlavorImage(flavor)
  return Boolean(resolved.imageUrl && resolved.imageUrl.trim() !== '')
}

function countByBrand(): Map<string, { displayName: string; count: number }> {
  const counts = new Map<string, { displayName: string; count: number }>()
  for (const item of shishaData) {
    const key = normalizeBrandForSearch(item.manufacturer)
    const entry = counts.get(key)
    if (entry) {
      entry.count += 1
    } else {
      counts.set(key, { displayName: normalizeBrandName(item.manufacturer), count: 1 })
    }
  }
  return counts
}

/**
 * Picks up to `limit` brands that have BOTH a hand-written description
 * and a local logo, ordered by flavor count (descending).
 */
export function getFeaturedBrands(limit = 8): FeaturedBrand[] {
  const counts = countByBrand()
  const candidates: FeaturedBrand[] = []

  for (const name of getUniqueBrands(shishaData.map(i => i.manufacturer))) {
    const slug = brandSlug(name)
    const description = BRAND_DESCRIPTIONS[slug]
    const imageUrl = getBrandImageUrl(name)
    if (!description || !imageUrl) continue
    const entry = counts.get(normalizeBrandForSearch(name))
    candidates.push({
      name,
      slug,
      description,
      imageUrl,
      count: entry?.count ?? 0,
    })
  }

  candidates.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  return candidates.slice(0, limit)
}

function getLastAddedIds(): number[] {
  return updateState.lastAddedIds
}

/**
 * Returns the most recently added flavors.
 * Reads last_added_ids from shisha-update-state.json (set by merge_into_data.py)
 * so results reflect actual insertion order, not alphabetical ID position.
 * The recorded additions always lead (image-bearing first); when there are
 * fewer than `limit` of them, the result is topped up with image-bearing tail
 * entries rather than discarding the recent ones. Falls back entirely to the
 * tail when no state is available.
 */
export function getLatestFlavors(limit = 6): ShishaFlavor[] {
  const seen = new Set<number>()
  const picked: ShishaFlavor[] = []
  const take = (flavors: ShishaFlavor[]): void => {
    for (const f of flavors) {
      if (picked.length >= limit) break
      if (seen.has(f.id)) continue
      seen.add(f.id)
      picked.push(f)
    }
  }

  // Primary: most recently added flavors recorded by the update pipeline.
  const lastAddedIds = getLastAddedIds()
  if (lastAddedIds.length > 0) {
    const byId = new Map(shishaData.map(f => [f.id, f] as const))
    const candidates = lastAddedIds
      .map(id => byId.get(id))
      .filter((f): f is ShishaFlavor => f !== undefined)
      .map(resolveFlavorImage)
    take(candidates.filter(hasImage))
    take(candidates.filter(f => !hasImage(f)))
    if (picked.length >= limit) return picked
  }

  // Top up (or fall back) with the most recently inserted flavors. IDs are
  // assigned sequentially (max id + 1 by the update pipeline), so descending
  // id reflects insertion order — not the array's alphabetical tail. Image-
  // bearing first so the cards render well.
  const byRecency = [...shishaData].sort((a, b) => b.id - a.id).map(resolveFlavorImage)
  take(byRecency.filter(hasImage))
  take(byRecency.filter(f => !hasImage(f)))
  return picked.slice(0, limit)
}

const ORIGIN_ORDER: Array<{ code: string; keys: string[] }> = [
  { code: 'US', keys: ['アメリカ合衆国', 'USA', 'アメリ力合衆国'] },
  { code: 'JO', keys: ['ヨルダン', 'Jordan'] },
  { code: 'TR', keys: ['トルコ'] },
  { code: 'AE', keys: ['アラブ首長国連邦', 'UAE', 'U.A.E'] },
  { code: 'RU', keys: ['ロシア'] },
]

export function getOriginBuckets(perBucket = 6): OriginBucket[] {
  const buckets: OriginBucket[] = []
  for (const { code, keys } of ORIGIN_ORDER) {
    const all = shishaData.filter(f => keys.includes(f.country))
    const imaged: ShishaFlavor[] = []
    const others: ShishaFlavor[] = []
    for (const f of all) {
      const resolved = resolveFlavorImage(f)
      if (hasImage(resolved)) imaged.push(resolved)
      else others.push(resolved)
    }
    const flavors = [...imaged, ...others].slice(0, perBucket)
    const display = getCountryDisplay(keys[0])
    buckets.push({
      code,
      label: display?.label ?? keys[0],
      flag: display?.flag ?? '',
      total: all.length,
      flavors,
    })
  }
  return buckets
}

export function getEditorsPicks(): EditorsPickFlavor[] {
  const byId = new Map(shishaData.map(f => [f.id, f] as const))
  const picks: EditorsPickFlavor[] = []
  for (const { id, note } of EDITORS_PICKS) {
    const flavor = byId.get(id)
    if (!flavor) continue
    picks.push({ flavor: resolveFlavorImage(flavor), note })
  }
  return picks
}
