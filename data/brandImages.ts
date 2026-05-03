import { brandSlug } from '../lib/utils/brandNormalizer'
import brandImageMap from './generated/brandImageMap.json'

export { brandSlug }

/**
 * Server-only module backed by a build-time JSON map produced by
 * scripts/build-data.ts (which scans `public/images/brands/`). Avoiding
 * runtime `node:fs` keeps this importable from any server context,
 * including the Cloudflare Workers runtime.
 */

const BRAND_IMAGE_MAP: Record<string, string> = brandImageMap

export function getBrandImageUrl(brand: string): string | undefined {
  return BRAND_IMAGE_MAP[brandSlug(brand)]
}

export const REGISTERED_BRAND_IMAGE_COUNT = Object.keys(BRAND_IMAGE_MAP).length
