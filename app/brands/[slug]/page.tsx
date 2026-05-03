import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getBrandDescription } from '../../../data/brandDescriptions'
import { brandSlug, getBrandImageUrl } from '../../../data/brandImages'
import { resolveFlavorImage } from '../../../data/flavorImages'
import { shishaData } from '../../../data/shishaData'
import { normalizeBrandName } from '../../../lib/utils/brandNormalizer'
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
    return { title: 'Brand not found | Shisha Flavor Ledger' }
  }
  const title = `${brand.displayName} — ${brand.flavors.length} flavors | Shisha Flavor Ledger`
  const description = `All ${brand.flavors.length} shisha flavors produced by ${brand.displayName}, indexed in the Shisha Flavor Ledger.`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params
  const brand = resolveBrand(slug)
  if (!brand) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.displayName ?? '',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BrandDetailClient
        slug={slug.toLowerCase()}
        brandName={brand.displayName}
        flavors={brand.flavors}
        imageUrl={brand.imageUrl}
        description={getBrandDescription(slug)}
      />
    </>
  )
}
