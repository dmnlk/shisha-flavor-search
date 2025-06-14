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