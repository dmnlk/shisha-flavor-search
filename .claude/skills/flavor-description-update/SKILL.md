---
name: flavor-description-update
description: shisha-flavor-search リポジトリで、指定ブランドのフレーバー説明 (詳細ページ「Tasting note」用の日本語テキスト) を htreviews.org と hookah-reviews.com のレビューから収集・要約して data/flavorDescriptions.ts に追加する。ユーザーが「<ブランド>の説明を作って/集めて」「フレーバーの description を追加」「Tasting note を増やして」「flavor-description-update」と言ったときに必ずこのスキルを使うこと。
---

# flavor-description-update

指定ブランドの全フレーバーについて、レビューサイトから公式説明+レビュー/コメント欄の傾向を収集し、日本語 2〜3 文の説明として `data/flavorDescriptions.ts` の `FLAVOR_DESCRIPTIONS` に追加するスキル。追加すれば詳細ページの「Tasting note」セクション・meta description・Product JSON-LD に自動反映される (SEO 上は thin content 対策として本文テキストが最重要)。

DOGMA (18) / MustHave (14) / DARKSIDE (73) / BONCHE (24) の 4 ランで確立した手順 (2026-08)。

## 情報ソース

| ソース | 内容 | 備考 |
|---|---|---|
| **htreviews.org** (露語) | 公式説明・評価分布・リピート意向・レビュー+ブランド公式返信 | 主ソース。ロシア系ブランドはほぼ網羅 |
| **hookah-reviews.com** (日本語ブログ byダビデ) | 著者レビュー (総評点 100 点満点)・コメント欄 | 副ソース。扱いはブランド次第 (Bonche は 0 件だった)。HTTP サイト |

他ソースを使う場合も方針は同じ: 出典が特定できる公知情報のみ。

## 絶対原則

1. **捏造禁止**: 情報源が見つからないフレーバーは**書かずにスキップ**し、その旨を報告する (例: 情報なし時の Bonche Happy New Year)。ユーザーが URL を提供したら追記する。
2. **ノンアロマ表記**: 香料なしタバコは「無香料」ではなく**「ノンアロマ」**と書く (日本の通称)。
3. **賛否は正直に**: 酷評が優勢な銘柄はそのまま書く (例: 「低評価が優勢な癖の強い銘柄 (リピート意向13%)」)。宣伝コピーにしない。
4. **main 直コミット禁止**: 作業前に `feature/<brand>-flavor-descriptions` ブランチを切る。
5. **既存エントリの重複キー禁止**: 追加前に対象ブランドのキーが既に無いか確認。既存エントリを充実させる場合は置き換える。

## 説明文のスタイル

- 2〜3 文、100〜160 字程度。構成: **1文目 = 味プロファイル (公式説明ベース)** → **2文目以降 = レビュー傾向** (htreviews の合意、定量情報、ミックス適性、熱管理の注意など)。
- 定量情報は効果的なものだけ添える: `(リピート意向98%)` `(評価197件・5点56%)` など。
- hookah-reviews.com に記事があれば `hookah-reviews.comでは77点で「…」` の形で総評点+要点を 1 節。
- 別商品の 2.0 / リニューアル版は別エントリで区別する。
- ブランドごとにセクションコメントを付ける: `// <BRAND> — htreviews.org と hookah-reviews.com のレビューを要約 (YYYY-MM 時点)`。特記事項 (ライン対応関係など) もここに書く。

## フロー

```
1. ブランチ作成 → 対象ブランドのフレーバーとキーを列挙
2. htreviews recon: ブランド/ラインページから slug 収集 → 不足分をプローブ
3. 並列サブエージェント (general-purpose, 1体あたり5〜9銘柄) でレビュー収集
4. FLAVOR_DESCRIPTIONS へ書き込み → 全 id 解決を検証
5. pnpm lint / test / typecheck → コミット → push → PR (マージは人間が Web UI で)
```

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

### 2. htreviews.org の recon

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

### 3. 並列サブエージェントで収集

- **general-purpose** エージェントに 1 体あたり **5〜9 銘柄** を割り当てる (73 銘柄 = 8 体が実績)。同一メッセージで一斉起動。
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

## hookah-reviews.com が主ソースのブランドを一括で処理する (2026-09 の実績)

アメリカ系ブランドをまとめて処理する場合、**記事本文を先に全部ローカルへ落としてから
エージェントに配る**のが圧倒的に速い (StarBuzz〜LaVoo の 6 ブランド 443 キーを 1 セッションで処理)。

1. **カテゴリ一覧をトップページから取る**: `curl -sL "http://hookah-reviews.com/"` の
   サイドバーに `href=".../category/flavour-review/<slug>/">ブランド名 (件数)` が並んでいる。
   ここに載っていないブランドは記事がほぼ無いと考えてよい (Nirvana の旧ラインなど)。
2. **各カテゴリを `page/N/` でページングして記事 URL とタイトルを収集** → 重複 URL を除去。
   ACID ラインのようにカテゴリが無いものは `?s=<Brand>+<Line>` の検索で拾う。
3. **記事本文を並列 GET してローカルにキャッシュ**。本文は
   `<div class="content">` 〜 `<div class="sharedaddy` の間。タグを除去して
   `<scratchpad>/hr_bodies/<記事ID>.txt` に保存する (1 記事 4KB 程度)。
4. **銘柄 → 記事のマッピングを作り、記事単位でグループ化する**。財務省公告は同一商品を
   複数の名前で登録していることが多い (Al Fakher の「Shisha Molasses <名前>」、
   Trifecta の「Tobacco <名前>」など)。**記事 1 本につきエージェント 1 エントリだけ書かせ、
   同じ記事を指す全キーへ同じ説明をコピーする**とトークンが 1/2 以下になる。
5. **エージェントにはローカルファイルだけ読ませる** (ネットワーク不要と明記)。
   ブリーフに記事本文を丸ごと埋め込み、1 体あたり 12〜15 銘柄。

### この一括ランで分かったこと

- 記事タイトルは `<Brand> <Line> / <Flavor>（一言サマリ）` 形式。`（` の手前で切り、
  `/` の左側でラインを判定する。**ラインが公告名と食い違う場合は説明文で出典ラインを明記**
  させること (例: 公告 = Tangiers Burley、記事 = Tangiers Noir)。
- 記事本文の見出しタグが壊れていて「（総評）NN点」が 2 つ出るページがある
  (StarBuzz Cantaloupe は 78 点と 35 点が混在)。**どちらが総評か確定できないときは
  点数を書かない**。
- 財務省公告の表記ゆれは相当多い。実績のある対応: Blue Sufer = Blue Surfer /
  Grapefruits = Grapefruit / Marlett = Marlette / Vintage Timisue = Vintage Tiramisu /
  Water melon = Watermelon / Cardamom = Cardamon / Bonafide = Bona Fide /
  Apple509 = Apple 509 / Twice the IceX = Twice the Ice X / Tutti Fruitti = Tutti Frutti。
- **似ているだけの名前は同一視しない**。見送った例: StarBuzz Bold Apple Mist と
  記事の Misty Apple、Fumari の RGB / WGB と Red Gummy Bear / White Gummi Bear、
  Al Fakher の Fresh と Fresh Mist、Tangiers の Noir Lime と New Lime。
- 公告名にライン表記が無く、同名の `Bold <名前>` が別途登録されている銘柄は
  Original / Bold のどちらか確定できない。**確定できないものは未記載にする**
  (StarBuzz Mint Colossus / Peach Queen / Queen of Sex)。

## 落とし穴集 (実績ベース)

- **同名の旧版/2.0 は別商品**: Darkside Mango Lassi (Base) と Mango Lassi 2.0 (Core)、Virgin Peach と 2.0。別エントリ・別ページ。
- **品種名の略記**: DOGMA「K-T BROADLEAF」= htreviews「Коннектикут Бродлиф」(Connecticut Broadleaf)。ページ記載の産地・品種で対応を検証し、PR に検証結果を書く。
- **ラインページの SSR は部分的** (約20件)。「無い」と結論する前にプローブすること。
- **hookah-reviews.com はブランドごと非対応がある** (Bonche は 0 件)。ブランド名単独検索で 0 件なら全銘柄「記事なし」として先へ進む。
- **説明済みブランドの再実行**: 既存キーと重複しないよう、ステップ1の `(既存)` 表示を確認。
- htreviews の数値 (評価分布・リピート意向) はスナップショット。説明では「htreviewsでは」と出典を明示しているので許容だが、桁まで細かく書きすぎない。

## 対応済みブランド (再実行不要)

- 2026-08: DOGMA (18) / MustHave (14) / DARKSIDE (73) / BONCHE (24) / SEBERO (78)
- 2026-09: Azure (133 キー / 全 194 id 中 187 解決)。未記載は公開情報が皆無だった Black Berry /
  Cherry Coke / Green Apple / MXN Cola / Whisky / White Chai / White Jasmine Chai の 7 銘柄
- 2026-09: hookah-reviews.com 一括ランで以下を追加 (いずれも htreviews は使わず日本語ブログのみ)
  - StarBuzz 145 キー (164 id 中 156 解決)。Original / Bold / Vintage / ACID
  - Tangiers 58 キー (81 id 中 64 解決)。記事はほぼ全て Noir ライン
  - Al Fakher 129 キー (251 id 中 233 解決)。通常 / Golden / Special Edition ほか
  - Trifecta 99 キー (139 id 中 130 解決)。Blonde / Dark
  - Fumari 56 キー (152 id 中 127 解決)。近年発売銘柄は記事が無く未記載
  - LaVoo 8 キー (8 id 全解決)
- **記事が無く見送ったブランド**: Nirvana (公告は旧 Super Shisha ライン、ブログは
  Eclipse / Othmani で銘柄が全く重ならない) / Malaki (12 キー中 2 件しか記事が無い) /
  Dozaj (119 キーに対し Dozaj Black の記事 4 本のみ)
- 有望な次候補: hookah-reviews.com のカテゴリに載っていないブランドが残っているため、
  次は日本の代理店 EC (tokyoshisha.com 等) を主ソースにできるブランドを探すこと
