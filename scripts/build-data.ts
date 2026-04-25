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
 */
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

async function main(): Promise<void> {
  const data = shishaData as ShishaFlavor[]

  const searchIndex = buildSearchIndex(data)
  const brands = buildBrandsSummary(data)

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(
    path.join(OUT_DIR, 'searchIndex.json'),
    JSON.stringify(searchIndex)
  )
  await writeFile(
    path.join(OUT_DIR, 'brands.json'),
    JSON.stringify(brands)
  )

  console.warn(
    `[build-data] searchIndex=${searchIndex.length} flavors, brands=${brands.length}`
  )
}

main().catch(err => {
  console.error('[build-data] failed:', err)
  process.exit(1)
})
