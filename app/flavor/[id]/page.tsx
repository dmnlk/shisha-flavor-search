import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { resolveFlavorImage } from '../../../data/flavorImages'
import { shishaData } from '../../../data/shishaData'
import { normalizeBrandForSearch } from '../../../lib/utils/brandNormalizer'
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
    return { title: 'Flavor not found | Shisha Flavor Ledger' }
  }
  const title = `${flavor.productName} — ${flavor.manufacturer} | Shisha Flavor Ledger`
  const description = `${flavor.manufacturer} / ${flavor.productName} · ${flavor.amount} · ${flavor.country} · ${flavor.price}`
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

export default async function FlavorDetailPage({ params }: PageProps) {
  const { id } = await params
  const flavor = findFlavor(id)
  if (!flavor) notFound()
  const related = findRelatedFlavors(flavor, RELATED_COUNT)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: flavor.productName ?? '',
    brand: { '@type': 'Brand', name: flavor.manufacturer ?? '' },
    description: flavor.description ?? '',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FlavorDetailClient flavor={flavor} related={related} />
    </>
  )
}
