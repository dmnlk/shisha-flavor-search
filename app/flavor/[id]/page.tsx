import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { resolveFlavorImage } from '../../../data/flavorImages'
import { shishaData } from '../../../data/shishaData'
import type { ShishaFlavor } from '../../../types/shisha'

import FlavorDetailClient from './FlavorDetailClient'

interface PageProps {
  params: Promise<{ id: string }>
}

function findFlavor(id: string): ShishaFlavor | null {
  const parsed = Number(id)
  if (!Number.isFinite(parsed)) return null
  const hit = (shishaData as ShishaFlavor[]).find((f) => f.id === parsed)
  return hit ? resolveFlavorImage(hit) : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const flavor = findFlavor(id)
  if (!flavor) {
    return { title: 'Flavor not found | Shisha Flavor Ledger' }
  }
  return {
    title: `${flavor.productName} — ${flavor.manufacturer} | Shisha Flavor Ledger`,
    description: `${flavor.manufacturer} / ${flavor.productName} · ${flavor.amount} · ${flavor.country} · ${flavor.price}`,
  }
}

export default async function FlavorDetailPage({ params }: PageProps) {
  const { id } = await params
  const flavor = findFlavor(id)
  if (!flavor) notFound()
  return <FlavorDetailClient flavor={flavor} />
}
