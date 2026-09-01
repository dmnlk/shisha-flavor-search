---
name: flavor-description-update
description: shisha-flavor-search リポジトリで、指定ブランドのフレーバー説明 (詳細ページ「Tasting note」用の日本語テキスト) を htreviews.org と hookah-reviews.com のレビューから収集・要約して data/flavorDescriptions.ts に追加する。ユーザーが「<ブランド>の説明を作って/集めて」「フレーバーの description を追加」「Tasting note を増やして」「flavor-description-update」と言ったときに必ずこのスキルを使うこと。
---

# flavor-description-update

指定ブランドの全フレーバーについて、レビューサイトから公式説明+レビュー/コメント欄の傾向を収集し、日本語 2〜3 文の説明として `data/flavorDescriptions.ts` の `FLAVOR_DESCRIPTIONS` に追加するスキル。追加すれば詳細ページの「Tasting note」セクション・meta description・Product JSON-LD に自動反映される (SEO 上は thin content 対策として本文テキストが最重要)。

DOGMA (18) / MustHave (14) / DARKSIDE (73) / BONCHE (24) / SEBERO (78) / Azure (138) のランで確立した手順 (2026-08〜09)。

## 情報ソース

| ソース | 内容 | 備考 |
|---|---|---|
| **htreviews.org** (露語) | 公式説明・評価分布・リピート意向・レビュー+ブランド公式返信 | ロシア系ブランドはほぼ網羅。**ただし robots.txt が `User-agent: Claude / Disallow: /` を宣言している** — 大量クロールはせず、必要最小限にとどめるか他ソースで代替すること |
| **hookah-reviews.com** (日本語ブログ byダビデ) | 著者レビュー (総評点 100 点満点)・コメント欄 | 副ソース。扱いはブランド次第 (Bonche は 0 件、Azure は 75 件で主ソースだった)。HTTP サイト |
| **日本の総代理店 / 輸入元の EC サイト** | 公式・代理店の日本語説明、開発経緯、推奨ミックス | 欧米ブランドや日本限定銘柄はここが唯一のソースになる。Azure = `tokyoshisha.com` |

**ブランドの出自でソースの優先度が変わる**: ロシア系は htreviews が主ソースだが、**アメリカ系ブランド (Azure, Fumari, StarBuzz, Trifecta 等) は htreviews の掲載が薄く、hookah-reviews.com と日本の代理店 EC が主ソースになる**。着手前に3ソースそれぞれの掲載量を数えてから分担を決めること。

他ソースを使う場合も方針は同じ: 出典が特定できる公知情報のみ。

## 絶対原則

1. **捏造禁止**: 情報源が見つからないフレーバーは**書かずにスキップ**し、その旨を報告する (例: 情報なし時の Bonche Happy New Year)。ユーザーが URL を提供したら追記する。
2. **ノンアロマ表記**: 香料なしタバコは「無香料」ではなく**「ノンアロマ」**と書く (日本の通称)。
3. **賛否は正直に**: 酷評が優勢な銘柄はそのまま書く (例: 「低評価が優勢な癖の強い銘柄 (リピート意向13%)」)。宣伝コピーにしない。
4. **main 直コミット禁止**: 作業前に `feature/<brand>-flavor-descriptions` ブランチを切る (セッションで作業ブランチが指定されている場合はそちらを使う)。
5. **既存エントリの重複キー禁止**: 追加前に対象ブランドのキーが既に無いか確認。既存エントリを充実させる場合は置き換える。
6. **代理店 EC の煽り文をそのまま写さない**: 「最高⚡️」「絶対美味い」のようなセールス表現は落とし、味の構成・開発経緯・推奨ミックスなど事実部分だけを使う。

## 説明文のスタイル

- 2〜3 文、100〜160 字程度。構成: **1文目 = 味プロファイル (公式説明ベース)** → **2文目以降 = レビュー傾向** (htreviews の合意、定量情報、ミックス適性、熱管理の注意など)。
- 定量情報は効果的なものだけ添える: `(リピート意向98%)` `(評価197件・5点56%)` など。
- hookah-reviews.com に記事があれば `hookah-reviews.comでは77点で「…」` の形で総評点+要点を 1 節。
- 別商品の 2.0 / リニューアル版は別エントリで区別する。
- ブランドごとにセクションコメントを付ける: `// <BRAND> — htreviews.org と hookah-reviews.com のレビューを要約 (YYYY-MM 時点)`。特記事項 (ライン対応関係など) もここに書く。

## フロー

```
1. ブランチ作成 → 対象ブランドのフレーバーとキーを列挙
2. recon: 各ソースの URL を銘柄に事前マッピングする (2-a htreviews / 2-b hookah-reviews / 2-c 代理店 EC)
3. 並列サブエージェント (general-purpose, 1体あたり5〜10銘柄) でレビュー収集
4. FLAVOR_DESCRIPTIONS へ書き込み → 全 id 解決を検証
5. pnpm lint / test / typecheck → コミット → push → PR (マージは人間が Web UI で)
```

**recon は必ず自分でやってからエージェントを起動する**。URL 発見をエージェント任せにすると同じ検索を N 体が重複実行し、取りこぼしも増える。銘柄 → URL の対応表を作り、`brief_<n>.md` に書き出してエージェントに渡すのが最も速い。

### 1. 対象列挙とキー確認

```bash
npx tsx -e "
import { shishaData } from './data/shishaData.js'
import { flavorDescriptionKey, getFlavorDescription } from './data/flavorDescriptions'
const seen = new Map<string, any>()
for (const f of (shishaData as any[]).filter(f => /<brand正規表現>/i.test(f.manufacturer))) {
  const k = flavorDescriptionKey(f.manufacturer, f.productName)
  if (!seen.has(k)) seen.set(k, f)
}
for (const [k, f] of seen) console.log(f.id, JSON.stringify(k), getFlavorDescription(f) ? '(既存)' : '')
console.log('unique:', seen.size)
"
```

- キーは `brandSlug(manufacturer) + ':' + normalizeFlavorName(productName, manufacturer)`。**サイズ違い (30g/100g等) は同一キーに正規化される**ので、説明はユニーク銘柄数だけ書けばよい。
- ハイフンや記号はスペースに正規化される (`K-T BROADLEAF` → `k t broadleaf`、`C.R.E.A.M. S.O.D.A.` → `c r e a m s o d a`)。

### 2-a. htreviews.org の recon

URL 構造: `https://htreviews.org/tobaccos/<brand>/<line>/<flavor-slug>`

```bash
# ブランドページからライン一覧
curl -sL -A "claude-code/1.0" "https://htreviews.org/tobaccos/<brand>" -o $S/brand.html
grep -oE 'href="<brand>/[^"]*"' $S/brand.html | sort -u

# 各ラインページから slug 抽出 (SSR は最大20件程度しか出ない — 部分的)
python3 -c "import re; s=open('$S/line_X.html',encoding='utf-8').read(); print(sorted(set(re.findall(r'/tobaccos/<brand>/<line>/([a-z0-9-]+)', s))))"

# 見つからない銘柄は候補 slug を直接プローブ (200 なら存在)
curl -s -o /dev/null -w "%{http_code}" -A "claude-code/1.0" "https://htreviews.org/tobaccos/<brand>/<line>/<slug>"
```

slug の作り方と落とし穴:

- 英語名ブランド (MustHave, Darkside, Bonche 等) は英語名の kebab-case がほぼそのまま slug (`2.0` → `-20`)。
- ロシア語名ブランド (DOGMA 等) は**ロシア語のラテン翻字** (`Apple Punch` → `yablochnyy-punsh`、`Gummi Bears` → `mishki-gammi`)。英語名から推測できないときはライン全列挙+突き合わせ。
- **季節限定は MOF 公告名とサイト名が別物のことがある**: Bonche「Happy New Year」= htreviews「New Year 2026」(slug `new-year-2026`)。年付き slug (当年・翌年) も試し、それでも駄目なら**ユーザーに URL を聞く**のが早い。
- 大規模ブランドは probe スクリプト化が有効 (Darkside 73 銘柄の例: 候補 slug × ライン優先順で ThreadPoolExecutor 並列 HEAD、known slug はスキップ)。

### 2-b. hookah-reviews.com の recon

`?s=<brand>` の検索ページは当てにならない (Azure では 0 件に見えた)。**サイドバーのカテゴリ一覧に載っているブランド別カテゴリを直接ページングする**のが確実:

```bash
# 1) 任意の記事を1つ取得し、サイドバーからブランドのカテゴリ slug を拾う
curl -sL -A "claude-code/1.0" "http://hookah-reviews.com/?s=Azure" -o $S/hr.html
grep -o 'href="[^"]*"[^>]*>Azure Black/Gold' $S/hr.html | head -1   # → /category/flavour-review/azb/

# 2) カテゴリを page/N/ でページング (1ページ28件、404 が出るまで)
#    記事リンクは <h3 class="post-title"><a href="...">タイトル</a>
```

記事タイトルは `<Brand> <Line> / <Flavor>（一言サマリ）` 形式なので、`（` の手前を切り出して銘柄名で突き合わせる。表記ゆれ (`Carifornia`→`California`, `Chocoralate`→`Chocolate`, `Cinamon`→`Cinnamon`, `Life's a Peach`→`Life's Peach`, `Teabag`→`Tea Bag`) を正規化してからマッチさせること。

記事本文には**「（総評）NN点」**が入っているので、説明文に引用できる定量情報として拾う。

### 2-c. 日本の代理店 EC (Shopify) の recon

代理店サイトが Shopify なら、商品と説明文を一括で取れる:

```bash
curl -sL "https://tokyoshisha.com/collections/shisha/products.json?limit=250" -o $S/ts.json
# title / handle / vendor / tags / body_html を抽出。商品URLは https://<host>/products/<handle>
```

**他ブランドの商品が混ざるので、`tags` と `vendor` にブランド名 (英語+カタカナ表記ゆれ: Azure/アズア/アズアー/アズーア) が含まれるものだけに絞ること**。絞らないと同名フレーバー (Watermelon 等) を他社商品の説明で埋めてしまう。取得した `body_html` はエージェントに再取得させず、`brief_<n>.md` に本文ごと埋め込んで渡す。

### 3. 並列サブエージェントで収集

- **general-purpose** エージェントに 1 体あたり **5〜10 銘柄** を割り当てる (73 銘柄 = 8 体、138 銘柄 = 14 体が実績)。同一メッセージで一斉起動。
- **同名フレーバーの別ライン (Azure の Black/Gold 等) は同じエージェントにまとめる**。ソースが共通なので取得が 1 回で済み、説明のトーンも揃う。
- 一時ファイルの scratchpad プレフィックスをエージェントごとに変える (衝突防止)。
- プロンプト雛形 (実績あり):

```
シーシャタバコ <BRAND> の以下Nフレーバーについて、htreviews.org と hookah-reviews.com から情報を収集し日本語で要約してください。

対象 (名前 | htreviews URL):
- <NAME> | https://htreviews.org/tobaccos/<brand>/<line>/<slug>
...

## 手順 (各フレーバー)
1. htreviews: `curl -sL -A "claude-code/1.0" <URL>` でページ取得、python3 でタグ除去してテキスト抽出。一時ファイルは <scratchpad> に <prefix>_ で保存。
2. 抽出: 公式説明、強度 (Крепость 公式/ユーザー評価)、評価分布 (件数と%)、«Покурили бы еще раз» (もう一度吸いたい) Да %、総評価数。ページ内の «htr<数字>» の ID で
   `https://htreviews.org/htmx/load/reviews_object?id=<数字>&object=tobacco&sortBy=created&direction=desc`
   からレビューを取得し15件程度読む。
3. hookah-reviews.com (日本語ブログ、HTTP): `curl -sL -A "claude-code/1.0" "http://hookah-reviews.com/?s=<Brand>+<名前>"` で記事を検索 (タイトルは「<Brand> / <名前>（一言サマリ）」形式)。あれば著者評 (総評点数、再現度、熱管理) とコメント欄の要点を抽出。無ければ「記事なし」。

## 出力 (最終メッセージ、各フレーバー4行で簡潔に。書かれていないことは書かない = 捏造禁止。取得失敗は明記)
## <名前>
- 公式: <公式説明の要約1文>
- 評価: <強度 / 分布要点 / Да % / 総評価数>
- レビュー: <レビュー傾向1-2文 (味の実態、ミックス適性、熱管理)>
- 日本語ブログ: <記事の有無。あれば総評点と要点1文>
```

htreviews の知識 (エージェントが迷ったとき用):

- htmx サイト。レビューは上記 `reviews_object` エンドポイントで取得 (`sortBy=rating` は created と同一内容を返すことがある)。
- ページにはブランド公式アカウントの返信 (温度推奨・ミックス提案) が含まれ、要約の良い材料になる。
- ロシア国内版と輸出版でライン表記が異なることがある (Darkside: 国内 Rare/Base ↔ 日本流通は輸出版 Core)。説明では**ライン名やステータス (生産終了) を断定しない**のが安全 — 日本流通品は輸出版で継続していることがある。

### 4. 書き込みと検証

- `data/flavorDescriptions.ts` の `FLAVOR_DESCRIPTIONS` 末尾にブランドセクションを追加。キーはアルファベット順。同一説明を複数キーで共有する場合はファイル冒頭の定数パターンを踏襲。
- 検証 (対象ブランドの全 id が解決すること):

```bash
npx tsx -e "
import { shishaData } from './data/shishaData.js'
import { getFlavorDescription } from './data/flavorDescriptions'
const b = (shishaData as any[]).filter(f => /<brand正規表現>/i.test(f.manufacturer))
const missing = b.filter(f => !getFlavorDescription(f))
console.log('解決:', b.length - missing.length, '/', b.length)
if (missing.length) console.log('MISSING:', missing.map(f => f.id + ' ' + f.productName).join(', '))
"
```

- 意図的スキップ (情報源なし) 以外の MISSING はキーのタイポを疑う。

### 5. チェックと PR

```bash
pnpm lint && pnpm test && pnpm typecheck
```

- コミットメッセージ: `feat(descriptions): <BRAND> 全N銘柄の説明を追加` + ソースと特記事項。
- PR 本文: 概要 / 対象ライン表 / ソース / 特記事項 (スキップ銘柄と理由、名称対応の検証) / 検証結果。
- **マージはユーザーが GitHub Web UI で行う** (gh pr merge はフックでブロックされる)。

## 複数ブランドの並行実行

`git worktree add ../shisha-flavor-search-<brand> -b feature/<brand>-flavor-descriptions main` で worktree を切れば、収集エージェントの待ち時間中に別ブランドを進められる (Darkside/MustHave 並行の実績)。後発 PR は先発マージ後に `git rebase origin/main` してから push すると衝突しない。終わったら `git worktree remove` で片付ける。

## 落とし穴集 (実績ベース)

- **同名の旧版/2.0 は別商品**: Darkside Mango Lassi (Base) と Mango Lassi 2.0 (Core)、Virgin Peach と 2.0。別エントリ・別ページ。
- **品種名の略記**: DOGMA「K-T BROADLEAF」= htreviews「Коннектикут Бродлиф」(Connecticut Broadleaf)。ページ記載の産地・品種で対応を検証し、PR に検証結果を書く。
- **ラインページの SSR は部分的** (約20件)。「無い」と結論する前にプローブすること。
- **hookah-reviews.com はブランドごと非対応がある** (Bonche は 0 件)。ブランド名単独検索で 0 件なら全銘柄「記事なし」として先へ進む。
- **説明済みブランドの再実行**: 既存キーと重複しないよう、ステップ1の `(既存)` 表示を確認。curatedPicks の id フォールバックだけで `(既存)` に見える銘柄は、名前キーのエントリを別途足す価値がある (サイズ違い id をカバーできる)。
- htreviews の数値 (評価分布・リピート意向) はスナップショット。説明では「htreviewsでは」と出典を明示しているので許容だが、桁まで細かく書きすぎない。
- **htreviews はライン違いでも同一ページを返すことがある**。URL のライン部分だけ変えた 200 応答を「両ラインに別ページがある」証拠にしない。存在しないページはトップ/ランキングへソフトリダイレクトするので、レスポンスサイズやタイトルで判別する。
- **同名フレーバーがライン違いで併存するブランド (Azure の Black/Gold) では、レビュー記事がどちらのラインのものか必ず確認する**。hookah-reviews.com のダビデ氏は「両ラインで被る銘柄は Black だけレビューした」と明言しており、記事タイトルのライン表記が唯一の手がかり。説明文では「Black Line 評は NN 点」と出典ラインを明記すること。
- **代理店 EC の商品ページも、ハンドルやタグでラインを確認する** (`..._azure-black` は Black Line、`..._tsgl` / vendor が「Tokyo Shisha Gold Line」は Gold Line)。片方のラインの文面をもう片方に流用しない。
- **財務省公告名と実売名がずれることがある**: Azure「Mangosteen」は日本では Queen Of Fruits として発売された (代理店ブログに経緯の記載あり)。断定できるのは一次ソースが経緯を書いている場合だけで、名前が似ているだけの同一視はしない。

## 対応済みブランド (再実行不要)

- 2026-08: DOGMA (18) / MustHave (14) / DARKSIDE (73) / BONCHE (24) / SEBERO (78)
- 2026-09: Azure (133 キー / 全 194 id 中 187 解決)。未記載は公開情報が皆無だった Black Berry /
  Cherry Coke / Green Apple / MXN Cola / Whisky / White Chai / White Jasmine Chai の 7 銘柄
- 有望な次候補: 日本流通があり hookah-reviews.com の記事数が多い StarBuzz (89+37+22+13) /
  Tangiers (111) / Trifecta (62) / Fumari (50) / Nu Hookah (41) / Nirvana (45)
