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
Phase 1: URL収集 (LLM/Haiku) — WebSearch + WebFetch のみ。curl/ファイル操作禁止
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

## ⚠️ 致命的な落とし穴: バッチデータの幻覚 (Agent プロンプトの fabrication)

**絶対にやってはいけない**: Python で `batch_N.json` を書き出した後、Agent プロンプトを組み立てるときに **記憶頼りで `id`/`productName` を直書きしないこと**。

過去の事故例 (run #8, 2026-05-17):
- `batch_2.json` の実中身は `[{id:732, productName:"ALFAKHAMAH AMORE"}, ...]` だった
- しかし Agent ツールに渡したプロンプトは `[{id:3193, productName:"ALFAKHAMAH Apricot"}, ...]` という**完全に架空のデータ**だった
- Haiku は正直に「flavor not found」と返してきたが、無いものを探させていたので当然
- 6 並列 × 150 件で歩留まり 0、検索コストだけ消費した

**回避策**: Agent プロンプトを組み立てるときは必ず:
```bash
# プロンプトに埋める JSON は batch ファイルから直読み
BATCH_JSON=$(cat /tmp/shisha-flavor-images/batch_1.json)
```
…として、`{{FLAVORS}}` プレースホルダーに**ファイルから読んだ JSON 文字列をそのまま流し込む**。Agent プロンプトに ID と productName を**手で書き起こさない**。

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

**並列数の目安**: 100 件なら **4〜5 並列**（1 エージェント 20〜25 件）。サブエージェントは WebSearch + WebFetch を使うため、1 体あたりのコンテキストが増える場合があるが、Haiku なので許容範囲。

### 3.5 Shopify 直取りショートカット (Haiku を経由しない)

ブランドが Shopify ベースの日本物販で扱われていることが分かっている場合、**Haiku を経由せず products.json を直接叩く**のが圧倒的に効率的かつ正確:

```bash
curl -s -A "Mozilla/5.0 ..." \
  "https://<shop>/collections/<brand-slug>/products.json?limit=250" \
  -o /tmp/<brand>.json
```

すると `{ products: [{ title, images: [{ src }] }] }` が返り、`cdn.shopify.com` 直 URL が確実に取れる。

実績のあるショップ:
- **shop.cloud-jp.net** — AL FAKHAMAH / その他、`/collections/<brand>/products.json` で全 SKU + 画像
- **tokyoshisha.com** — REVOSHI / その他、同上
- **sakurashisha.jp** — DEUS / その他、同上
- **5starhookah.com** — Haze / NIRVANA 等、同上
- **shishagear.com** — Alchemist、同上
- **thehookahlab.com** — TickTock、同上

マッチング手順:
1. `products.json` から `{ title, src }` を吸い出す
2. shishaData の同ブランドエントリをロード (`node -e "..."`)
3. 名前正規化 (lowercase + 記号除去 + 余分空白除去) で突き合わせ
4. 出力は `[{id, url, ext}]` の標準フォーマットで `urls.json` へ → 通常の download_from_urls.ts に流し込む

**重要**: ブランドによって shishaData の productName 表記が違う。例: REVOSHI は `REVOSHI TOBACCO <Name> Flavored`、ALFAKHAMAH は `ALFAKHAMAH <Name>`、Adalya は `Adalya <Name>` 等。**正規化前にブランド固有の接頭辞・接尾辞を strip すること**。

歩留まり実績: 49/106 (46%) — Haiku 並列方式 (15%) を遥かに上回る。

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

### 7. コミット & PR 作成

検証が通ったら **自動的に** コミットして PR を作る（ユーザーへの確認不要）。

```bash
# 1. ブランチ作成（main から）
# 同名ブランチが既存の場合は suffix b, c … を追加する
BRANCH="images/flavor-$(date +%Y%m%d)"
git checkout -b "$BRANCH" 2>/dev/null || git checkout -b "${BRANCH}b" 2>/dev/null || git checkout -b "${BRANCH}c"

# 2. 追加された画像をステージ
git add public/images/flavors/

# 3. コミット（追加件数とブランドを記載）
git commit -m "feat(images): add <N> flavor images (<brand1>, <brand2>, ...)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

# 4. PR 作成
gh pr create \
  --title "feat(images): add <N> flavor images (<brand1>, <brand2>, ...)" \
  --body "$(cat <<'EOF'
## Summary
- <N> flavor images added
- Brands covered: <brand1>, <brand2>, ...
- Sources: <source1>, <source2>, ...

## Remaining missing
- <M> flavors still without images (list top examples)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

PR URL をユーザーに提示する。

### 8. 最終レポート

- 追加できた件数と合計ファイルサイズ
- ブランド別成功率
- 残った代表例
- 怪しい保存画像 (10KB 未満など) の再確認推奨リスト
- PR URL

## 命名規則 (重要)

ファイル名 (拡張子を除く部分) は `data/shishaData.js` の `id` 数値と **完全一致**。`data/flavorImages.ts` がこの命名規則で自動的に URL にマップする。

例:
| id  | ファイル名 |
|-----|------------|
| 1   | `1.png`    |
| 421 | `421.jpg`  |
| 8421 | `8421.webp` |

対応拡張子: `.png` `.jpg` `.jpeg` `.webp` `.avif` (SVG は商品写真用途として不適なので非対応)。

## 取得対象から除外する ID (既知の取得不能フレーバー)

以下は繰り返し試みても画像 URL を発見できなかったフレーバー。
自動収集の対象から外すこと（詳細は [issue #208](https://github.com/dmnlk/shisha-flavor-search/issues/208)）。

### Doobacco (55件) — 欧州 retailer のアンチスクレイピング、公式サイトに個別写真なし

IDs: 1872, 1873, 1875, 1879, 1880, 1881, 1882, 1883, 1884, 1886, 1890, 1908, 1910, 1933, 1935, 1968, 1969, 1970, 1971, 1974, 1975, 1976, 1978, 1981, 1985, 1989, 1992, 1994, 1995, 2044, 2045, 2046, 2047, 2048, 2049, 2090, 2091, 2092, 2144, 2145, 2146, 2147, 2148, 2149, 2155, 2156, 2157, 2158, 2159, 2160, 2227, 2229, 2230, 2238, 2239, 2240

### Al Waha 旧スタンダードライン (10件) — 廃番・日本独自流通品の可能性

IDs: 445, 446, 447, 453, 623, 625, 638, 641, 653, 659

---

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

### ブランド別推奨ソース (実績あり)

| ブランド | 推奨ソース | 備考 |
|----------|-----------|------|
| Fantasia | **smoking-hookah.com**, smoxygen.com, hookahvault.com | smoking-hookah が全品掲載 (`/cdn/shop/files/0200-XXXX.png`) |
| Haze | **hazetobacco.com** (`i0.wp.com` CDN), 5starhookah.com | 公式 WordPress CDN が一番確実 |
| Adalya | **adalyahookah.com** (公式), guesshookah.com, iconhookah.com, thehookahlab.com | 公式 Shopify CDN が直リンク可 |
| Starbuzz | iconhookah.com, thehookahlab.com, tobaccostock.com | Shopify CDN 直 URL |
| Tangiers | hookahvault.com, iconhookah.com | Tangiers Noir は hookahvault が充実 |
| Al Waha | elwano.de | 欧州卸、現行ラインは高カバレッジ |
| Afzal | **soex.com** (メーカー直), iconhookah.com, thehookahlab.com | soex.com は WordPress 画像 URL が記述的で信頼性高 |
| Mazaya | iconhookah.com, thehookahlab.com, worldhookahmarket.com | `Resource_Service_XX` ファイル名だが商品ページ紐付きは正確 |
| Khalil Maamoon | **khalilmamoon.com** (公式 Shopify) | CDN URL が商品名ベース (例: `black-orange_grande.jpg`) で最も信頼性高 |
| Golden Layalina | **kalyan-hut.ru** (ロシア物販) | フレーバー名ベースの URL で一致検証しやすい |
| Layalina Ya Layl | htreviews.org, layalinaus.com | 個別フレーバー写真がネット上に極めて少ない。50g 箱の retail listing は層が薄く、layalinaus.com の `pimg.php` 経由でしか取れないことが多い |
| **Azure** | *(歩留まり低)* | shishaData.js の名前 (Cucumelon, D Cherry, Life's Peach 等) は retailer 上で別名 (Cool Cucumber, Cherry Muffin, Carolina Peach) で出回っていることが多く、エージェントが似た名前の別商品を流用しがち。100g/250g 容量違いの混在もある。**ID 単位で厳密検証**するか、当面はスキップ |
| Nirvana (Super Shisha) | **5starhookah.com** (`NSS_<Flavor_Name>.png` 形式) | 公式に近い flavor-art ラベル画像。ただし retailer の設定漏れで `NSS_Citrus_OD.png` を別フレーバーに割り当てるケース多発。ファイル名と productName の照合必須 |
| Hookafina | **hookafina.com** (Shopify CDN), 5starhookah.com, thehookahlab.com | 公式現行ラインナップは ~22 SKU のみ。shishaData の古いリスト (Bahama Mama, Currant, Coconut, Cool Menthol 等) は大半廃番で取得不能。現行の Tutti Fruiti / Vanilla Shake / Watermelon Mint / Deja Blu / Tangy Peach 等のみ採用可 |
| TickTock | **thehookahlab.com** (Shopify CDN) | `Tick-Tock-Shisha-Tobacco-<NAME>-<Description>_<uuid>_1024x.jpg` 形式でファイル名にフレーバー名が明示。信頼性高 |
| DEUS | **sakurashisha.jp** (日本正規流通、最優先) / worldhookahmarket.com (欧州 200G、補助) | sakurashisha.jp が shishaData の旧 30g/100g ライン名 (Gynness, Marmelade, Pineapple Mango, Pink Grapefruit, Viola, Wood, Flower Perfume, Elderberry Wine 等の特殊綴り) と完全一致する正規流通元で全 11 種を網羅。Shopify CDN URL は `https://sakurashisha.jp/cdn/shop/files/<FLAVOR_UPPERCASE>.jpg?v=...&width=1946` 形式 (`width=1946` で本画像)。worldhookahmarket は 200G 現行ラインで命名が変わっており (例: "Mango Pineapple"→"Pineapple Mango"、"Gynness"→"Guiness")、Cyrillic ファイル名は URL encode 必須 |
| **Panorama** | *(取得不可)* | 地域限定流通でネット上に商品写真がほぼ存在しない → スキップ推奨 |

## 落とし穴

- **Shopify CDN**: `cdn.shopify.com` 直リンクが取得できるので、商品ページより CDN の方が速い
- **WordPress CDN (i0.wp.com)**: URL に `?fit=2000%2C2000&ssl=1` 等のクエリパラメータが付く場合は除去してよい (なくても元画像が返る)。`&amp;` が HTML エンティティのまま混入しやすいので `&` に正規化すること
- **重複**: 同じ商品 ID が複数の公告に出てくることは shishaData 上ではまずない (id は全件ユニーク)
- **同 URL で異フレーバー罠**: サブエージェントが複数の容量違い (100g/50g) で同 URL を返すのは正常だが、**まったく別フレーバー名なのに同 URL** が返ってきた場合はエージェントのミス。URL 集約時に同 URL が異なる productName に割り当てられていないかチェックし、怪しければスキップ
- **類似商品名罠**: ブランド内に名前が似た別フレーバーが存在する場合がある (例: Haze "Mint" と "Mint Supreme"、"Peach" と "Peach Cooler")。URL のファイル名に別フレーバーの名前が入っていたら却下
- **Haze Cheech & Chong ライン**: 5starhookah.com は "HeyMan" 画像を Cheech & Chong 全バリアント共通で返す。"Hey Man" (ID 2758) にのみ使用し、他の Cheech & Chong フレーバーへの流用は却下
- **ブランチ名衝突**: 同日 2 回目以降の実行では `images/flavor-YYYYMMDD` が既存の場合がある。`b`, `c` と suffix を付けて回避する (ステップ 7 参照)
- **kalyan-hut.ru リサイズキャッシュ**: URL パスに `resize_cache/iblock/XXX/200_230_1/` が入る thumbnail URL が取れる。15KB 程度だが magic bytes は正常 JPEG。採用可
- **layalinaus.com pimg.php**: `pimg.php?o=p&m=limit&w=300&h=300&s=1/img/p/...` 形式の PHP 画像プロキシは `.png` として保存可能。HTML エンティティ `&amp;` を `&` に正規化してから使うこと
- **Panorama ブランド**: ネット上に商品写真がほぼ存在しないため収集対象外。Haiku エージェントを投入しても空リストが返る
- **Hookah Vault のブランド汎用ロゴ罠**: hookahvault.com は商品個別写真が無いフレーバーで `azurelogo1_<uuid>.png` のようなブランドロゴ画像を返してくる。一見 Shopify CDN 直 URL に見えるが、ファイル名に商品名が含まれていなければ **却下**（プレースホルダー扱い）
- **Azure 命名ミスマッチ**: shishaData.js のフレーバー名と retailer 上の販売名が一致しないことがある (例: "Cucumelon"→"Cool Cucumber"、"D Cherry"→"Cherry Muffin"、"Life's Peach"→"Carolina Peach"、"Melon Green Tea"→"Melon King"、"Lime Cola"→"Lime")。エージェントは「似た名前の別商品」を平気で流用するので、URL 集約時に **ファイル名と productName が一致するか必ず目視チェック**
- **Hookafina の旧ラインナップ廃番**: shishaData.js の Hookafina エントリ (Bahama Mama / Blackberry Peach / Chocolate / Chocomint / Citrusberry / Coconut / Currant / Electric Lotus / Frostberry / Grenadine / Mai Tai / Mimosa / Peach Fuzzy Navel / Root Beer Float / S'more / Tijuana Sunrise / Vegas Love 等) は大半廃番。公式 hookafina.com の現行ラインナップ (~22 SKU) と照合し、現行品 (Tutti Fruiti, Vanilla Shake, Watermelon Mint, Deja Blu, Tangy Peach, Pinkberry, Dragon Fruit, Double Melon Blast, Orange Mint, Peppermint 等) のみ採用可
- **Nirvana 5starhookah のフォールバック画像罠**: `NSS_Citrus_OD.png` を Schnozzberries / Smokin Dead / Spirit Mind Soul / Ice Bon Bon など複数フレーバーに使い回す現象あり。`NSS_<Flavor_Name>.png` でフレーバー名がファイル名に明示されているもののみ採用
- **`.webp` 拡張子で実体 JPEG 罠**: 5starhookah.com は `.webp` 拡張子で配信しているが実体が JPEG のファイルがある (例: `hookafinavanillashake.webp`)。`verify_images.ts` が catch する。検出されたら拡張子を `.jpg` にリネームすればよい
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
- ステップ7 終了時: ブランチ作成 → コミット → PR 作成を自動実行し、PR URL を報告

## 自己改善ルール (重要)

**スキルを実行するたびに、得た知見を自分自身 (このファイル) に反映すること。**

PR 作成後、以下の観点で SKILL.md を見直して必要なら更新する:

1. **新しいソースが有効だった** → 「ブランド別推奨ソース」テーブルに追記
2. **既存ソースが使えなくなった / 精度が低かった** → テーブルから削除または注意書きを追加
3. **URL クリーニングで新パターンが必要だった** (HTML エンティティ、CDN パラメータ等) → 「落とし穴」に追記
4. **エージェントが繰り返し間違えるパターンを発見した** (似た名前の別商品、ジェネリック画像の流用等) → 「採用/却下基準」または「落とし穴」に追記
5. **永続的に取得できないフレーバーを発見した** → 「取得対象から除外する ID」に追記し GitHub issue を更新
6. **ブランチ衝突など手順上のバグを踏んだ** → 「ステップ 7」を修正

更新は **PR を出さずに直接 main にコミット** してよい (スキル自体の meta-update)。コミットメッセージ例:
```
chore(skill): update flavor-image-download with learnings from <date> run
```
