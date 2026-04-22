import { NextResponse } from 'next/server'

import { shishaData } from '../../../data/shishaData'
import { getBrandImageUrl } from '../../../data/brandImages'
import { getUniqueBrands, normalizeBrandName, normalizeBrandForSearch } from '../../../lib/utils/brandNormalizer'

export interface BrandSummary {
  name: string
  count: number
  sampleFlavors: string[]
  imageUrl?: string
}

export async function GET(): Promise<NextResponse<BrandSummary[]>> {
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

  const uniqueBrands = getUniqueBrands(shishaData.map(i => i.manufacturer))
  const brands: BrandSummary[] = uniqueBrands.map(name => {
    const entry = counts.get(normalizeBrandForSearch(name))
    return {
      name,
      count: entry?.count ?? 0,
      sampleFlavors: entry?.samples ?? [],
      imageUrl: getBrandImageUrl(name),
    }
  })

  return NextResponse.json(brands)
}
