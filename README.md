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
- **Next.js 16**: React フレームワーク（App Router使用）
- **React 19**: UIライブラリ
- **TypeScript 5.9**: 型安全性とコード品質の向上
- **Tailwind CSS 4**: 最新のユーティリティファーストCSS
- **Framer Motion 12**: アニメーションライブラリ
- **Heroicons 2**: アイコンライブラリ

### インフラ
- **Cloudflare Workers**: サーバーレスランタイム（`@opennextjs/cloudflare` 経由）
- **Cloudflare Assets**: 静的アセット配信 + SSGキャッシュ

### 開発ツール
- **Node.js 22.12.0 LTS**: 最新のLTSランタイム
- **pnpm 10.x**: 高速で効率的なパッケージマネージャー
- **ESLint 9**: コード品質管理
- **Jest 30**: TypeScript対応テストフレームワーク
- **React Testing Library**: コンポーネントテスト

## 📦 インストールと起動

### 必要な環境
- Node.js 22.12.0 LTS（.node-versionで指定）
- pnpm 10.x 以上

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

# Cloudflare Workers ローカルプレビュー
pnpm preview

# Cloudflare Workers 本番デプロイ
pnpm deploy

# テスト実行
pnpm test

# テスト（ウォッチモード）
pnpm test:watch

# TypeScript型チェック
pnpm typecheck

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
│   ├── brands/[slug]/       # ブランド詳細ページ（SSG）
│   ├── flavor/[id]/         # フレーバー詳細ページ（動的SSR）
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
│   ├── shishaData.js        # フレーバーデータベース（2.5MB+）
│   ├── shishaMethods.ts     # データ操作ユーティリティ（TypeScript）
│   ├── brandImages.ts       # ブランドロゴURL解決（サーバー専用）
│   ├── brandDescriptions.ts # ブランド説明文（手動管理）
│   ├── flavorImages.ts      # フレーバー画像URL解決
│   ├── curatedPicks.ts      # Editor's Selection フレーバーリスト
│   └── homeSections.ts      # トップページセクション構成
├── lib/                     # ライブラリとサービス
│   ├── search/              # ファジー検索（Fuse.js）
│   ├── services/            # テスト用モックデータ
│   └── utils/               # ユーティリティ関数
├── scripts/                 # ビルド補助スクリプト
│   ├── build-data.ts        # searchIndex.json / brands.json 生成
│   └── build/              # prebuild フック用スクリプト
├── .node-version            # Node.js バージョン指定
├── open-next.config.ts      # Cloudflare Workers 設定
├── wrangler.jsonc           # Wrangler（Cloudflare CLI）設定
├── postcss.config.js        # PostCSS設定（Tailwind v4対応）
├── tsconfig.json            # TypeScript設定
└── public/                  # 静的ファイル
    └── images/              # 画像アセット（brands/ / flavors/）
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

## 🧪 テスト

```bash
# 全テストを実行
pnpm test

# カバレッジレポート付きでテスト
pnpm test:ci

# 特定のテストファイルを実行
pnpm test -- __tests__/ShishaCard.test.tsx
```

## 🚀 デプロイ

本アプリケーションは **Cloudflare Workers** にデプロイされています（`@opennextjs/cloudflare` 使用）。

```bash
# ローカルで Workers 動作確認
pnpm preview

# 本番環境へデプロイ
pnpm deploy
```

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