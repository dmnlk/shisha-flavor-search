/**
 * Lists every brand found in data/shishaData.js along with its expected
 * public/images/brands/<slug>.<ext> filename. Writes the result (and a
 * "missing" subset sorted by flavor count desc) to
 * /tmp/shisha-brand-logos/missing.json.
 *
 * Run from the repo root:
 *   npx tsx .claude/skills/brand-logo-download/scripts/list_missing_brands.ts
 */
import fs from 'node:fs'
import path from 'node:path'

import { brandSlug } from '../../../../data/brandImages'
import { shishaData } from '../../../../data/shishaData'
import { getUniqueBrands, normalizeBrandForSearch } from '../../../../lib/utils/brandNormalizer'

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.avif'])

interface BrandRow {
  name: string
  slug: string
  count: number
  has: boolean
  existingFile?: string
}

function scanExisting(dir: string): Map<string, string> {
  const found = new Map<string, string>()
  if (!fs.existsSync(dir)) return found
  for (const file of fs.readdirSync(dir)) {
    const ext = path.extname(file).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.has(ext)) continue
    const slug = path.basename(file, ext).toLowerCase()
    found.set(slug, file)
  }
  return found
}

function main() {
  const repoRoot = process.cwd()
  const brandsDir = path.join(repoRoot, 'public', 'images', 'brands')
  const outDir = '/tmp/shisha-brand-logos'
  const outPath = path.join(outDir, 'missing.json')

  const existing = scanExisting(brandsDir)

  const counts = new Map<string, number>()
  for (const item of shishaData) {
    const key = normalizeBrandForSearch(item.manufacturer)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const brands: BrandRow[] = getUniqueBrands(shishaData.map(i => i.manufacturer)).map(name => {
    const slug = brandSlug(name)
    const hit = existing.get(slug)
    return {
      name,
      slug,
      count: counts.get(normalizeBrandForSearch(name)) ?? 0,
      has: Boolean(hit),
      ...(hit ? { existingFile: hit } : {}),
    }
  })

  brands.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  const missing = brands.filter(b => !b.has)

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify({ all: brands, missing }, null, 2))

  const log = (msg: string) => process.stderr.write(msg + '\n')
  log(`Total brands: ${brands.length}`)
  log(`With logo:    ${brands.length - missing.length}`)
  log(`Missing:      ${missing.length}`)
  log(`Output:       ${outPath}`)
  log('')
  log('Top missing (by flavor count):')
  for (const b of missing.slice(0, 20)) {
    log(`  [${String(b.count).padStart(4)}] ${b.name.padEnd(28)} →  ${b.slug}`)
  }
  if (missing.length > 20) log(`  ... and ${missing.length - 20} more`)

  process.stdout.write(outPath + '\n')
}

main()
