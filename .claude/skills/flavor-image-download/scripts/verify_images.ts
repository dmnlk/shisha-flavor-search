/**
 * Walks public/images/flavors/ and verifies every image is a valid
 * PNG/JPEG/WebP/AVIF of reasonable size. Flags candidates for deletion
 * (HTML error pages masquerading as .png, zero-byte files, mime
 * mismatches, SVGs which are rejected for product-shot use).
 *
 * Run from the repo root:
 *   npx tsx .claude/skills/flavor-image-download/scripts/verify_images.ts
 */
import fs from 'node:fs'
import path from 'node:path'

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])
const MIN_BYTES = 2048

type Format = 'png' | 'jpeg' | 'gif' | 'webp' | 'svg' | 'avif' | 'html' | 'unknown'

function sniff(buf: Buffer): Format {
  if (buf.length < 4) return 'unknown'
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png'
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg'
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'gif'
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return 'webp'
  if (
    buf.length >= 12 &&
    buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70 &&
    ((buf[8] === 0x61 && buf[9] === 0x76) || (buf[8] === 0x68 && buf[9] === 0x65))
  ) return 'avif'
  const head = buf.slice(0, Math.min(buf.length, 512)).toString('utf8').trim().toLowerCase()
  if (head.startsWith('<?xml') || head.startsWith('<svg')) return 'svg'
  if (head.startsWith('<!doctype html') || head.startsWith('<html')) return 'html'
  return 'unknown'
}

function extToFormat(ext: string): Format {
  switch (ext) {
    case '.png': return 'png'
    case '.jpg':
    case '.jpeg': return 'jpeg'
    case '.gif': return 'gif'
    case '.webp': return 'webp'
    case '.avif': return 'avif'
    default: return 'unknown'
  }
}

function main() {
  const flavorsDir = path.join(process.cwd(), 'public', 'images', 'flavors')
  const problems: { file: string; reason: string }[] = []
  let ok = 0

  if (!fs.existsSync(flavorsDir)) {
    process.stderr.write(`No flavors directory at ${flavorsDir}\n`)
    process.exit(1)
  }

  for (const file of fs.readdirSync(flavorsDir)) {
    const full = path.join(flavorsDir, file)
    if (!fs.statSync(full).isFile()) continue

    const ext = path.extname(file).toLowerCase()
    if (file.startsWith('.')) continue // skip .gitkeep
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      problems.push({ file, reason: `unsupported extension ${ext} (svg etc. not allowed for product shots)` })
      continue
    }

    const stem = path.basename(file, ext)
    if (!/^\d+$/.test(stem)) {
      problems.push({ file, reason: `filename stem "${stem}" is not a numeric flavor id` })
      continue
    }

    const stats = fs.statSync(full)
    if (stats.size < MIN_BYTES) {
      problems.push({ file, reason: `size ${stats.size} B < ${MIN_BYTES} B (likely placeholder or error page)` })
      continue
    }

    const fh = fs.openSync(full, 'r')
    const buf = Buffer.alloc(Math.min(4096, stats.size))
    fs.readSync(fh, buf, 0, buf.length, 0)
    fs.closeSync(fh)

    const detected = sniff(buf)
    const expected = extToFormat(ext)

    if (detected === 'html') {
      problems.push({ file, reason: 'body is HTML (probably an error page)' })
      continue
    }
    if (detected === 'svg') {
      problems.push({ file, reason: 'SVG is not allowed for product shots' })
      continue
    }
    if (detected === 'unknown') {
      problems.push({ file, reason: 'unrecognized magic bytes' })
      continue
    }
    if (detected !== expected) {
      problems.push({ file, reason: `ext says ${expected} but body is ${detected}` })
      continue
    }

    ok += 1
  }

  const log = (msg: string) => process.stderr.write(msg + '\n')
  log(`Valid:    ${ok}`)
  log(`Suspect:  ${problems.length}`)
  if (problems.length > 0) {
    log('')
    log('Candidates for deletion / re-download:')
    for (const p of problems) log(`  - ${p.file}  (${p.reason})`)
  }

  process.exit(problems.length === 0 ? 0 : 2)
}

main()
