import fs from 'node:fs'
import path from 'node:path'

import { brandSlug } from '../lib/utils/brandNormalizer'

export { brandSlug }

/**
 * Server-only module. Uses `node:fs` to enumerate locally bundled brand
 * logo files at module init, so it must not be imported from client
 * components ('use client'). Consume it from server components / API
 * routes only, then pass resolved URLs down as props.
 */

const BRAND_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'brands')
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.avif'])

function loadBrandImageMap(): Record<string, string> {
  if (!fs.existsSync(BRAND_IMAGES_DIR)) return {}
  const entries: Record<string, string> = {}
  for (const file of fs.readdirSync(BRAND_IMAGES_DIR)) {
    const ext = path.extname(file).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue
    const slug = path.basename(file, ext).toLowerCase()
    entries[slug] = `/images/brands/${file}`
  }
  return entries
}

const BRAND_IMAGE_MAP: Record<string, string> = loadBrandImageMap()

export function getBrandImageUrl(brand: string): string | undefined {
  return BRAND_IMAGE_MAP[brandSlug(brand)]
}

export const REGISTERED_BRAND_IMAGE_COUNT = Object.keys(BRAND_IMAGE_MAP).length
