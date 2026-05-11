import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getBrandDescription } from '../../../data/brandDescriptions'
import { brandSlug, getBrandImageUrl } from '../../../data/brandImages'
import { resolveFlavorImage } from '../../../data/flavorImages'
import { shishaData } from '../../../data/shishaData'
import { normalizeBrandName } from '../../../lib/utils/brandNormalizer'
import { escapeJsonLd } from '../../../lib/utils/jsonLd'
import type { ShishaFlavor } from '../../../types/shisha'

import BrandDetailClient from './BrandDetailClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = new Set<string>()
  for (const item of shishaData as ShishaFlavor[]) {
    slugs.add(brandSlug(item.manufacturer))
  }
  return Array.from(slugs).map((slug) => ({ slug }))
}

export const dynamicParams = false

interface ResolvedBrand {
  displayName: string
  flavors: ShishaFlavor[]
  imageUrl?: string
}

function resolveBrand(slug: string): ResolvedBrand | null {
  const target = slug.toLowerCase()
  const flavors = shishaData
    .filter((item: ShishaFlavor) => brandSlug(item.manufacturer) === target)
    .map(resolveFlavorImage)
  if (flavors.length === 0) return null
  const displayName = normalizeBrandName(flavors[0].manufacturer)
  return {
    displayName,
    flavors,
    imageUrl: getBrandImageUrl(displayName),
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const brand = resolveBrand(slug)
  if (!brand) {
    return { title: 'ブランドが見つかりませんでした' }
  }
  const blurb = getBrandDescription(slug)
  const title = `${brand.displayName} シーシャ フレーバー一覧 — 全${brand.flavors.length}種類`
  const description = blurb
    ? `${brand.displayName} のシーシャフレーバー全${brand.flavors.length}種類を一覧表示。${blurb} 内容量・原産国・小売定価まで日本の流通情報を網羅。`
    : `${brand.displayName} のシーシャ(水たばこ)フレーバー全${brand.flavors.length}種類を一覧表示。内容量・原産国・小売定価まで、日本国内の流通情報を網羅した一覧ページ。`
  const path = `/brands/${slug.toLowerCase()}`
  const images = brand.imageUrl
    ? [{ url: brand.imageUrl, alt: `${brand.displayName} シーシャ ブランドロゴ` }]
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
      card: brand.imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: brand.imageUrl ? [brand.imageUrl] : undefined,
    },
  }
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params
  const brand = resolveBrand(slug)
  if (!brand) notFound()

  const brandDescription = getBrandDescription(slug)
  const brandJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.displayName,
    url: `/brands/${slug.toLowerCase()}`,
  }
  if (brand.imageUrl) brandJsonLd.logo = brand.imageUrl
  if (brandDescription) brandJsonLd.description = brandDescription

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${brand.displayName} シーシャ フレーバー一覧`,
    numberOfItems: brand.flavors.length,
    itemListElement: brand.flavors.slice(0, 50).map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `/flavor/${f.id}`,
      name: f.productName,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'ブランド一覧', item: '/brands' },
      {
        '@type': 'ListItem',
        position: 3,
        name: brand.displayName,
        item: `/brands/${slug.toLowerCase()}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(brandJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(breadcrumbJsonLd) }}
      />
      <BrandDetailClient
        slug={slug.toLowerCase()}
        brandName={brand.displayName}
        flavors={brand.flavors}
        imageUrl={brand.imageUrl}
        description={brandDescription}
      />
    </>
  )
}
