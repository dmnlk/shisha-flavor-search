/**
 * List flavors that have a product image — the candidate pool for the weekly
 * "Editor's Selection" rotation (data/curatedPicks.ts).
 *
 * "Has an image" means EITHER a local product shot exists at
 * public/images/flavors/<id>.<ext> OR the flavor carries a non-empty
 * imageUrl in shishaData. Local shots are preferred for display, so the
 * `local` column lets the curator favour them.
 *
 * This scans the filesystem directly (mirroring
 * scripts/build/generate-flavor-image-map.ts) so it has no dependency on the
 * gitignored generated artifacts — safe to run on a fresh checkout.
 *
 * Usage:
 *   pnpm picks:candidates            # TSV of every image-bearing flavor
 *   pnpm picks:candidates --json     # JSON array instead of TSV
 *   pnpm picks:candidates --local    # only flavors with a LOCAL image file
 *   pnpm picks:candidates --summary  # per-brand counts (for diversity)
 *
 * TSV columns: id <TAB> brand <TAB> productName <TAB> country <TAB> local <TAB> image
 */
import fs from 'node:fs'
import path from 'node:path'
import { shishaData } from '../data/shishaData'
import { normalizeBrandName } from '../lib/utils/brandNormalizer'
import type { ShishaFlavor } from '../types/shisha'

const FLAVOR_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'flavors')
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])

interface Candidate {
  id: number
  brand: string
  productName: string
  country: string
  local: boolean
  image: string
}

function localImageMap(): Map<number, string> {
  const map = new Map<number, string>()
  if (!fs.existsSync(FLAVOR_IMAGES_DIR)) return map
  for (const file of fs.readdirSync(FLAVOR_IMAGES_DIR)) {
    const ext = path.extname(file).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue
    const id = Number(path.basename(file, ext))
    if (!Number.isFinite(id)) continue
    map.set(id, `/images/flavors/${file}`)
  }
  return map
}

function buildCandidates(localOnly: boolean): Candidate[] {
  const local = localImageMap()
  const out: Candidate[] = []
  for (const flavor of shishaData as ShishaFlavor[]) {
    const localUrl = local.get(flavor.id)
    const externalUrl = flavor.imageUrl && flavor.imageUrl.trim() !== '' ? flavor.imageUrl.trim() : ''
    const image = localUrl ?? externalUrl
    if (!image) continue
    if (localOnly && !localUrl) continue
    out.push({
      id: flavor.id,
      brand: normalizeBrandName(flavor.manufacturer),
      productName: flavor.productName,
      country: flavor.country,
      local: Boolean(localUrl),
      image,
    })
  }
  return out
}

function main() {
  // Swallow EPIPE so piping into `head` etc. doesn't throw a stack trace.
  process.stdout.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EPIPE') process.exit(0)
    throw err
  })

  const args = new Set(process.argv.slice(2))
  const candidates = buildCandidates(args.has('--local'))

  if (args.has('--summary')) {
    const counts = new Map<string, number>()
    for (const c of candidates) counts.set(c.brand, (counts.get(c.brand) ?? 0) + 1)
    const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    process.stderr.write(`${candidates.length} image-bearing flavors across ${rows.length} brands\n`)
    for (const [brand, count] of rows) process.stdout.write(`${count}\t${brand}\n`)
    return
  }

  if (args.has('--json')) {
    process.stdout.write(`${JSON.stringify(candidates, null, 2)}\n`)
    return
  }

  process.stderr.write(`${candidates.length} image-bearing flavors\n`)
  for (const c of candidates) {
    process.stdout.write(`${c.id}\t${c.brand}\t${c.productName}\t${c.country}\t${c.local ? 'local' : 'ext'}\t${c.image}\n`)
  }
}

main()
