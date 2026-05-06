import type { MetadataRoute } from 'next'

import { shishaData } from '../data/shishaData'
import { brandSlug } from '../lib/utils/brandNormalizer'
import type { ShishaFlavor } from '../types/shisha'

// 本番の公開 URL。NEXT_PUBLIC_SITE_URL は build-time inline されるため、
// 未設定で deploy すると sitemap が dev ホスト指しになる。env が抜けても
// 本番が壊れないよう本番ドメインをフォールバックにしている。
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shisha-lento.com'
).replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/brands`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const brandSlugs = new Set<string>()
  for (const item of shishaData as ShishaFlavor[]) {
    brandSlugs.add(brandSlug(item.manufacturer))
  }
  const brandEntries: MetadataRoute.Sitemap = Array.from(brandSlugs).map(slug => ({
    url: `${SITE_URL}/brands/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const flavorEntries: MetadataRoute.Sitemap = (shishaData as ShishaFlavor[]).map(item => ({
    url: `${SITE_URL}/flavor/${item.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticEntries, ...brandEntries, ...flavorEntries]
}
