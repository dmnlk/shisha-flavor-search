/**
 * ビルド時にデータセットから派生ファイルを生成する。
 *
 * package.json の dev / build / test / typecheck が `tsx scripts/build-data.ts && ...`
 * の形でこのスクリプトを毎回前段実行するため、生成物は常に最新になる (git 管理外)。
 *
 *   - data/generated/searchIndex.json
 *       Fuse 用に必要な最小フィールドだけを NFKC + カナ寄せ済みで持つ配列。
 *       fuzzySearch は boot 時の正規化ループをこのファイル読み込みに置き換える。
 *   - data/generated/brands.json
 *       /api/brands が参照するブランド一覧 (name, slug, count, sampleFlavors)。
 *       これにより brands API から 1.4MB の shishaData 依存を外せる。
 *   - data/generated/updateState.json
 *       .claude/shisha-update-state.json から lastDataUpdated と lastAddedIds
 *       だけを抽出。ランタイム (Cloudflare Workers) で node:fs を呼ばずに済むよう
 *       ビルド時にスナップショット化する。
 *   - data/generated/brandImageMap.json
 *       public/images/brands/ を走査して slug → 公開 URL のマップを作る。
 *       同上、ランタイムで readdirSync を呼ばないようにするため。
 *   - data/generated/flavorTags.json
 *       フレーバーid → タグスラッグ配列。lib/tags/flavorTagger.ts の辞書 +
 *       data/flavorTagOverrides.ts (AI分類) から導出。タグが付いた項目のみ持つ。
 */
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  type FlavorTagSlug,
  flavorTagLabel,
  flavorTagLabelEn,
} from '../data/flavorTagTaxonomy'
import { shishaData } from '../data/shishaData.js'
import { tagFlavorName } from '../lib/tags/flavorTagger'
import {
  brandSlug,
  getUniqueBrands,
  normalizeBrandForSearch,
} from '../lib/utils/brandNormalizer'
import { normalizeForSearch } from '../lib/utils/japaneseNormalizer'
import type { ShishaFlavor } from '../types/shisha'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'data', 'generated')
const CACHE_FILE = path.join(ROOT, '.build-cache')
const DATA_SOURCE = path.join(ROOT, 'data', 'shishaData.js')
const SCRIPT_PATH = path.join(ROOT, 'scripts', 'build-data.ts')
const BRAND_IMAGES_DIR = path.join(ROOT, 'public', 'images', 'brands')

const CACHE_VERSION = 2

// flavorTags.json はこの3ファイルの内容にも依存するため、キャッシュ判定に含める。
const TAG_SOURCE_FILES = [
  path.join(ROOT, 'lib', 'tags', 'flavorTagger.ts'),
  path.join(ROOT, 'data', 'flavorTagTaxonomy.ts'),
  path.join(ROOT, 'data', 'flavorTagOverrides.ts'),
]

interface CacheShape {
  version?: number
  shishaDataHash?: string
  scriptHash?: string
  brandImagesHash?: string
  tagSourcesHash?: string
}

function fileHash(p: string): string {
  return createHash('sha256').update(readFileSync(p)).digest('hex')
}

function tagSourcesHash(): string {
  const hash = createHash('sha256')
  for (const p of TAG_SOURCE_FILES) hash.update(readFileSync(p))
  return hash.digest('hex')
}

// brandImageMap.json depends only on the directory listing, so hashing the
// sorted filenames is enough to invalidate the cache on add/remove/rename.
function brandImagesListingHash(): string {
  const listing = existsSync(BRAND_IMAGES_DIR) ? readdirSync(BRAND_IMAGES_DIR).sort().join('\n') : ''
  return createHash('sha256').update(listing).digest('hex')
}

function loadCache(): CacheShape {
  if (!existsSync(CACHE_FILE)) return {}
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf-8')) as CacheShape
  } catch {
    return {}
  }
}

function isCacheHit(): boolean {
  if (!existsSync(OUT_DIR)) return false
  // Check all 4 expected output files exist
  const expectedFiles = ['searchIndex.json', 'brands.json', 'updateState.json', 'brandImageMap.json', 'flavorTags.json']
  for (const f of expectedFiles) {
    if (!existsSync(path.join(OUT_DIR, f))) return false
  }
  const cache = loadCache()
  if (cache.version !== CACHE_VERSION) return false
  if (!cache.shishaDataHash || !cache.scriptHash || !cache.brandImagesHash || !cache.tagSourcesHash) return false
  return cache.shishaDataHash === fileHash(DATA_SOURCE)
    && cache.scriptHash === fileHash(SCRIPT_PATH)
    && cache.brandImagesHash === brandImagesListingHash()
    && cache.tagSourcesHash === tagSourcesHash()
}

async function writeCache(): Promise<void> {
  const payload: CacheShape = {
    version: CACHE_VERSION,
    shishaDataHash: fileHash(DATA_SOURCE),
    scriptHash: fileHash(SCRIPT_PATH),
    brandImagesHash: brandImagesListingHash(),
    tagSourcesHash: tagSourcesHash(),
  }
  await writeFile(CACHE_FILE, JSON.stringify(payload, null, 2))
}

interface IndexedFlavor {
  id: number
  manufacturer: string
  productName: string
  all: string
}

interface GeneratedBrand {
  name: string
  slug: string
  count: number
  sampleFlavors: string[]
}

interface UpdateStateSnapshot {
  lastDataUpdated: string | null
  lastAddedIds: number[]
}

const BRAND_IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.avif'])

function buildFlavorTagsMap(data: ShishaFlavor[]): Record<number, FlavorTagSlug[]> {
  const map: Record<number, FlavorTagSlug[]> = {}
  for (const item of data) {
    const tags = tagFlavorName(item.productName, item.manufacturer)
    if (tags.length > 0) map[item.id] = tags
  }
  return map
}

function buildSearchIndex(
  data: ShishaFlavor[],
  flavorTags: Record<number, FlavorTagSlug[]>
): IndexedFlavor[] {
  return data.map(item => {
    const manufacturer = normalizeForSearch(item.manufacturer)
    const productName = normalizeForSearch(item.productName)
    const amount = normalizeForSearch(item.amount)
    const country = normalizeForSearch(item.country)
    // タグの和名/英名もテキスト検索対象に入れる。「ミント」で "Peppermint" のような
    // 名前にラベル経由でヒットさせるため。
    const tagText = (flavorTags[item.id] ?? [])
      .map(slug => normalizeForSearch(`${flavorTagLabel(slug)} ${flavorTagLabelEn(slug)}`))
      .join(' ')
    return {
      id: item.id,
      manufacturer,
      productName,
      // 空フィールドが混ざっても余分な空白を残さないよう filter してから join
      all: [manufacturer, productName, amount, country, tagText].filter(Boolean).join(' '),
    }
  })
}

function buildBrandsSummary(data: ShishaFlavor[]): GeneratedBrand[] {
  const buckets = new Map<string, { count: number; samples: string[] }>()

  for (const item of data) {
    const key = normalizeBrandForSearch(item.manufacturer)
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.count += 1
      if (bucket.samples.length < 3) bucket.samples.push(item.productName)
    } else {
      buckets.set(key, {
        count: 1,
        samples: [item.productName],
      })
    }
  }

  const uniqueNames = getUniqueBrands(data.map(i => i.manufacturer))
  return uniqueNames.map(name => {
    const bucket = buckets.get(normalizeBrandForSearch(name))
    return {
      name,
      slug: brandSlug(name),
      count: bucket?.count ?? 0,
      sampleFlavors: bucket?.samples ?? [],
    }
  })
}

function buildUpdateStateSnapshot(): UpdateStateSnapshot {
  const statePath = path.join(ROOT, '.claude', 'shisha-update-state.json')
  try {
    const raw = JSON.parse(readFileSync(statePath, 'utf-8')) as Record<string, unknown>
    const iso = typeof raw.last_data_updated === 'string' ? raw.last_data_updated : null
    const lastAddedIds = Array.isArray(raw.last_added_ids)
      ? (raw.last_added_ids as unknown[]).filter((v): v is number => typeof v === 'number')
      : []
    return { lastDataUpdated: iso, lastAddedIds }
  } catch {
    return { lastDataUpdated: null, lastAddedIds: [] }
  }
}

function buildBrandImageMap(): Record<string, string> {
  const dir = path.join(ROOT, 'public', 'images', 'brands')
  if (!existsSync(dir)) return {}
  const entries: Record<string, string> = {}
  for (const file of readdirSync(dir)) {
    const ext = path.extname(file).toLowerCase()
    if (!BRAND_IMAGE_EXTENSIONS.has(ext)) continue
    const slug = path.basename(file, ext).toLowerCase()
    entries[slug] = `/images/brands/${file}`
  }
  return entries
}

async function main(): Promise<void> {
  if (isCacheHit()) {
    console.warn('[build-data] cache hit, skipping...')
    return
  }

  const data = shishaData as ShishaFlavor[]

  const flavorTags = buildFlavorTagsMap(data)
  const searchIndex = buildSearchIndex(data, flavorTags)
  const brands = buildBrandsSummary(data)
  const updateState = buildUpdateStateSnapshot()
  const brandImageMap = buildBrandImageMap()

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(
    path.join(OUT_DIR, 'searchIndex.json'),
    JSON.stringify(searchIndex)
  )
  await writeFile(
    path.join(OUT_DIR, 'brands.json'),
    JSON.stringify(brands)
  )
  await writeFile(
    path.join(OUT_DIR, 'updateState.json'),
    JSON.stringify(updateState)
  )
  await writeFile(
    path.join(OUT_DIR, 'brandImageMap.json'),
    JSON.stringify(brandImageMap)
  )
  await writeFile(
    path.join(OUT_DIR, 'flavorTags.json'),
    JSON.stringify(flavorTags)
  )

  await writeCache()

  console.warn(
    `[build-data] searchIndex=${searchIndex.length} flavors, brands=${brands.length}, brandImages=${Object.keys(brandImageMap).length}, taggedFlavors=${Object.keys(flavorTags).length}, lastDataUpdated=${updateState.lastDataUpdated ?? 'null'}`
  )
}

main().catch(err => {
  console.error('[build-data] failed:', err)
  process.exit(1)
})
