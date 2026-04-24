import { NextResponse } from 'next/server'

import { getBrandImageUrl } from '../../../data/brandImages'

// ビルド時に scripts/build-data.ts が生成するブランドサマリ。
// これにより本ルートは 1.4MB の shishaData に触れずに済む (Vercel のコールドスタート対策)。
import generatedBrands from '../../../data/generated/brands.json'

export interface BrandSummary {
  name: string
  count: number
  sampleFlavors: string[]
  imageUrl?: string
}

interface GeneratedBrand {
  name: string
  slug: string
  count: number
  sampleFlavors: string[]
}

const BRANDS = generatedBrands as GeneratedBrand[]

export async function GET(): Promise<NextResponse<BrandSummary[]>> {
  const brands: BrandSummary[] = BRANDS.map(b => ({
    name: b.name,
    count: b.count,
    sampleFlavors: b.sampleFlavors,
    imageUrl: getBrandImageUrl(b.name),
  }))

  return NextResponse.json(brands)
}
