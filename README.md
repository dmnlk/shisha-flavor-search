# シーシャ検索アプリ

シーシャ（水タバコ）のフレーバーを検索・閲覧できるWebアプリケーションです。豊富なフレーバーデータベースから、お気に入りのフレーバーを簡単に見つけることができます。

## 🌟 機能

- **高速検索**: キーワードでフレーバーを即座に検索
- **メーカー別フィルタリング**: お気に入りのメーカーで絞り込み
- **詳細情報表示**: 各フレーバーの詳細な説明とイメージ
- **ページネーション**: 大量のデータを見やすく表示
- **レスポンシブデザイン**: スマートフォンからデスクトップまで対応
- **ダークモード対応**: 目に優しい暗いテーマ
- **アニメーション**: Framer Motionによる滑らかな画面遷移

## 🛠 技術スタック

### フロントエンド
- **Next.js 15.3.3**: React フレームワーク（App Router使用）
- **React 19.1.0**: UIライブラリ
- **TypeScript 5.8.3**: 型安全性とコード品質の向上
- **Tailwind CSS 4.1.10**: 最新のユーティリティファーストCSS
- **Framer Motion 12.16**: アニメーションライブラリ
- **Heroicons 2.2**: アイコンライブラリ

### 開発ツール
- **Node.js 22.12.0 LTS**: 最新のLTSランタイム
- **pnpm 10.x**: 高速で効率的なパッケージマネージャー
- **ESLint 9.29**: 最新のコード品質管理
- **Jest 29**: TypeScript対応テストフレームワーク
- **React Testing Library**: コンポーネントテスト

## 📦 インストールと起動

### 必要な環境
- Node.js 22.12.0 LTS（.node-versionで指定）
- pnpm 10.x 以上
- TypeScript 5.8.3（自動インストール）

### セットアップ手順

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/shisha-search.git
cd shisha-search
```

2. 依存関係をインストール
```bash
pnpm install
```

3. 開発サーバーを起動
```bash
pnpm dev
```

4. ブラウザで http://localhost:3000 を開く

### その他のコマンド

```bash
# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start

# テスト実行
pnpm test

# テスト（ウォッチモード）
pnpm test:watch

# TypeScript型チェック
npx tsc --noEmit

# コード品質チェック
pnpm lint
```

## 🏗 プロジェクト構成

```
shisha-search/
├── app/                      # Next.js App Router
│   ├── api/                  # APIルート（TypeScript）
│   │   ├── search/          # 検索API (route.ts)
│   │   ├── manufacturers/   # メーカー一覧API (route.ts)
│   │   └── flavor/[id]/     # フレーバー詳細API (route.ts)
│   ├── flavor/[id]/         # フレーバー詳細ページ (page.tsx)
│   ├── ClientHome.tsx       # クライアントサイドホームコンポーネント
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   └── globals.css          # グローバルスタイル（Tailwind v4対応）
├── components/              # 再利用可能なコンポーネント（TypeScript）
│   ├── SearchBar.tsx        # 検索バー
│   ├── BrandList.tsx        # メーカーフィルター
│   └── ShishaCard.tsx       # フレーバーカード
├── types/                   # TypeScript型定義
│   └── shisha.ts            # データ型インターフェース
├── data/                    # データ層
│   ├── shishaData.js        # フレーバーデータベース
│   └── shishaMethods.ts     # データ操作ユーティリティ（TypeScript）
├── lib/                     # ライブラリとサービス
│   ├── services/            # サービス層（TypeScript）
│   └── utils/               # ユーティリティ関数
├── .node-version            # Node.js バージョン指定
├── postcss.config.js        # PostCSS設定（Tailwind v4対応）
├── tailwind.config.ts       # Tailwind CSS設定
├── tsconfig.json            # TypeScript設定
└── public/                  # 静的ファイル
    └── images/              # 画像アセット
```

## 🔍 主要機能の詳細

### 検索機能
- 複数キーワードでのAND検索対応
- メーカー名、商品名、説明文から検索
- リアルタイムフィルタリング

### ページネーション
- 1ページあたり12件表示
- サーバーサイドページネーション
- URLパラメータによる状態管理

### メーカーフィルター
- 全メーカーの動的取得
- ワンクリックでフィルタリング
- 「すべてのブランド」オプション

## 🖼 画像収集システム

5,000以上のフレーバーアイテムに画像を収集・管理するための包括的なツールセットです。

### 特徴
- **3段階ハイブリッドアプローチ**: 自動収集 + 手動編集 + 品質管理
- **無料APIのみ使用**: Google Custom Search + Unsplash
- **完全なバックアップシステム**: すべての変更前に自動バックアップ
- **品質重視**: 実際の商品パッケージ画像を優先

### セットアップ

#### 1. API キーの取得

**.env.localファイルを作成**
```bash
cp .env.local.example .env.local
```

**Google Custom Search API**
1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクト作成
2. Custom Search API を有効化
3. API キーを作成
4. [Programmable Search Engine](https://programmablesearchengine.google.com/) で検索エンジン作成
5. Search Engine ID を取得

**Unsplash API**
1. [Unsplash Developers](https://unsplash.com/developers) でアカウント作成
2. 新規アプリケーション作成
3. Access Key を取得

**.env.localに設定**
```bash
GOOGLE_CSE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_search_engine_id
UNSPLASH_ACCESS_KEY=your_unsplash_key
```

### 使い方

#### Phase 1: 自動ブランド画像収集

全5,138アイテムにブランドレベルの画像を適用（100%カバレッジ）

```bash
# プレビューモード（変更なし）
pnpm tsx scripts/collect-brand-images.ts --dry-run

# 本番実行（自動バックアップ作成）
pnpm tsx scripts/collect-brand-images.ts

# Unsplashのみ使用
pnpm tsx scripts/collect-brand-images.ts --source unsplash
```

**実行時間**: 約5-10分（77ブランド）
**結果**: 全アイテムにブランド画像が設定されます

#### Phase 2: 手動編集による品質向上

実際の商品写真を手動で追加してデータ品質を向上させます。

**2-1. データをCSV/JSONにエクスポート**
```bash
# 全データをエクスポート
pnpm tsx scripts/export-for-manual-edit.ts

# 人気ブランドのみエクスポート（推奨）
pnpm tsx scripts/export-for-manual-edit.ts --priority

# CSVのみ
pnpm tsx scripts/export-for-manual-edit.ts --format csv
```

**出力ファイル**:
- `data/exports/manual-edit.csv` - 全アイテム
- `data/exports/high-priority.csv` - 人気ブランド（編集推奨）
- `data/exports/manual-edit.json` - JSON形式

**2-2. CSVを手動編集**

ExcelまたはGoogle Spreadsheetsで`manual-edit.csv`を開いて編集:

1. 商品名でGoogle画像検索
2. 公式サイトやECサイトから画像URL取得
3. `Image URL`列に貼り付け
4. `Source`列に`manual`と記入
5. 優先度の高い商品から編集（人気ブランド優先）
6. 保存

**編集のヒント**:
- 公式サイトの画像を優先
- 商品パッケージ画像を選択
- 高解像度の画像を選ぶ
- 公開アクセス可能なURLを使用（プライベートリンク不可）

**2-3. 編集したCSVをインポート**
```bash
# プレビューモード（変更内容を確認）
pnpm tsx scripts/import-manual-edits.ts --file data/exports/manual-edit.csv --dry-run

# すべての変更を表示
pnpm tsx scripts/import-manual-edits.ts --file data/exports/manual-edit.csv --dry-run --show-all

# 本番実行（自動バックアップ作成）
pnpm tsx scripts/import-manual-edits.ts --file data/exports/manual-edit.csv
```

**変更レポート例**:
```
📊 Change Analysis:
  Total records: 5138
  Items with changes: 250
  New images: 200
  Updated images: 45
  Removed images: 5
```

#### Phase 3: 画像検証と品質管理

画像URLの有効性と品質をチェックします。

```bash
# 基本的な検証
pnpm tsx scripts/verify-images.ts

# 詳細情報を表示
pnpm tsx scripts/verify-images.ts --show-details

# レポートをJSONファイルに保存
pnpm tsx scripts/verify-images.ts --report

# 壊れた画像を自動修復
pnpm tsx scripts/verify-images.ts --fix
```

**検証項目**:
- URL到達性（HTTP 200チェック）
- Content-Typeが画像形式か
- 画像サイズ（10KB未満は警告）
- 壊れたリンク検出
- 重複URL検出

**レポート例**:
```
📊 Verification Report:
  Total items: 5138
  With images: 5100 (99.3%)
  Without images: 38 (0.7%)

  ✅ Valid images: 4950
  ❌ Broken images: 150
  ⚠️  Small size (<10KB): 50

  Success rate: 97.1%
```

### バックアップと復元

すべての書き込み操作前に自動バックアップが作成されます。

```bash
# バックアップ一覧表示
pnpm tsx scripts/utils/backup.ts --list

# 手動バックアップ作成
pnpm tsx scripts/utils/backup.ts --create

# バックアップから復元
pnpm tsx scripts/utils/backup.ts --restore 2026-01-16T12-30-00
```

**バックアップ場所**: `data/backups/shishaData.backup.*.js`

### 継続的改善サイクル

```
1. エクスポート → 2. 手動編集 → 3. インポート → 4. 検証
                       ↑                              ↓
                       └──────── 品質向上 ←───────────┘
```

毎週/毎月、追加で商品写真を手動追加し、データ品質を段階的に向上させることを推奨します。

### API使用量

**Google Custom Search API**
- 無料枠: 100クエリ/日
- Phase 1で77クエリ使用（1日で完了）
- レート制限: 1リクエスト/秒

**Unsplash API**
- 無料枠: 50リクエスト/時、5,000/月
- フォールバック用（Googleで見つからない場合）
- レート制限: 10リクエスト/秒

すべて無料枠内で完結します。

### スクリプト一覧

| スクリプト | 説明 | 主なオプション |
|-----------|------|---------------|
| `collect-brand-images.ts` | ブランド画像の自動収集 | `--dry-run`, `--source`, `--force` |
| `export-for-manual-edit.ts` | CSV/JSONエクスポート | `--priority`, `--format` |
| `import-manual-edits.ts` | 手動編集のインポート | `--dry-run`, `--show-all` |
| `verify-images.ts` | 画像検証と品質チェック | `--fix`, `--report`, `--show-details` |
| `utils/backup.ts` | バックアップ管理 | `--list`, `--create`, `--restore` |

### トラブルシューティング

**API quota exceeded**
- Google CSE: 翌日まで待つ（100クエリ/日）
- Unsplash: 次の時間まで待つ（50リクエスト/時）

**壊れた画像リンク**
```bash
pnpm tsx scripts/verify-images.ts --fix
```

**誤ったインポート**
```bash
# バックアップから復元
pnpm tsx scripts/utils/backup.ts --list
pnpm tsx scripts/utils/backup.ts --restore <timestamp>
```

**dry-runで必ず確認**
```bash
# すべての書き込み操作前に
--dry-run フラグで変更内容をプレビュー
```

## 🧪 テスト

```bash
# 全テストを実行
pnpm test

# カバレッジレポート付きでテスト
pnpm test:ci

# 特定のテストファイルを実行
pnpm test components/ShishaCard.test.tsx
```

## 🚀 デプロイ

本アプリケーションはVercelでのデプロイに最適化されています。

1. Vercelアカウントでプロジェクトをインポート
2. 環境変数を設定（必要な場合）
3. デプロイ実行

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. フォークする
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### コーディング規約
- TypeScript厳格モードに従う
- ESLintルールに従う
- コンポーネントは関数コンポーネントで実装（.tsxファイル）
- Tailwind CSS v4のユーティリティクラスを使用
- 型定義を明確に記述
- テストを書く（Jest + React Testing Library）

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- フレーバーデータの提供元
- オープンソースコミュニティ
- すべてのコントリビューター

---

質問や提案がある場合は、Issueを作成してください。