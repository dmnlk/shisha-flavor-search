import { BRAND_DESCRIPTIONS } from './brandDescriptions'
import { getBrandImageUrl } from './brandImages'
import { EDITORS_PICKS } from './curatedPicks'
import { resolveFlavorImage } from './flavorImages'
import { shishaData } from './shishaData'
import { brandSlug, getUniqueBrands, normalizeBrandForSearch, normalizeBrandName } from '../lib/utils/brandNormalizer'
import { getCountryDisplay } from '../lib/utils/countryDisplay'
import type { ShishaFlavor } from '../types/shisha'

/**
 * Server-only helpers for the home page editorial sections.
 * Imports `data/brandImages` / `data/flavorImages` which use `node:fs`,
 * so this module must only be consumed from server components.
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

/**
 * Returns the most recently indexed flavors (highest ids) that have an
 * image available, capped at `limit`. Falls back to the raw tail when
 * fewer than `limit` imaged entries exist.
 */
export function getLatestFlavors(limit = 8): ShishaFlavor[] {
  const picked: ShishaFlavor[] = []
  for (let i = shishaData.length - 1; i >= 0 && picked.length < limit; i--) {
    const resolved = resolveFlavorImage(shishaData[i])
    if (hasImage(resolved)) picked.push(resolved)
  }
  if (picked.length < limit) {
    for (let i = shishaData.length - 1; i >= 0 && picked.length < limit; i--) {
      if (picked.find(p => p.id === shishaData[i].id)) continue
      picked.push(resolveFlavorImage(shishaData[i]))
    }
  }
  return picked
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
