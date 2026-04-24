import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { shishaData } from '../../../data/shishaData'
import type { ShishaFlavor } from '../../../types/shisha'

import FlavorDetailClient from './FlavorDetailClient'

interface PageProps {
  params: Promise<{ id: string }>
}

function findFlavor(id: string): ShishaFlavor | null {
  const parsed = Number(id)
  if (!Number.isFinite(parsed)) return null
  return (shishaData as ShishaFlavor[]).find((f) => f.id === parsed) ?? null
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
