import { FLAVOR_IMAGE_MAP } from './flavorImagesGenerated'

/**
 * Per-flavor product image URLs. Backed by `flavorImagesGenerated.ts`,
 * which is built from `public/images/flavors/<id>.<ext>` at build time
 * (via `scripts/build/generate-flavor-image-map.ts`).
 *
 * Doing the directory scan at build time instead of runtime keeps Next.js'
 * file tracer from bundling the whole flavor image directory into the
 * serverless function output — Vercel's 250MB unzipped function limit
 * was being blown past once we accumulated ~1.6k product shots.
 */

export function getFlavorImageUrl(id: number): string | undefined {
  return FLAVOR_IMAGE_MAP[id]
}

/**
 * Returns a flavor with its `imageUrl` filled from the local bundle when
 * the original value is empty. Preserves the original URL when present so
 * intentional external CDN links (e.g. shisha-mart) still win.
 */
export function resolveFlavorImage<T extends { id: number; imageUrl: string }>(flavor: T): T {
  if (flavor.imageUrl && flavor.imageUrl.trim() !== '') return flavor
  const local = FLAVOR_IMAGE_MAP[flavor.id]
  if (!local) return flavor
  return { ...flavor, imageUrl: local }
}

export const REGISTERED_FLAVOR_IMAGE_COUNT = Object.keys(FLAVOR_IMAGE_MAP).length
