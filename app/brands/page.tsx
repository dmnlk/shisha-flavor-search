import type { Metadata } from 'next'

import { shishaData } from '../../data/shishaData'
import { getUniqueBrands, normalizeBrandForSearch, normalizeBrandName } from '../../lib/utils/brandNormalizer'
import type { BrandSummary } from '../api/brands/route'

import BrandsClient from './BrandsClient'

export const metadata: Metadata = {
  title: 'Brand Directory | Shisha Flavor Search',
  description: '取り扱いシーシャブランドの一覧。ブランドから好みのフレーバーを探しましょう。',
}

function buildBrandSummaries(): BrandSummary[] {
  const counts = new Map<string, { displayName: string; count: number; samples: string[] }>()

  for (const item of shishaData) {
    const key = normalizeBrandForSearch(item.manufacturer)
    const entry = counts.get(key)
    if (entry) {
      entry.count += 1
      if (entry.samples.length < 3) {
        entry.samples.push(item.productName)
      }
    } else {
      counts.set(key, {
        displayName: normalizeBrandName(item.manufacturer),
        count: 1,
        samples: [item.productName],
      })
    }
  }

  return getUniqueBrands(shishaData.map(i => i.manufacturer)).map(name => {
    const entry = counts.get(normalizeBrandForSearch(name))
    return {
      name,
      count: entry?.count ?? 0,
      sampleFlavors: entry?.samples ?? [],
    }
  })
}

export default function BrandsPage() {
  const brands = buildBrandSummaries()
  return <BrandsClient brands={brands} />
}
