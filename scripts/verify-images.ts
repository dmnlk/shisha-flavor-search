#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { shishaData } from '../data/shishaData'
import { googleCSEClient } from './utils/api-clients/google-cse'
import { unsplashClient } from './utils/api-clients/unsplash'
import { createBackup } from './utils/backup'
import { sleep } from './utils/rate-limiter'

interface VerificationResult {
  id: number
  manufacturer: string
  productName: string
  imageUrl: string
  status: 'valid' | 'broken' | 'empty' | 'invalid_format' | 'small_size'
  statusCode?: number
  contentType?: string
  contentLength?: number
  error?: string
}

interface VerificationReport {
  timestamp: string
  totalItems: number
  withImages: number
  withoutImages: number
  validImages: number
  brokenImages: number
  invalidFormat: number
  smallSize: number
  duplicates: Map<string, number[]>
  results: VerificationResult[]
}

const REPORT_FILE = path.join(process.cwd(), 'data/verification-report.json')
const MIN_IMAGE_SIZE = 10 * 1024 // 10KB

/**
 * 画像URLの到達性をチェック
 */
async function checkImageUrl(url: string): Promise<{
  valid: boolean
  statusCode?: number
  contentType?: string
  contentLength?: number
  error?: string
}> {
  if (!url) {
    return { valid: false, error: 'Empty URL' }
  }

  try {
    // HEAD リクエストで軽量チェック
    const response = await axios.head(url, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // 500エラー以外は許可
    })

    const contentType = response.headers['content-type'] || ''
    const contentLength = parseInt(response.headers['content-length'] || '0')

    // Content-Typeが画像かチェック
    const isImage = contentType.startsWith('image/')

    return {
      valid: response.status === 200 && isImage,
      statusCode: response.status,
      contentType,
      contentLength,
      error: response.status !== 200 ? `HTTP ${response.status}` : !isImage ? 'Not an image' : undefined,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        valid: false,
        error: error.code === 'ECONNABORTED' ? 'Timeout' : error.message,
      }
    }
    return {
      valid: false,
      error: 'Unknown error',
    }
  }
}

/**
 * 全アイテムの画像を検証
 */
async function verifyAllImages(showProgress = true): Promise<VerificationResult[]> {
  const results: VerificationResult[] = []
  const total = shishaData.length

  console.log(`🔍 Verifying ${total} items...\n`)

  for (let i = 0; i < total; i++) {
    const item = shishaData[i]

    if (showProgress && (i + 1) % 100 === 0) {
      console.log(`  Progress: ${i + 1}/${total} (${((i + 1) / total * 100).toFixed(1)}%)`)
    }

    if (!item.imageUrl) {
      results.push({
        id: item.id,
        manufacturer: item.manufacturer,
        productName: item.productName,
        imageUrl: '',
        status: 'empty',
      })
      continue
    }

    const check = await checkImageUrl(item.imageUrl)

    let status: VerificationResult['status'] = 'valid'
    if (!check.valid) {
      status = 'broken'
    } else if (check.contentLength && check.contentLength < MIN_IMAGE_SIZE) {
      status = 'small_size'
    }

    results.push({
      id: item.id,
      manufacturer: item.manufacturer,
      productName: item.productName,
      imageUrl: item.imageUrl,
      status,
      statusCode: check.statusCode,
      contentType: check.contentType,
      contentLength: check.contentLength,
      error: check.error,
    })

    // レート制限を避けるため少し待機
    await sleep(100)
  }

  if (showProgress) {
    console.log(`  Progress: ${total}/${total} (100%)\n`)
  }

  return results
}

/**
 * 重複URLを検出
 */
function findDuplicates(results: VerificationResult[]): Map<string, number[]> {
  const urlMap = new Map<string, number[]>()

  results.forEach((result) => {
    if (result.imageUrl) {
      const ids = urlMap.get(result.imageUrl) || []
      ids.push(result.id)
      urlMap.set(result.imageUrl, ids)
    }
  })

  // 重複のみを残す
  const duplicates = new Map<string, number[]>()
  urlMap.forEach((ids, url) => {
    if (ids.length > 1) {
      duplicates.set(url, ids)
    }
  })

  return duplicates
}

/**
 * 検証レポートを生成
 */
function generateReport(results: VerificationResult[]): VerificationReport {
  const withImages = results.filter((r) => r.status !== 'empty').length
  const withoutImages = results.filter((r) => r.status === 'empty').length
  const validImages = results.filter((r) => r.status === 'valid').length
  const brokenImages = results.filter((r) => r.status === 'broken').length
  const invalidFormat = results.filter((r) => r.status === 'invalid_format').length
  const smallSize = results.filter((r) => r.status === 'small_size').length
  const duplicates = findDuplicates(results)

  return {
    timestamp: new Date().toISOString(),
    totalItems: results.length,
    withImages,
    withoutImages,
    validImages,
    brokenImages,
    invalidFormat,
    smallSize,
    duplicates,
    results,
  }
}

/**
 * レポートをコンソールに表示
 */
function displayReport(report: VerificationReport, showDetails = false): void {
  console.log('📊 Verification Report:\n')
  console.log(`  Total items: ${report.totalItems}`)
  console.log(`  With images: ${report.withImages} (${(report.withImages / report.totalItems * 100).toFixed(1)}%)`)
  console.log(`  Without images: ${report.withoutImages} (${(report.withoutImages / report.totalItems * 100).toFixed(1)}%)`)
  console.log(`\n  ✅ Valid images: ${report.validImages}`)
  console.log(`  ❌ Broken images: ${report.brokenImages}`)
  console.log(`  ⚠️  Invalid format: ${report.invalidFormat}`)
  console.log(`  ⚠️  Small size (<10KB): ${report.smallSize}`)
  console.log(`  🔄 Duplicate URLs: ${report.duplicates.size}`)

  const successRate = report.withImages > 0 ? (report.validImages / report.withImages * 100).toFixed(1) : '0.0'
  console.log(`\n  Success rate: ${successRate}%`)

  if (showDetails && report.brokenImages > 0) {
    console.log('\n❌ Broken Images:\n')
    report.results
      .filter((r) => r.status === 'broken')
      .slice(0, 10)
      .forEach((r) => {
        console.log(`  - ID ${r.id}: ${r.manufacturer} - ${r.productName}`)
        console.log(`    URL: ${r.imageUrl}`)
        console.log(`    Error: ${r.error}\n`)
      })

    if (report.brokenImages > 10) {
      console.log(`  ... and ${report.brokenImages - 10} more broken images\n`)
    }
  }

  if (showDetails && report.duplicates.size > 0) {
    console.log('\n🔄 Duplicate URLs (top 5):\n')
    Array.from(report.duplicates.entries())
      .slice(0, 5)
      .forEach(([url, ids]) => {
        console.log(`  - ${url.substring(0, 60)}...`)
        console.log(`    Used by ${ids.length} items: ${ids.join(', ')}\n`)
      })
  }
}

/**
 * レポートをファイルに保存
 */
function saveReport(report: VerificationReport): void {
  // duplicatesをシリアライズ可能な形式に変換
  const serializable = {
    ...report,
    duplicates: Array.from(report.duplicates.entries()).map(([url, ids]) => ({ url, ids })),
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(serializable, null, 2), 'utf-8')
  console.log(`\n✅ Report saved to: ${REPORT_FILE}`)
}

/**
 * 壊れた画像を自動修復
 */
async function fixBrokenImages(brokenResults: VerificationResult[]): Promise<number> {
  console.log(`\n🔧 Attempting to fix ${brokenResults.length} broken images...\n`)

  let fixed = 0

  for (let i = 0; i < brokenResults.length; i++) {
    const result = brokenResults[i]
    const item = shishaData.find((item) => item.id === result.id)

    if (!item) continue

    console.log(`[${i + 1}/${brokenResults.length}] Fixing: ${result.manufacturer} - ${result.productName}`)

    // Google CSEで再検索
    const query = `${result.manufacturer} shisha tobacco logo package`
    let newImageUrl = await googleCSEClient.searchImage(query)

    // Unsplashでフォールバック
    if (!newImageUrl) {
      newImageUrl = await unsplashClient.searchShishaImage(result.manufacturer)
    }

    if (newImageUrl) {
      item.imageUrl = newImageUrl
      fixed++
      console.log(`  ✅ Fixed with new URL`)
    } else {
      console.log(`  ❌ Could not find replacement image`)
    }
  }

  return fixed
}

/**
 * データファイルを更新
 */
function updateShishaDataFile(): void {
  const DATA_FILE = path.join(process.cwd(), 'data/shishaData.js')
  const fileContent = `export const shishaData = \n${JSON.stringify(shishaData, null, 4)}\n`
  fs.writeFileSync(DATA_FILE, fileContent, 'utf-8')
  console.log(`✅ Updated shishaData.js`)
}

/**
 * メイン処理
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('fix', {
      type: 'boolean',
      description: 'Automatically fix broken images by re-collecting',
      default: false,
    })
    .option('report', {
      alias: 'r',
      type: 'boolean',
      description: 'Generate and save detailed report',
      default: false,
    })
    .option('show-details', {
      alias: 'd',
      type: 'boolean',
      description: 'Show detailed error information',
      default: false,
    })
    .help()
    .argv

  console.log('\n🔍 Shisha Image Verification Tool\n')
  console.log('Configuration:')
  console.log(`  Fix broken images: ${argv.fix}`)
  console.log(`  Generate report: ${argv.report}`)
  console.log(`  Show details: ${argv['show-details']}\n`)

  try {
    // 検証実行
    const results = await verifyAllImages()

    // レポート生成
    const report = generateReport(results)

    // レポート表示
    displayReport(report, argv['show-details'])

    // レポート保存
    if (argv.report) {
      saveReport(report)
    }

    // 自動修復
    if (argv.fix && report.brokenImages > 0) {
      const brokenResults = results.filter((r) => r.status === 'broken')

      // バックアップ作成
      console.log('\n💾 Creating backup before fixing...')
      const backupFile = createBackup()
      console.log(`✅ Backup created: ${backupFile}`)

      // 修復実行
      const fixed = await fixBrokenImages(brokenResults)

      if (fixed > 0) {
        updateShishaDataFile()
        console.log(`\n✅ Fixed ${fixed} broken images`)
      } else {
        console.log('\n⚠️  No images were fixed')
      }
    }

    console.log('\n✅ Verification completed!\n')

    if (!argv.fix && report.brokenImages > 0) {
      console.log('💡 Tip: Run with --fix to automatically repair broken images\n')
    }
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

// Run main function
main()
