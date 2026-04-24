import fs from 'node:fs'
import path from 'node:path'

/**
 * Server-only module. Enumerates locally bundled flavor product images at
 * module init (named `<flavor-id>.<ext>` under public/images/flavors/).
 * Must not be imported from client components ('use client'); consume it
 * from server components / API routes, then pass resolved URLs down as
 * plain strings.
 */

const FLAVOR_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'flavors')
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])

function loadFlavorImageMap(): Record<number, string> {
  if (!fs.existsSync(FLAVOR_IMAGES_DIR)) return {}
  const entries: Record<number, string> = {}
  for (const file of fs.readdirSync(FLAVOR_IMAGES_DIR)) {
    const ext = path.extname(file).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue
    const stem = path.basename(file, ext)
    const id = Number(stem)
    if (!Number.isFinite(id)) continue
    entries[id] = `/images/flavors/${file}`
  }
  return entries
}

const FLAVOR_IMAGE_MAP: Record<number, string> = loadFlavorImageMap()

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
