---
name: flavor-image-download
description: shisha-flavor-search リポジトリで、個別フレーバーの商品画像 (缶・パウチ・箱など) を htreviews.org, smokedex.info, shisha-mart.com, shisha-oroshi.myshopify.com, newemoshisha.com, 楽天市場ほか日本の各シーシャ物販サイトから収集し、public/images/flavors/<id>.<ext> に配置する。ユーザーが「商品画像を集めて」「フレーバーの画像をダウンロード」「flavor-image-download」「missing flavor image を埋めて」と言ったときに必ずこのスキルを使うこと。
---

# flavor-image-download

`data/shishaData.js` に登録されている各フレーバーに対応する商品画像 (缶/パウチ/箱の撮影画像) を公開ソースから収集し、`public/images/flavors/<flavor-id>.(png|jpg|jpeg|webp|avif)` に配置するためのスキル。配置すれば `data/flavorImages.ts` 経由で自動的にカード/詳細ページに表示される。

## 前提

- **実行はリポジトリルートから**。Claude Code のセッション内で起動している想定。
- 外部 HTTP が通るネットワーク環境。
- `pnpm install` 済み (tsx が使える)。
- 画像は個人利用目的。商用再配布しない前提で、明確な公式/正規物販サイトの画像を優先。
- shishaData は ~5,271 件あり、全数処理は数時間〜数日規模。**通常は 100〜300 件ずつ波状に実行**するのが現実的。

## 全体フロー（2フェーズ設計）

コンテキスト消費を最小にするため、**「LLMが考える」フェーズと「bashが動く」フェーズを完全分離**する。

```
Phase 1: URL収集 (LLM/Haiku) — WebSearch のみ。curl/ファイル操作禁止
  ↓  /tmp/shisha-flavor-images/urls.json を出力
Phase 2: バッチダウンロード (bash) — LLMを介さずに全curl実行
  ↓  public/images/flavors/<id>.<ext> に保存
Phase 3: 検証 (bash) — verify_images.ts で magic bytes チェック
```

1. **対象リストアップ** — `scripts/list_missing_flavors.ts` で「ローカル画像が存在しないフレーバー」をブランド × 数量順にソートして `/tmp/shisha-flavor-images/missing.json` に出力
2. **対象を絞る** — 引数がなければ人気ブランド上位から top 100、`--brand <slug>` で単一ブランドのみ、`--top N` で先頭 N 件、`--ids 1,2,3` で ID 指定
3. **URL収集サブエージェント（検索のみ）** — 対象を 20〜30 件ずつのバッチに分け、**Haiku サブエージェント**で並列に WebSearch を実行し、`{id, url}` ペアの JSON だけを返す。**curl・ファイル保存・検証は一切行わない**
4. **URL 集約** — 各サブエージェントの結果を `/tmp/shisha-flavor-images/urls.json` に書き出す
5. **バッチダウンロード** — `scripts/download_from_urls.ts` を bash で実行。LLM なしで全 curl を処理
6. **検証** — `scripts/verify_images.ts` で magic bytes + サイズを全チェック、0 バイトや HTML 誤取得を弾く
7. **レポート** — 追加件数、残件数、スキップ理由をユーザーに提示。`git status` で差分確認を促す

## ステップ詳細

### 1. 対象の抽出

```bash
# 全体から未取得フレーバーを列挙
npx tsx .claude/skills/flavor-image-download/scripts/list_missing_flavors.ts

# 単一ブランドに絞る
npx tsx .claude/skills/flavor-image-download/scripts/list_missing_flavors.ts --brand al-fakher

# 先頭 100 件だけ
npx tsx .claude/skills/flavor-image-download/scripts/list_missing_flavors.ts --top 100
```

出力 (stderr):
```
Total flavors: 5271
With image:    0
Missing:       5271
Output:        /tmp/shisha-flavor-images/missing.json
```

### 2. 対象を絞る

5271 件を一度に回すのは現実的でない (subagent + WebSearch のレート/コスト)。以下のいずれかで絞る:

- 人気ブランド上位 (Doobacco, Al Fakher, Starbuzz など) の top 100〜300 件
- 特定ブランドだけ: `--brand starbuzz`
- 未収集の残りを波状に: 実行 → 成功分が減った missing.json を再読みして再実行

Python で簡単に分割:
```python
import json
with open('/tmp/shisha-flavor-images/missing.json') as f:
    data = json.load(f)
targets = data['missing'][:100]
batch_size = 25
batches = [targets[i:i+batch_size] for i in range(0, len(targets), batch_size)]
for i, b in enumerate(batches):
    with open(f'/tmp/shisha-flavor-images/batch_{i+1}.json', 'w') as f:
        json.dump(b, f, ensure_ascii=False)
```

### 3. URL収集サブエージェント（Haiku、検索のみ）

対象を **20〜25 件ずつ**のバッチに分け、**単一のメッセージで並列起動**。

> **必須**: サブエージェントは必ず `model: "haiku"` を指定すること。
> **禁止**: curl、ファイル保存、ファイル検証をサブエージェントに実行させない。

各サブエージェントには:
- 担当フレーバーの `{ id, productName, manufacturer, brandSlug }` 一覧
- 出力形式: `[{"id": 421, "url": "https://...", "ext": "jpg"}]` の JSON のみ

プロンプト本文は [references/subagent_prompt_template.md](references/subagent_prompt_template.md) を `{{FLAVORS}}` プレースホルダーを JSON で置換して使う。

**並列数の目安**: 100 件なら **4〜5 並列**（1 エージェント 20〜25 件）。サブエージェントが WebSearch だけなので 1 体あたりのコンテキストが小さく、過剰な並列化は不要。

### 4. URL 集約

全サブエージェントの返り値 (JSON 配列) を結合して `/tmp/shisha-flavor-images/urls.json` に書き出す。

```python
import json

results = [
    # subagent 1 の返り値 (JSON 配列) をここに貼る
    # subagent 2 の返り値...
]

merged = [item for batch in results for item in batch]

with open('/tmp/shisha-flavor-images/urls.json', 'w') as f:
    json.dump(merged, f, ensure_ascii=False, indent=2)

print(f"URL collected: {len(merged)}")
```

### 5. バッチダウンロード（bash、LLMなし）

```bash
npx tsx .claude/skills/flavor-image-download/scripts/download_from_urls.ts \
  /tmp/shisha-flavor-images/urls.json
```

このスクリプトが並列 curl を実行。LLM は介在しない。

スクリプトの仕様:
- 入力: `[{id, url, ext?}]` の JSON ファイル
- 並列数: 8（ネットワーク IO バウンドのため CPU 数より多くてよい）
- 拡張子: URL から自動推定（クエリ文字列を除いた末尾）、不明なら `.jpg`
- UA: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36`
- リトライ: 403 時は UA を変えて 1 回再試行
- 出力: `OK: 421.jpg (42KB)` / `FAIL: 9121 (403)` の 1 行ログ

### 6. 検証

全ダウンロード完了後:
```bash
npx tsx .claude/skills/flavor-image-download/scripts/verify_images.ts
```

チェック内容:
- ファイルサイズ ≥ 2 KB
- magic bytes が PNG / JPEG / WebP / AVIF のいずれか
- 拡張子と実体が一致

不正ファイルは削除候補として提示 → ユーザー確認のうえ削除。

### 7. 最終レポート

- 追加できた件数と合計ファイルサイズ
- ブランド別成功率
- 残った代表例
- 怪しい保存画像 (10KB 未満など) の再確認推奨リスト

`git status` で差分を添えて、コミット要否を確認。

## 命名規則 (重要)

ファイル名 (拡張子を除く部分) は `data/shishaData.js` の `id` 数値と **完全一致**。`data/flavorImages.ts` がこの命名規則で自動的に URL にマップする。

例:
| id  | ファイル名 |
|-----|------------|
| 1   | `1.png`    |
| 421 | `421.jpg`  |
| 8421 | `8421.webp` |

対応拡張子: `.png` `.jpg` `.jpeg` `.webp` `.avif` (SVG は商品写真用途として不適なので非対応)。

## 採用/却下基準 (重要)

**採用すべき画像**:
- 缶・パウチ・箱そのものが大きく写っている公式物販写真
- 正規取扱店・メーカー公式ショップ・レビューサイトの商品写真
- 400×400 px 以上、10 KB 以上

**却下すべき画像** (ユーザーは「怪しいのは要らない」と明言):
- SmokeDex の汎用プレースホルダー (缶のシルエットだけのアイコン等)
- 人物が主体の画像、ラウンジ内観、使用中のイメージ写真
- Instagram/TikTok のリポスト、出所不明の転載
- AI 生成疑いの過度にきれいすぎる画像
- 商品名が読めない / 別商品 / パッケージが違う
- 解像度 300×300 px 未満、2 KB 未満
- ウォーターマーク入り

迷ったら **URL を返さずスキップ** が原則。

## 検索ソース (優先順)

1. **htreviews.org** — レビュー特化、個別フレーバーの商品写真が豊富
2. **smokedex.info** — 最大網羅、ただし汎用プレースホルダーに注意
3. **shisha-mart.com** (日本) — 正規物販、画像品質高
4. **shisha-oroshi.myshopify.com** (日本) — 卸売、Shopify CDN 直 URL が取れる
5. **newemoshisha.com** (日本) — 専門店、公式パッケージ写真が多い
6. **worldhookahmarket.com** (欧州) — SEBERO・ロシア系・中東ブランドが充実
7. **楽天市場 / Yahoo! ショッピング** (`site:rakuten.co.jp` / `site:shopping.yahoo.co.jp`)
8. **sisha-zanmai.com / shisha-sun.net / ptbn.jp** など日本のシーシャ専門店
9. **ブランド公式サイト** (例: `al-fakher.com`, `starbuzztobacco.com`)
10. **hookah.com / hookah-shisha.com / texashookah.com** など米国物販

同じ画像が複数ソースにあれば **日本の物販サイト優先**。

## 落とし穴

- **Shopify CDN**: `cdn.shopify.com` 直リンクが取得できるので、商品ページより CDN の方が速い
- **重複**: 同じ商品 ID が複数の公告に出てくることは shishaData 上ではまずない (id は全件ユニーク)
- **サイズ肥大**: 2 MB 超の画像は次のコマンドで事前圧縮するのが望ましい:
  ```bash
  magick <file> -resize '1024x1024>' -quality 85 <file>
  ```

## 対話の流れ

スキル実行中にユーザーへ報告する:

- ステップ1 完了時: 「未取得フレーバー X 件。人気上位 top 100 から試しますか? 特定ブランドのみ? 全件?」
- ステップ3 着手時: 「N 件を Y 個の Haiku サブエージェントに分けて URL 収集開始（ダウンロードはその後 bash で実行）」
- ステップ4 完了時: URL 収集 N 件 / 見つからず M 件
- ステップ5 完了時: ダウンロード成功 N 件 / 失敗 M 件
- ステップ7 終了時: `git status` + 代表的な保存画像パス、コミット要否を確認
