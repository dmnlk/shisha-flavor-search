import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

const DATA_FILE = path.join(process.cwd(), 'data/shishaData.js')
const BACKUP_DIR = path.join(process.cwd(), 'data/backups')

/**
 * バックアップディレクトリが存在しない場合は作成
 */
function ensureBackupDirectory(): void {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
    console.log(`✅ Created backup directory: ${BACKUP_DIR}`)
  }
}

/**
 * shishaData.jsのバックアップを作成
 * @returns バックアップファイル名
 */
export function createBackup(): string {
  ensureBackupDirectory()

  // タイムスタンプを生成 (ISO 8601形式からファイル名用に変換)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const backupFileName = `shishaData.backup.${timestamp}.js`
  const backupFilePath = path.join(BACKUP_DIR, backupFileName)

  try {
    // ファイルをコピー
    fs.copyFileSync(DATA_FILE, backupFilePath)
    console.log(`✅ Backup created: ${backupFileName}`)
    return backupFileName
  } catch (error) {
    console.error('❌ Failed to create backup:', error)
    throw error
  }
}

/**
 * 利用可能なバックアップのリストを取得
 * @returns バックアップファイル名の配列（新しい順）
 */
export function listBackups(): string[] {
  ensureBackupDirectory()

  try {
    const files = fs.readdirSync(BACKUP_DIR)
    const backupFiles = files
      .filter((file) => file.startsWith('shishaData.backup.') && file.endsWith('.js'))
      .sort()
      .reverse() // 新しい順

    return backupFiles
  } catch (error) {
    console.error('❌ Failed to list backups:', error)
    return []
  }
}

/**
 * バックアップから復元
 * @param timestamp タイムスタンプ (例: "2026-01-16T12-30-00")
 */
export function restoreBackup(timestamp: string): void {
  const backupFileName = `shishaData.backup.${timestamp}.js`
  const backupFilePath = path.join(BACKUP_DIR, backupFileName)

  if (!fs.existsSync(backupFilePath)) {
    throw new Error(`Backup file not found: ${backupFileName}`)
  }

  try {
    // 現在のファイルをバックアップしてから復元
    console.log('Creating safety backup before restore...')
    createBackup()

    // 復元
    fs.copyFileSync(backupFilePath, DATA_FILE)
    console.log(`✅ Restored from backup: ${backupFileName}`)
  } catch (error) {
    console.error('❌ Failed to restore backup:', error)
    throw error
  }
}

/**
 * バックアップの詳細情報を表示
 */
export function printBackupInfo(): void {
  const backups = listBackups()

  if (backups.length === 0) {
    console.log('No backups found.')
    return
  }

  console.log(`\n📦 Available backups (${backups.length}):\n`)
  backups.forEach((backup, index) => {
    const filePath = path.join(BACKUP_DIR, backup)
    const stats = fs.statSync(filePath)
    const size = (stats.size / 1024).toFixed(2) + ' KB'
    const timestamp = backup.replace('shishaData.backup.', '').replace('.js', '')

    console.log(`${index + 1}. ${timestamp}`)
    console.log(`   File: ${backup}`)
    console.log(`   Size: ${size}`)
    console.log(`   Date: ${stats.mtime.toLocaleString('ja-JP')}`)
    console.log()
  })
}

// CLIとして実行された場合
if (require.main === module) {
  const args = process.argv.slice(2)
  const command = args[0]

  try {
    switch (command) {
      case '--list':
      case '-l':
        printBackupInfo()
        break

      case '--restore':
      case '-r':
        if (!args[1]) {
          console.error('❌ Error: Please specify a timestamp to restore')
          console.log('Usage: pnpm tsx scripts/utils/backup.ts --restore 2026-01-16T12-30-00')
          process.exit(1)
        }
        restoreBackup(args[1])
        break

      case '--create':
      case '-c':
        createBackup()
        break

      case '--help':
      case '-h':
      default:
        console.log('Usage:')
        console.log('  pnpm tsx scripts/utils/backup.ts --list          # List all backups')
        console.log('  pnpm tsx scripts/utils/backup.ts --create        # Create a backup')
        console.log('  pnpm tsx scripts/utils/backup.ts --restore <timestamp>')
        console.log('  pnpm tsx scripts/utils/backup.ts --help          # Show this help')
        break
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}
