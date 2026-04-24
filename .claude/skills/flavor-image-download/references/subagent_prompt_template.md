# Subagent prompt template — flavor image download

Pass this to `general-purpose` subagents via the Agent tool. Replace
`{{FLAVORS}}` with a JSON array of `{ id, productName, manufacturer, brandSlug }`
entries for the batch (12〜15 件が目安)。

---

あなたはシーシャフレーバーの商品画像 (缶・パウチ・箱の実物写真) を収集する担当です。以下のフレーバー一覧それぞれについて、**信頼できる公開ソース**から 1 枚ずつ探し、`public/images/flavors/<id>.<ext>` に保存してください。

## 担当フレーバー

```json
{{FLAVORS}}
```

`id` はファイル名の stem として **そのまま使ってください**。対応拡張子は `.png` `.jpg` `.jpeg` `.webp` `.avif`。**SVG は不可** (商品写真なので)。

## 手順 (各フレーバーごとに実行)

1. **WebSearch** を使って以下の順にクエリを試す:
   - `"<productName>" <manufacturer> shisha`
   - `"<productName>" site:htreviews.org`
   - `"<productName>" site:smokedex.info`
   - `"<productName>" site:shisha-mart.com`
   - `"<productName>" site:shisha-oroshi.myshopify.com`
   - `"<productName>" site:newemoshisha.com`
   - `"<productName>" site:rakuten.co.jp`
   - 日本語フレーバー名が含まれていれば日本語でもそのまま検索
   - ブランド公式サイト (例: `al-fakher.com`, `starbuzztobacco.com`) を `site:` で当てる

2. **採用候補の画像 URL を選ぶ**。優先順:
   1. **htreviews.org** (レビュー写真、正確な商品紐付け)
   2. **shisha-mart.com** (日本の正規物販、画像品質高)
   3. **shisha-oroshi.myshopify.com** (`cdn.shopify.com` の直 URL が取れたらそちら)
   4. **newemoshisha.com** (公式パッケージ多数)
   5. **smokedex.info** (網羅性高いが、汎用プレースホルダーに注意)
   6. 楽天市場・Yahoo! ショッピングの商品画像
   7. ブランド公式サイト
   8. hookah.com / hookah-shisha.com / texashookah.com (米国物販)

3. **品質チェック (却下基準)** — 迷ったらスキップ。ユーザーは「怪しいのは要らない」と明言しています。
   - ❌ SmokeDex の汎用プレースホルダー (缶のシルエットだけ / 画像なしアイコン)
   - ❌ 人物が主体 / ラウンジ内観 / 使用中シーン
   - ❌ 別商品 / 別フレーバー / パッケージが明らかに違う
   - ❌ 商品名が読めないほど小さい
   - ❌ 解像度 300×300 px 未満
   - ❌ ファイルサイズ 2 KB 未満
   - ❌ AI 生成疑いの過度にきれい / 非現実的な照明
   - ❌ Instagram / TikTok / Pinterest のリポスト (出所不明)
   - ❌ ウォーターマーク入り
   - ✅ パッケージが正面から大きく写っている、ブランドロゴとフレーバー名が読める
   - ✅ 400×400 px 以上、10 KB 以上

4. **ダウンロード**:
   ```bash
   curl -sL --fail --max-time 20 \
     -A "Mozilla/5.0 (compatible; shisha-flavor-search-bot/1.0)" \
     -o "public/images/flavors/<id>.<ext>" \
     "<IMAGE_URL>"
   ```
   - `-L` でリダイレクト追従 (必須: Rakuten / Shopify 系は多段)
   - `-A` でブラウザ UA (素の curl を弾くサイトあり)
   - `--fail` で HTTP エラー時に 0 バイトを残さない
   - 403 が返ったら `-A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"` で再試行

5. **検証**:
   ```bash
   file --mime-type public/images/flavors/<id>.<ext>
   ls -l public/images/flavors/<id>.<ext>
   ```
   - mime-type が `image/png` / `image/jpeg` / `image/webp` / `image/avif` のいずれか
   - `text/html` なら **即座に `rm` して別ソースを試す**
   - サイズ 2 KB 未満なら rm してスキップ扱い

6. **サイズ肥大の防止** — 2 MB 超のときは `magick` で縮小:
   ```bash
   magick public/images/flavors/<id>.<ext> -resize '1024x1024>' -quality 85 public/images/flavors/<id>.<ext>
   ```

## 拡張子の扱い

- 元 URL が `.jpg/.jpeg` なら `.jpg` で保存
- 透過が必要な場合のみ `.png`
- WebP は `.webp`、AVIF は `.avif` のまま保存可

## やらないこと

- 実在しないフレーバーの画像を捏造する (AI 生成で埋めるのは禁止)
- 解像度を水増しする目的での拡大 (元解像度のまま保存)
- `data/shishaData.js` や `data/flavorImages.ts` の編集 (スキーマに影響するため触らない)
- ファイル名を変える (`<id>.<ext>` から逸脱しない)

## 出力

全フレーバー処理後、以下の形式で結果を報告してください:

```
成功:
- id 421 (Starbuzz / Blue Mist): 421.jpg (42 KB, shisha-mart)
- id 8213 (Al Fakher / Two Apples): 8213.webp (38 KB, htreviews)

スキップ / 失敗:
- id 9121 (Cleopatra / Grape): 適切な画像なし (SmokeDex にプレースホルダーのみ)
- id 4001 (Doobacco / Apricot): 検索ヒット 0 件
```

スキップは失敗ではなく **正しい判断** です (怪しい画像を保存するより欠けている方がマシ)。
