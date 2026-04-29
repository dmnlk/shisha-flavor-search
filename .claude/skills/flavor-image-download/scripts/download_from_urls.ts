#!/usr/bin/env npx tsx
/**
 * Download flavor images from a JSON file of {id, url, ext?} pairs.
 * No LLM involvement — pure curl in parallel.
 *
 * Usage:
 *   npx tsx .claude/skills/flavor-image-download/scripts/download_from_urls.ts <urls.json>
 *
 * Input JSON format:
 *   [{"id": 421, "url": "https://...", "ext": "jpg"}, ...]
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';

const CONCURRENCY = 8;
const OUTPUT_DIR = 'public/images/flavors';
const UA_PRIMARY = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const UA_FALLBACK = 'Mozilla/5.0 (compatible; shisha-flavor-search-bot/1.0)';

interface UrlEntry {
  id: number;
  url: string;
  ext?: string;
}

function guessExt(url: string, hint?: string): string {
  if (hint && /^(png|jpg|jpeg|webp|avif)$/i.test(hint)) return hint.toLowerCase();
  const clean = url.split('?')[0].split('#')[0];
  const e = extname(clean).replace('.', '').toLowerCase();
  return /^(png|jpg|jpeg|webp|avif)$/.test(e) ? e : 'jpg';
}

function downloadOne(entry: UrlEntry): { ok: boolean; id: number; msg: string } {
  const ext = guessExt(entry.url, entry.ext);
  const dest = `${OUTPUT_DIR}/${entry.id}.${ext}`;

  if (existsSync(dest)) {
    return { ok: true, id: entry.id, msg: `SKIP (already exists): ${entry.id}.${ext}` };
  }

  const curlBase = (ua: string) =>
    `curl -sL --fail --max-time 30 -A "${ua}" -o "${dest}" "${entry.url}"`;

  try {
    execSync(curlBase(UA_PRIMARY), { stdio: 'pipe' });
  } catch {
    try {
      execSync(curlBase(UA_FALLBACK), { stdio: 'pipe' });
    } catch (e2) {
      return { ok: false, id: entry.id, msg: `FAIL: ${entry.id} (${entry.url})` };
    }
  }

  // magic bytes check
  try {
    const mime = execSync(`file --mime-type -b "${dest}"`, { encoding: 'utf8' }).trim();
    const validMimes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
    if (!validMimes.includes(mime)) {
      execSync(`rm -f "${dest}"`);
      return { ok: false, id: entry.id, msg: `FAIL: ${entry.id} (bad mime: ${mime}, removed)` };
    }
    const bytes = parseInt(execSync(`wc -c < "${dest}"`, { encoding: 'utf8' }).trim(), 10);
    if (bytes < 2048) {
      execSync(`rm -f "${dest}"`);
      return { ok: false, id: entry.id, msg: `FAIL: ${entry.id} (too small: ${bytes}B, removed)` };
    }
    return { ok: true, id: entry.id, msg: `OK: ${entry.id}.${ext} (${Math.round(bytes / 1024)}KB)` };
  } catch {
    return { ok: false, id: entry.id, msg: `FAIL: ${entry.id} (verify error)` };
  }
}

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('Usage: download_from_urls.ts <urls.json>');
    process.exit(1);
  }

  const entries: UrlEntry[] = JSON.parse(readFileSync(inputFile, 'utf8'));
  console.log(`Downloading ${entries.length} images with concurrency=${CONCURRENCY}...`);

  let ok = 0;
  let fail = 0;
  let i = 0;

  // Process in batches of CONCURRENCY
  while (i < entries.length) {
    const batch = entries.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(e => Promise.resolve(downloadOne(e))));
    for (const r of results) {
      console.log(r.msg);
      r.ok ? ok++ : fail++;
    }
    i += CONCURRENCY;
  }

  console.log(`\nDone: ${ok} OK, ${fail} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
