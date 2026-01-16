#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { shishaData } from '../data/shishaData'
import { getUniqueBrands } from '../lib/utils/brandNormalizer'
import { googleCSEClient } from './utils/api-clients/google-cse'
import { unsplashClient } from './utils/api-clients/unsplash'
import { createBackup } from './utils/backup'

interface BrandImageMap {
  [brand: string]: {
    imageUrl: string
    source: 'google' | 'unsplash' | 'none'
    collectedAt: string
  }
}

interface CollectionStats {
  totalBrands: number
  googleSuccess: number
  unsplashSuccess: number
  failed: number
  skipped: number
}

const DATA_FILE = path.join(process.cwd(), 'data/shishaData.js')
const BRAND_MAP_FILE = path.join(process.cwd(), 'data/brand-image-map.json')

/**
 * ユニークなブランドを抽出
 */
function extractUniqueBrands(): string[] {
  const manufacturers = shishaData.map((item) => item.manufacturer)
  const uniqueBrands = getUniqueBrands(manufacturers)
  console.log(`\n📋 Found ${uniqueBrands.length} unique brands\n`)
  return uniqueBrands
}

/**
 * ブランドごとに画像を収集
 */
async function collectBrandImages(
  brands: string[],
  source: 'google' | 'unsplash' | 'both' = 'both'
): Promise<BrandImageMap> {
  const brandImageMap: BrandImageMap = {}
  const stats: CollectionStats = {
    totalBrands: brands.length,
    googleSuccess: 0,
    unsplashSuccess: 0,
    failed: 0,
    skipped: 0,
  }

  console.log(`🔍 Collecting images for ${brands.length} brands...\n`)

  for (let i = 0; i < brands.length; i++) {
    const brand = brands[i]
    const progress = `[${i + 1}/${brands.length}]`

    console.log(`${progress} Processing: ${brand}`)

    let imageUrl: string | null = null
    let imageSource: 'google' | 'unsplash' | 'none' = 'none'

    // Google CSEで検索
    if (source === 'google' || source === 'both') {
      const query = `${brand} shisha tobacco logo package`
      imageUrl = await googleCSEClient.searchImage(query)

      if (imageUrl) {
        imageSource = 'google'
        stats.googleSuccess++
        console.log(`  ✅ Found via Google CSE`)
      }
    }

    // Unsplashで検索（Googleで見つからなかった場合、またはunsplash専用モード）
    if (!imageUrl && (source === 'unsplash' || source === 'both')) {
      imageUrl = await unsplashClient.searchShishaImage(brand)

      if (imageUrl) {
        imageSource = 'unsplash'
        stats.unsplashSuccess++
        console.log(`  ✅ Found via Unsplash`)
      }
    }

    if (imageUrl) {
      brandImageMap[brand] = {
        imageUrl,
        source: imageSource,
        collectedAt: new Date().toISOString(),
      }
    } else {
      stats.failed++
      console.log(`  ⚠️  No image found`)
      brandImageMap[brand] = {
        imageUrl: '',
        source: 'none',
        collectedAt: new Date().toISOString(),
      }
    }

    // APIの残りクォータを表示
    if (source === 'google' || source === 'both') {
      const remaining = googleCSEClient.getRemainingRequests()
      if (remaining <= 10) {
        console.log(`  ⚠️  Google CSE quota: ${remaining} requests remaining`)
      }
    }
  }

  // 統計を表示
  console.log('\n📊 Collection Statistics:')
  console.log(`  Total brands: ${stats.totalBrands}`)
  console.log(`  ✅ Google CSE: ${stats.googleSuccess}`)
  console.log(`  ✅ Unsplash: ${stats.unsplashSuccess}`)
  console.log(`  ⚠️  Failed: ${stats.failed}`)
  console.log(`  Success rate: ${(((stats.googleSuccess + stats.unsplashSuccess) / stats.totalBrands) * 100).toFixed(1)}%\n`)

  return brandImageMap
}

/**
 * ブランド画像マップを保存
 */
function saveBrandImageMap(brandImageMap: BrandImageMap): void {
  const dir = path.dirname(BRAND_MAP_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(BRAND_MAP_FILE, JSON.stringify(brandImageMap, null, 2), 'utf-8')
  console.log(`✅ Brand image map saved to: ${BRAND_MAP_FILE}`)
}

/**
 * 全アイテムにブランド画像を適用
 */
function applyBrandImagesToData(brandImageMap: BrandImageMap): void {
  let applied = 0
  let skipped = 0

  for (const item of shishaData) {
    const brandInfo = brandImageMap[item.manufacturer]

    if (brandInfo && brandInfo.imageUrl) {
      item.imageUrl = brandInfo.imageUrl
      applied++
    } else {
      skipped++
    }
  }

  console.log(`\n📝 Applied images to data:`)
  console.log(`  ✅ Applied: ${applied} items`)
  console.log(`  ⚠️  Skipped: ${skipped} items\n`)
}

/**
 * 更新されたデータをファイルに書き込む
 */
function updateShishaDataFile(): void {
  const fileContent = `export const shishaData = \n${JSON.stringify(shishaData, null, 4)}\n`
  fs.writeFileSync(DATA_FILE, fileContent, 'utf-8')
  console.log(`✅ Updated ${DATA_FILE}`)
}

/**
 * メイン処理
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('dry-run', {
      alias: 'd',
      type: 'boolean',
      description: 'Preview changes without writing to files',
      default: false,
    })
    .option('source', {
      alias: 's',
      type: 'string',
      choices: ['google', 'unsplash', 'both'],
      description: 'Image source to use',
      default: 'both',
    })
    .option('force', {
      alias: 'f',
      type: 'boolean',
      description: 'Force overwrite existing images',
      default: false,
    })
    .help()
    .argv

  console.log('\n🚀 Shisha Brand Image Collection Tool\n')
  console.log('Configuration:')
  console.log(`  Dry run: ${argv['dry-run']}`)
  console.log(`  Source: ${argv.source}`)
  console.log(`  Force: ${argv.force}\n`)

  try {
    // Step 1: Extract unique brands
    const brands = extractUniqueBrands()

    // Step 2: Collect images
    const brandImageMap = await collectBrandImages(brands, argv.source as 'google' | 'unsplash' | 'both')

    // Step 3: Save brand image map
    if (!argv['dry-run']) {
      saveBrandImageMap(brandImageMap)
    } else {
      console.log('📝 [DRY RUN] Would save brand image map')
    }

    // Step 4: Apply images to all items
    applyBrandImagesToData(brandImageMap)

    // Step 5: Backup and update data file
    if (!argv['dry-run']) {
      console.log('💾 Creating backup...')
      const backupFile = createBackup()
      console.log(`✅ Backup created: ${backupFile}\n`)

      console.log('📝 Updating shishaData.js...')
      updateShishaDataFile()

      console.log('\n✅ Image collection completed successfully!\n')
      console.log('Next steps:')
      console.log('  1. Review the changes in shishaData.js')
      console.log('  2. Run verification: pnpm tsx scripts/verify-images.ts')
      console.log('  3. Test the app: pnpm dev\n')
    } else {
      console.log('\n📝 [DRY RUN] No files were modified')
      console.log('To apply changes, run without --dry-run flag\n')
    }
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

// Run main function
main()
