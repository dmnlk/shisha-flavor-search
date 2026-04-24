/**
 * Lists flavors from data/shishaData.js that don't yet have a local image
 * bundled at public/images/flavors/<id>.<ext>, and writes the result to
 * /tmp/shisha-flavor-images/missing.json.
 *
 * Usage (from repo root):
 *   npx tsx .claude/skills/flavor-image-download/scripts/list_missing_flavors.ts
 *   npx tsx .claude/skills/flavor-image-download/scripts/list_missing_flavors.ts --top 100
 *   npx tsx .claude/skills/flavor-image-download/scripts/list_missing_flavors.ts --brand al-fakher
 *   npx tsx .claude/skills/flavor-image-download/scripts/list_missing_flavors.ts --ids 1,42,7
 */
import fs from 'node:fs'
import path from 'node:path'

import { brandSlug } from '../../../../lib/utils/brandNormalizer'
import { shishaData } from '../../../../data/shishaData'

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])

interface FlavorRow {
  id: number
  productName: string
  manufacturer: string
  brandSlug: string
  country: string
  amount: string
  price: string
  has: boolean
  existingFile?: string
}

interface Args {
  top?: number
  brand?: string
  ids?: number[]
}

function parseArgs(argv: string[]): Args {
  const out: Args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--top') out.top = Number(argv[++i])
    else if (a === '--brand') out.brand = String(argv[++i]).toLowerCase()
    else if (a === '--ids') {
      out.ids = String(argv[++i])
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n))
    }
  }
  return out
}

function scanExisting(dir: string): Map<number, string> {
  const found = new Map<number, string>()
  if (!fs.existsSync(dir)) return found
  for (const file of fs.readdirSync(dir)) {
    const ext = path.extname(file).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue
    const stem = path.basename(file, ext)
    const id = Number(stem)
    if (!Number.isFinite(id)) continue
    found.set(id, file)
  }
  return found
}

function main() {
  const repoRoot = process.cwd()
  const flavorsDir = path.join(repoRoot, 'public', 'images', 'flavors')
  const outDir = '/tmp/shisha-flavor-images'
  const outPath = path.join(outDir, 'missing.json')

  const args = parseArgs(process.argv.slice(2))
  const existing = scanExisting(flavorsDir)

  // Popularity per brand: number of flavors that share the manufacturer slug.
  const brandPopularity = new Map<string, number>()
  for (const item of shishaData) {
    const s = brandSlug(item.manufacturer)
    brandPopularity.set(s, (brandPopularity.get(s) ?? 0) + 1)
  }

  const all: FlavorRow[] = (shishaData as Array<{
    id: number
    productName: string
    manufacturer: string
    country: string
    amount: string
    price: string
    imageUrl: string
  }>).map((f) => {
    const slug = brandSlug(f.manufacturer)
    const hit = existing.get(f.id)
    return {
      id: f.id,
      productName: f.productName,
      manufacturer: f.manufacturer,
      brandSlug: slug,
      country: f.country,
      amount: f.amount,
      price: f.price,
      has: Boolean(hit),
      ...(hit ? { existingFile: hit } : {}),
    }
  })

  // Sort: by brand popularity desc, then product name asc.
  all.sort((a, b) => {
    const pa = brandPopularity.get(a.brandSlug) ?? 0
    const pb = brandPopularity.get(b.brandSlug) ?? 0
    if (pb !== pa) return pb - pa
    if (a.manufacturer !== b.manufacturer) return a.manufacturer.localeCompare(b.manufacturer)
    return a.productName.localeCompare(b.productName)
  })

  let missing = all.filter((f) => !f.has)

  if (args.brand) {
    const wanted = args.brand
    missing = missing.filter((f) => f.brandSlug === wanted)
  }
  if (args.ids && args.ids.length > 0) {
    const set = new Set(args.ids)
    missing = missing.filter((f) => set.has(f.id))
  }
  if (typeof args.top === 'number' && args.top > 0) {
    missing = missing.slice(0, args.top)
  }

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify({ all, missing }, null, 2))

  const log = (msg: string) => process.stderr.write(msg + '\n')
  log(`Total flavors: ${all.length}`)
  log(`With image:    ${all.length - all.filter((f) => !f.has).length}`)
  log(`Missing:       ${missing.length}${args.brand ? ` (brand=${args.brand})` : ''}${args.top ? ` (top=${args.top})` : ''}`)
  log(`Output:        ${outPath}`)
  log('')
  log('Top missing (by brand popularity, then product name):')
  for (const f of missing.slice(0, 20)) {
    log(`  [id ${String(f.id).padStart(5)}] ${f.manufacturer.padEnd(24)} — ${f.productName}`)
  }
  if (missing.length > 20) log(`  ... and ${missing.length - 20} more`)

  process.stdout.write(outPath + '\n')
}

main()
