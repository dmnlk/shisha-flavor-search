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

## 全体フロー

1. **対象リストアップ** — `scripts/list_missing_flavors.ts` で「ローカル画像が存在しないフレーバー」をブランド × 数量順にソートして `/tmp/shisha-flavor-images/missing.json` に出力
2. **対象を絞る** — 引数がなければ人気ブランド上位から top 100、`--brand <slug>` で単一ブランドのみ、`--top N` で先頭 N 件、`--ids 1,2,3` で ID 指定
3. **並列ダウンロード** — 対象を 12〜15 件ごとにバッチに分け、general-purpose サブエージェントで並列に `[WebSearch → 画像URL 評価 → curl → ファイル検証 → 配置]` を実行。サブエージェントへのプロンプト雛形は [references/subagent_prompt_template.md](references/subagent_prompt_template.md)
4. **検証** — `scripts/verify_images.ts` で magic bytes + サイズを全チェック、0 バイトや HTML 誤取得を弾く
5. **再実行で漏れを埋める** — 失敗分は missing.json に残るので、クエリを変えて再試行
6. **レポート** — 追加件数、残件数、スキップ理由をユーザーに提示。`git status` で差分確認を促す

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

Top missing (by brand × popularity):
  [   1] Doobacco — Doobacco 9時間前 (JP) → id 8421
  ...
```

`/tmp/shisha-flavor-images/missing.json`:
```json
{
  "all": [{ "id": 8421, "productName": "...", "manufacturer": "...", "brandSlug": "...", "has": false }, ...],
  "missing": [ ... ]
}
```

### 2. 対象を絞る

5271 件を一度に回すのは現実的でない (subagent + WebSearch のレート/コスト)。以下のいずれかで絞る:

- 人気ブランド上位 (Doobacco, Al Fakher, Starbuzz など) の top 100〜300 件
- 特定ブランドだけ: `--brand starbuzz` (ブランド詳細ページの見栄え優先)
- 未収集の残りを波状に: 実行 → 成功分が減った missing.json を再読みして再実行

Python で簡単に分割:
```python
import json
with open('/tmp/shisha-flavor-images/missing.json') as f:
    data = json.load(f)
targets = data['missing'][:100]
batch_size = 12
batches = [targets[i:i+batch_size] for i in range(0, len(targets), batch_size)]
for i, b in enumerate(batches):
    with open(f'/tmp/shisha-flavor-images/batch_{i+1}.json', 'w') as f:
        json.dump(b, f, ensure_ascii=False)
```

### 3. 並列サブエージェント

対象を 12〜15 件ずつのバッチに分け、**単一のメッセージで並列起動**。各サブエージェントには:

- 担当フレーバーの `{ id, productName, manufacturer, brandSlug }` 一覧
- 出力ディレクトリ (`public/images/flavors/`)
- 検索優先順位 (下記)
- curl テンプレ (UA 指定必須)
- 採用/却下基準 (下記)
- 成功/失敗の報告フォーマット

プロンプト本文は [references/subagent_prompt_template.md](references/subagent_prompt_template.md) を `{{FLAVORS}}` プレースホルダーを JSON で置換して使う。

**並列数の目安**: 100 件なら 7〜9 並列 (1 エージェント 12〜15 件)。WebSearch のレート制限と API コストのバランス。

### 4. 検証

全サブエージェント完了後:
```bash
npx tsx .claude/skills/flavor-image-download/scripts/verify_images.ts
```

チェック内容:
- ファイルサイズ ≥ 2 KB (商品写真としては小さすぎるものを弾く)
- magic bytes が PNG / JPEG / WebP / AVIF のいずれか (SVG は弾く)
- 拡張子と実体が一致

不正ファイル (HTML 誤取得、0 バイト、mime 不一致、SVG) は削除候補として提示 → ユーザー確認のうえ削除。

### 5. 再挑戦

`list_missing_flavors.ts` を再実行して残件を確認。クエリを変えると成功率が上がる:
- 製品名の英語/日本語両方を試す
- 「ブランド名 + 香り系統 (例: apple, mint)」で代表画像を探す
- 販売終了品は smokedex.info のアーカイブに残っていることが多い

### 6. 最終レポート

- 追加できた件数と合計ファイルサイズ
- ブランド別成功率 (上位ブランドほど画像が見つかりやすい)
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
- ウォーターマーク入り、転売禁止と明記されているもの

迷ったら **保存せずスキップ** が原則 (捏造で埋めるよりは欠けている方がマシ)。

## 検索ソース (優先順)

信頼度の高い順:

1. **htreviews.org** — レビュー特化、個別フレーバーの商品写真が豊富
2. **smokedex.info** — 最大網羅、ただし汎用プレースホルダーに注意
3. **shisha-mart.com** (日本) — 正規物販、画像品質高
4. **shisha-oroshi.myshopify.com** (日本) — 卸売、画像多め
5. **newemoshisha.com** (日本) — 専門店、公式パッケージ写真が多い
6. **楽天市場 / Yahoo! ショッピング** (`site:rakuten.co.jp` / `site:shopping.yahoo.co.jp`)
7. **sisha-zanmai.com / shisha-sun.net / ptbn.jp** など日本のシーシャ専門店
8. **ブランド公式サイト** (例: `al-fakher.com`, `starbuzztobacco.com`)
9. **hookah.com / hookah-shisha.com / texashookah.com** など米国物販

同じ画像が複数ソースにあれば **日本の物販サイト優先**。商品画像の構図/解像度のブレが少なく、日本語フレーバー名に正確に紐づいていることが多い。

## 落とし穴

- **HTML 誤取得**: curl が HTML ページを `.png` として保存する事故。`verify_images.ts` の magic bytes 検証が必須
- **User-Agent**: 素の curl UA を拒否するサイトあり。`-A "Mozilla/5.0 (compatible; shisha-flavor-search-bot/1.0)"` を必ず付ける (それでも 403 なら `-A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"`)
- **リダイレクト**: `curl -L` 必須 (Rakuten / Yahoo / Shopify 系は多段リダイレクト)
- **Shopify CDN**: `cdn.shopify.com` 直リンクが取得できるので、商品ページより CDN の方が速い
- **ホットリンク禁止**: 一部サイトは Referer チェックあり。ダウンロード自体は個人利用の範囲で行うが、直接 img src で参照はしない (必ずローカル保存経由で使う)
- **重複**: 同じ商品 ID が複数の公告に出てくることは shishaData 上ではまずない (id は全件ユニーク)
- **サイズ肥大**: 2 MB 超の画像は next/image 側で最適化されるが、リポジトリサイズのため事前に `magick ... -resize 1024x1024^ -quality 85` 圧縮するのが望ましい

## 対話の流れ

スキル実行中にユーザーへ報告する:

- ステップ1 完了時: 「未取得フレーバー X 件。人気上位 top 100 から試しますか? 特定ブランドのみ? 全件?」
- ステップ3 着手時: 「N 件を Y 個のサブエージェントに分けて並列ダウンロード開始」
- ステップ4 完了時: 追加成功 N 件 / 失敗 M 件、採用基準を満たさず落としたものの件数
- ステップ6 終了時: `git status` + 代表的な保存画像パス、コミット要否を確認
