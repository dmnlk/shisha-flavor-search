#!/usr/bin/env node
import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csv-parser'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { shishaData } from '../data/shishaData'
import { createBackup } from './utils/backup'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

interface ImportRecord {
  id: string
  manufacturer: string
  productName: string
  amount: string
  price: string
  imageUrl: string
  source: string
  notes: string
  priority?: string
}

interface ChangeReport {
  itemId: number
  manufacturer: string
  productName: string
  oldImageUrl: string
  newImageUrl: string
  source: string
}

const DATA_FILE = path.join(process.cwd(), 'data/shishaData.js')

/**
 * CSVファイルを読み込む
 */
async function readCSV(filePath: string): Promise<ImportRecord[]> {
  return new Promise((resolve, reject) => {
    const records: ImportRecord[] = []

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // CSV headerのマッピング（大文字小文字を無視）
        const record: ImportRecord = {
          id: data.ID || data.id,
          manufacturer: data.Manufacturer || data.manufacturer,
          productName: data['Product Name'] || data.productName,
          amount: data.Amount || data.amount,
          price: data.Price || data.price,
          imageUrl: data['Image URL'] || data.imageUrl || '',
          source: data.Source || data.source || '',
          notes: data.Notes || data.notes || '',
          priority: data.Priority || data.priority,
        }
        records.push(record)
      })
      .on('end', () => resolve(records))
      .on('error', (error) => reject(error))
  })
}

/**
 * JSONファイルを読み込む
 */
function readJSON(filePath: string): ImportRecord[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * URLが有効な形式かチェック
 */
function isValidUrl(url: string): boolean {
  if (!url) return true // 空のURLは許可（削除の意図）

  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * インポートデータのバリデーション
 */
function validateImportData(records: ImportRecord[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  records.forEach((record, index) => {
    const lineNum = index + 2 // CSVの行番号（ヘッダー分+1）

    // 必須フィールドチェック
    if (!record.id) {
      errors.push(`Line ${lineNum}: Missing ID`)
    }
    if (!record.manufacturer) {
      errors.push(`Line ${lineNum}: Missing manufacturer`)
    }
    if (!record.productName) {
      errors.push(`Line ${lineNum}: Missing product name`)
    }

    // URL形式チェック
    if (record.imageUrl && !isValidUrl(record.imageUrl)) {
      errors.push(`Line ${lineNum}: Invalid URL format: ${record.imageUrl}`)
    }

    // IDが数値かチェック
    if (record.id && isNaN(parseInt(record.id))) {
      errors.push(`Line ${lineNum}: ID must be a number: ${record.id}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 変更内容を分析してレポート生成
 */
function analyzeChanges(records: ImportRecord[]): {
  changes: ChangeReport[]
  stats: {
    totalRecords: number
    withChanges: number
    newImages: number
    updatedImages: number
    removedImages: number
  }
} {
  const changes: ChangeReport[] = []
  let newImages = 0
  let updatedImages = 0
  let removedImages = 0

  records.forEach((record) => {
    const itemId = parseInt(record.id)
    const item = shishaData.find((item) => item.id === itemId)

    if (!item) {
      console.warn(`⚠️  Item not found: ID ${itemId}`)
      return
    }

    const oldUrl = item.imageUrl || ''
    const newUrl = record.imageUrl || ''

    // 変更がある場合のみ記録
    if (oldUrl !== newUrl) {
      changes.push({
        itemId,
        manufacturer: item.manufacturer,
        productName: item.productName,
        oldImageUrl: oldUrl,
        newImageUrl: newUrl,
        source: record.source,
      })

      if (!oldUrl && newUrl) {
        newImages++
      } else if (oldUrl && newUrl) {
        updatedImages++
      } else if (oldUrl && !newUrl) {
        removedImages++
      }
    }
  })

  return {
    changes,
    stats: {
      totalRecords: records.length,
      withChanges: changes.length,
      newImages,
      updatedImages,
      removedImages,
    },
  }
}

/**
 * 変更レポートを表示
 */
function displayChangeReport(
  changes: ChangeReport[],
  stats: {
    totalRecords: number
    withChanges: number
    newImages: number
    updatedImages: number
    removedImages: number
  },
  showAll = false
): void {
  console.log('\n📊 Change Analysis:')
  console.log(`  Total records: ${stats.totalRecords}`)
  console.log(`  Items with changes: ${stats.withChanges}`)
  console.log(`  New images: ${stats.newImages}`)
  console.log(`  Updated images: ${stats.updatedImages}`)
  console.log(`  Removed images: ${stats.removedImages}`)

  if (changes.length === 0) {
    console.log('\n✅ No changes detected.')
    return
  }

  console.log('\n📝 Changes Preview:')

  const displayCount = showAll ? changes.length : Math.min(changes.length, 10)

  changes.slice(0, displayCount).forEach((change, index) => {
    const action = !change.oldImageUrl ? '➕ NEW' : change.newImageUrl ? '🔄 UPDATE' : '❌ REMOVE'
    console.log(`\n  ${index + 1}. ${action} - ID: ${change.itemId}`)
    console.log(`     Product: ${change.manufacturer} - ${change.productName}`)
    if (change.oldImageUrl) {
      console.log(`     Old: ${change.oldImageUrl.substring(0, 60)}...`)
    }
    if (change.newImageUrl) {
      console.log(`     New: ${change.newImageUrl.substring(0, 60)}...`)
    }
    if (change.source) {
      console.log(`     Source: ${change.source}`)
    }
  })

  if (changes.length > displayCount) {
    console.log(`\n  ... and ${changes.length - displayCount} more changes`)
  }
}

/**
 * 変更を適用
 */
function applyChanges(records: ImportRecord[]): number {
  let appliedCount = 0

  records.forEach((record) => {
    const itemId = parseInt(record.id)
    const item = shishaData.find((item) => item.id === itemId)

    if (!item) {
      return
    }

    const newUrl = record.imageUrl || ''
    if (item.imageUrl !== newUrl) {
      item.imageUrl = newUrl
      appliedCount++
    }
  })

  return appliedCount
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
    .option('file', {
      alias: 'f',
      type: 'string',
      description: 'Path to CSV or JSON file to import',
      demandOption: true,
    })
    .option('dry-run', {
      alias: 'd',
      type: 'boolean',
      description: 'Preview changes without writing to file',
      default: false,
    })
    .option('show-all', {
      alias: 'a',
      type: 'boolean',
      description: 'Show all changes in preview (not just first 10)',
      default: false,
    })
    .help()
    .argv

  console.log('\n📥 Shisha Data Import Tool\n')
  console.log('Configuration:')
  console.log(`  Import file: ${argv.file}`)
  console.log(`  Dry run: ${argv['dry-run']}`)
  console.log(`  Show all: ${argv['show-all']}\n`)

  try {
    // ファイル存在チェック
    if (!fs.existsSync(argv.file)) {
      throw new Error(`File not found: ${argv.file}`)
    }

    // ファイル形式を判定
    const ext = path.extname(argv.file).toLowerCase()
    let records: ImportRecord[]

    console.log('📖 Reading import file...')
    if (ext === '.csv') {
      records = await readCSV(argv.file)
    } else if (ext === '.json') {
      records = readJSON(argv.file)
    } else {
      throw new Error('Unsupported file format. Use .csv or .json')
    }

    console.log(`✅ Loaded ${records.length} records\n`)

    // バリデーション
    console.log('🔍 Validating data...')
    const validation = validateImportData(records)

    if (!validation.valid) {
      console.error('\n❌ Validation failed:\n')
      validation.errors.forEach((error) => console.error(`  - ${error}`))
      console.error('\nPlease fix the errors and try again.\n')
      process.exit(1)
    }

    console.log('✅ Validation passed\n')

    // 変更分析
    console.log('🔎 Analyzing changes...')
    const { changes, stats } = analyzeChanges(records)

    // 変更レポート表示
    displayChangeReport(changes, stats, argv['show-all'])

    if (changes.length === 0) {
      console.log('\nNo changes to apply. Exiting.\n')
      return
    }

    // dry-runの場合はここで終了
    if (argv['dry-run']) {
      console.log('\n📝 [DRY RUN] No files were modified')
      console.log('To apply changes, run without --dry-run flag\n')
      return
    }

    // バックアップ作成
    console.log('\n💾 Creating backup...')
    const backupFile = createBackup()
    console.log(`✅ Backup created: ${backupFile}\n`)

    // 変更適用
    console.log('📝 Applying changes...')
    const appliedCount = applyChanges(records)

    // ファイル更新
    updateShishaDataFile()

    console.log(`\n✅ Import completed successfully!`)
    console.log(`   Applied ${appliedCount} changes\n`)

    console.log('Next steps:')
    console.log('  1. Review the changes in shishaData.js')
    console.log('  2. Run verification: pnpm tsx scripts/verify-images.ts')
    console.log('  3. Test the app: pnpm dev\n')
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

// Run main function
main()
