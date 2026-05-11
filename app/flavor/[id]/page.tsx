import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { resolveFlavorImage } from '../../../data/flavorImages'
import { shishaData } from '../../../data/shishaData'
import { brandSlug, normalizeBrandForSearch } from '../../../lib/utils/brandNormalizer'
import { escapeJsonLd } from '../../../lib/utils/jsonLd'
import { parseJpyPrice } from '../../../lib/utils/priceParser'
import type { ShishaFlavor } from '../../../types/shisha'

import FlavorDetailClient from './FlavorDetailClient'

interface PageProps {
  params: Promise<{ id: string }>
}

const RELATED_COUNT = 6

function findFlavor(id: string): ShishaFlavor | null {
  const parsed = Number(id)
  if (!Number.isFinite(parsed)) return null
  const hit = (shishaData as ShishaFlavor[]).find((f) => f.id === parsed)
  return hit ? resolveFlavorImage(hit) : null
}

function findRelatedFlavors(flavor: ShishaFlavor, count: number): ShishaFlavor[] {
  const target = normalizeBrandForSearch(flavor.manufacturer)
  const related: ShishaFlavor[] = []
  for (const item of shishaData as ShishaFlavor[]) {
    if (item.id === flavor.id) continue
    if (normalizeBrandForSearch(item.manufacturer) !== target) continue
    related.push(resolveFlavorImage(item))
    if (related.length >= count) break
  }
  return related
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const flavor = findFlavor(id)
  if (!flavor) {
    return { title: 'フレーバーが見つかりませんでした' }
  }
  const title = `${flavor.productName}(${flavor.manufacturer}) シーシャ フレーバー — ${flavor.price} / ${flavor.amount}`
  const description = `${flavor.manufacturer}「${flavor.productName}」のシーシャ用フレーバー情報。内容量 ${flavor.amount}、原産国 ${flavor.country}、小売定価 ${flavor.price}。${flavor.description ? `テイスティングノート: ${flavor.description}` : '日本国内の流通情報を財務省「製造たばこ小売定価」公告に基づいて掲載しています。'}`
  const path = `/flavor/${flavor.id}`
  const images = flavor.imageUrl
    ? [{ url: flavor.imageUrl, alt: `${flavor.manufacturer} ${flavor.productName} シーシャ フレーバー` }]
    : undefined
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
      images,
    },
    twitter: {
      card: flavor.imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: flavor.imageUrl ? [flavor.imageUrl] : undefined,
    },
  }
}

export default async function FlavorDetailPage({ params }: PageProps) {
  const { id } = await params
  const flavor = findFlavor(id)
  if (!flavor) notFound()
  const related = findRelatedFlavors(flavor, RELATED_COUNT)

  const price = parseJpyPrice(flavor.price)
  const productJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${flavor.productName} (${flavor.manufacturer})`,
    brand: { '@type': 'Brand', name: flavor.manufacturer },
    category: 'シーシャ フレーバー / 水たばこ',
    countryOfOrigin: flavor.country,
    description:
      flavor.description ??
      `${flavor.manufacturer}「${flavor.productName}」のシーシャ用フレーバー。内容量 ${flavor.amount}、原産国 ${flavor.country}、小売定価 ${flavor.price}。`,
  }
  if (flavor.imageUrl) {
    productJsonLd.image = flavor.imageUrl
  }
  if (price !== null) {
    productJsonLd.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
      areaServed: 'JP',
    }
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: '/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: flavor.manufacturer,
        item: `/brands/${brandSlug(flavor.manufacturer)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: flavor.productName,
        item: `/flavor/${flavor.id}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(breadcrumbJsonLd) }}
      />
      <FlavorDetailClient flavor={flavor} related={related} />
    </>
  )
}
