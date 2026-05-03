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
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { shishaData } from '../data/shishaData.js'
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

function getSourceMtime(): string {
  try {
    return String(statSync(DATA_SOURCE).mtimeMs)
  } catch {
    return ''
  }
}

function isCacheHit(): boolean {
  if (!existsSync(CACHE_FILE)) return false
  if (!existsSync(OUT_DIR)) return false
  // Check all 4 expected output files exist
  const expectedFiles = ['searchIndex.json', 'brands.json', 'updateState.json', 'brandImageMap.json']
  for (const f of expectedFiles) {
    if (!existsSync(path.join(OUT_DIR, f))) return false
  }
  const cached = readFileSync(CACHE_FILE, 'utf-8').trim()
  return cached === getSourceMtime()
}

async function writeCache(): Promise<void> {
  await writeFile(CACHE_FILE, getSourceMtime())
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

function buildSearchIndex(data: ShishaFlavor[]): IndexedFlavor[] {
  return data.map(item => {
    const manufacturer = normalizeForSearch(item.manufacturer)
    const productName = normalizeForSearch(item.productName)
    const amount = normalizeForSearch(item.amount)
    const country = normalizeForSearch(item.country)
    return {
      id: item.id,
      manufacturer,
      productName,
      // 空フィールドが混ざっても余分な空白を残さないよう filter してから join
      all: [manufacturer, productName, amount, country].filter(Boolean).join(' '),
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

  const searchIndex = buildSearchIndex(data)
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

  await writeCache()

  console.warn(
    `[build-data] searchIndex=${searchIndex.length} flavors, brands=${brands.length}, brandImages=${Object.keys(brandImageMap).length}, lastDataUpdated=${updateState.lastDataUpdated ?? 'null'}`
  )
}

main().catch(err => {
  console.error('[build-data] failed:', err)
  process.exit(1)
})
