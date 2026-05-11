import type { Metadata } from 'next'

import { getBrandImageUrl } from '../../data/brandImages'
import { shishaData } from '../../data/shishaData'
import { brandSlug, getUniqueBrands, normalizeBrandForSearch, normalizeBrandName } from '../../lib/utils/brandNormalizer'
import { escapeJsonLd } from '../../lib/utils/jsonLd'
import type { BrandSummary } from '../api/brands/route'

import BrandsClient from './BrandsClient'

export const metadata: Metadata = {
  title: 'シーシャ ブランド一覧 — 全銘柄ディレクトリ',
  description:
    '日本国内で流通しているシーシャ(水たばこ)フレーバーの全ブランド一覧。AlFakher / STARBUZZ / Adalya / Fumari / NAKHLA など主要メーカーから、各ブランドの取扱フレーバー数と代表的な商品名まで一覧で確認できます。',
  alternates: { canonical: '/brands' },
  openGraph: {
    title: 'シーシャ ブランド一覧 — 全銘柄ディレクトリ',
    description:
      '日本で買えるシーシャブランド(AlFakher・STARBUZZ・Adalya 他)を網羅したディレクトリ。',
    url: '/brands',
  },
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
      imageUrl: getBrandImageUrl(name),
    }
  })
}

export default function BrandsPage() {
  const brands = buildBrandSummaries()

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'シーシャ ブランド一覧',
    numberOfItems: brands.length,
    itemListElement: brands.slice(0, 50).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `/brands/${brandSlug(b.name)}`,
      name: b.name,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'ブランド一覧', item: '/brands' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(breadcrumbJsonLd) }}
      />
      <BrandsClient brands={brands} />
    </>
  )
}
