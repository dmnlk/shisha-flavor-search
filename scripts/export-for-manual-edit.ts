#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import { createObjectCsvWriter } from 'csv-writer'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { shishaData } from '../data/shishaData'
import { getUniqueBrands } from '../lib/utils/brandNormalizer'

interface ExportRecord {
  id: string
  manufacturer: string
  productName: string
  amount: string
  price: string
  imageUrl: string
  source: string
  notes: string
  priority: number
}

const EXPORT_DIR = path.join(process.cwd(), 'data/exports')
const FULL_CSV = path.join(EXPORT_DIR, 'manual-edit.csv')
const FULL_JSON = path.join(EXPORT_DIR, 'manual-edit.json')
const PRIORITY_CSV = path.join(EXPORT_DIR, 'high-priority.csv')

/**
 * 優先度の高いブランドリスト（人気・メジャーブランド）
 */
const HIGH_PRIORITY_BRANDS = [
  'Doobacco',
  'Al Waha',
  'Starbuzz',
  'Fumari',
  'Social Smoke',
  'Tangiers',
  'Trifecta',
  'Haze',
  'Azure',
  'Ugly',
  'Element',
  'Adalya',
  'Afzal',
  'Al Fakher',
  'Nakhla',
]

/**
 * エクスポートディレクトリを作成
 */
function ensureExportDirectory(): void {
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true })
    console.log(`✅ Created export directory: ${EXPORT_DIR}`)
  }
}

/**
 * ブランドの優先度を計算（人気ブランドほど高い）
 */
function calculatePriority(manufacturer: string): number {
  const index = HIGH_PRIORITY_BRANDS.indexOf(manufacturer)
  if (index !== -1) {
    return HIGH_PRIORITY_BRANDS.length - index // 高い方が優先
  }
  return 0 // 低優先度
}

/**
 * shishaDataをエクスポート用レコードに変換
 */
function prepareExportData(): ExportRecord[] {
  return shishaData.map((item) => ({
    id: item.id.toString(),
    manufacturer: item.manufacturer,
    productName: item.productName,
    amount: item.amount,
    price: item.price,
    imageUrl: item.imageUrl || '',
    source: item.imageUrl ? 'auto' : '', // 既存の画像があれば'auto'
    notes: '',
    priority: calculatePriority(item.manufacturer),
  }))
}

/**
 * CSVファイルにエクスポート
 */
async function exportToCSV(records: ExportRecord[], filePath: string): Promise<void> {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'manufacturer', title: 'Manufacturer' },
      { id: 'productName', title: 'Product Name' },
      { id: 'amount', title: 'Amount' },
      { id: 'price', title: 'Price' },
      { id: 'imageUrl', title: 'Image URL' },
      { id: 'source', title: 'Source' },
      { id: 'notes', title: 'Notes' },
      { id: 'priority', title: 'Priority' },
    ],
  })

  await csvWriter.writeRecords(records)
  console.log(`✅ Exported ${records.length} records to: ${filePath}`)
}

/**
 * JSONファイルにエクスポート
 */
function exportToJSON(records: ExportRecord[], filePath: string): void {
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf-8')
  console.log(`✅ Exported ${records.length} records to: ${filePath}`)
}

/**
 * 優先度の高いブランドのみをフィルタリング
 */
function filterHighPriority(records: ExportRecord[]): ExportRecord[] {
  return records.filter((record) => record.priority > 0).sort((a, b) => b.priority - a.priority)
}

/**
 * エクスポート統計を表示
 */
function displayStats(allRecords: ExportRecord[], priorityRecords: ExportRecord[]): void {
  const withImages = allRecords.filter((r) => r.imageUrl).length
  const withoutImages = allRecords.length - withImages

  console.log('\n📊 Export Statistics:')
  console.log(`  Total items: ${allRecords.length}`)
  console.log(`  With images: ${withImages}`)
  console.log(`  Without images: ${withoutImages}`)
  console.log(`  High priority items: ${priorityRecords.length}`)
  console.log(`  High priority brands: ${HIGH_PRIORITY_BRANDS.length}`)

  // ブランド別統計
  const brandCounts = new Map<string, number>()
  allRecords.forEach((record) => {
    brandCounts.set(record.manufacturer, (brandCounts.get(record.manufacturer) || 0) + 1)
  })

  console.log(`\n📋 Top 10 Brands by Item Count:`)
  Array.from(brandCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([brand, count], index) => {
      const isPriority = HIGH_PRIORITY_BRANDS.includes(brand) ? '⭐' : '  '
      console.log(`  ${isPriority} ${index + 1}. ${brand}: ${count} items`)
    })
}

/**
 * 手動編集のガイドを表示
 */
function displayEditingGuide(): void {
  console.log('\n📝 Manual Editing Guide:\n')
  console.log('1. Open the CSV file in Excel or Google Sheets')
  console.log('2. Find products without images (empty "Image URL" column)')
  console.log('3. Search for product images using Google/manufacturer websites')
  console.log('4. Paste the image URL into the "Image URL" column')
  console.log('5. Change "Source" to "manual" for manually added images')
  console.log('6. Add notes if needed (e.g., "Official site", "High quality")')
  console.log('7. Save the file with the same name')
  console.log('8. Import using: pnpm tsx scripts/import-manual-edits.ts --file <path>\n')

  console.log('💡 Tips:')
  console.log('  - Start with high-priority.csv for popular brands')
  console.log('  - Use official manufacturer websites when possible')
  console.log('  - Prefer product package images over generic images')
  console.log('  - Ensure URLs are publicly accessible (not private/temporary links)')
  console.log('  - Check image quality before adding (avoid low-resolution images)\n')
}

/**
 * メイン処理
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('priority', {
      alias: 'p',
      type: 'boolean',
      description: 'Export only high-priority brands',
      default: false,
    })
    .option('format', {
      alias: 'f',
      type: 'string',
      choices: ['csv', 'json', 'both'],
      description: 'Export format',
      default: 'both',
    })
    .help()
    .argv

  console.log('\n📤 Shisha Data Export Tool\n')
  console.log('Configuration:')
  console.log(`  Priority only: ${argv.priority}`)
  console.log(`  Format: ${argv.format}\n`)

  try {
    // エクスポートディレクトリ作成
    ensureExportDirectory()

    // データ準備
    console.log('📋 Preparing export data...')
    const allRecords = prepareExportData()
    const priorityRecords = filterHighPriority(allRecords)

    // 統計表示
    displayStats(allRecords, priorityRecords)

    // エクスポート実行
    console.log('\n📝 Exporting files...\n')

    if (argv.priority) {
      // 優先度の高いブランドのみエクスポート
      if (argv.format === 'csv' || argv.format === 'both') {
        await exportToCSV(priorityRecords, PRIORITY_CSV)
      }
      if (argv.format === 'json' || argv.format === 'both') {
        const jsonPath = PRIORITY_CSV.replace('.csv', '.json')
        exportToJSON(priorityRecords, jsonPath)
      }
    } else {
      // 全データをエクスポート
      if (argv.format === 'csv' || argv.format === 'both') {
        await exportToCSV(allRecords, FULL_CSV)
      }
      if (argv.format === 'json' || argv.format === 'both') {
        exportToJSON(allRecords, FULL_JSON)
      }

      // 優先度の高いブランドも別ファイルでエクスポート
      if (argv.format === 'csv' || argv.format === 'both') {
        await exportToCSV(priorityRecords, PRIORITY_CSV)
      }
    }

    // 編集ガイド表示
    displayEditingGuide()

    console.log('✅ Export completed successfully!\n')
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

// Run main function
main()
