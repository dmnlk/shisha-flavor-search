# Subagent prompt template

Pass this to `general-purpose` subagents via the Agent tool. Replace
`{{BRANDS}}` with a JSON array of `{ name, slug }` entries for the batch
(10〜15 件が目安)。

---

あなたはシーシャブランドのロゴ画像を収集する担当です。以下のブランド一覧それぞれに
ついて、公開情報から公式/代表的なロゴ画像を 1 つ見つけて
`public/images/brands/<slug>.<ext>` に保存してください。

## 担当ブランド

```json
{{BRANDS}}
```

`slug` はファイル名の stem として **そのまま使ってください**。変更厳禁 (ハイフン、
小文字、非 ASCII 文字を含む場合がある)。

## 手順 (各ブランドごとに実行)

1. **WebSearch** で以下のクエリを試す (順に):
   - `"<brand name>" shisha logo site:wikipedia.org`
   - `"<brand name>" shisha brand logo`
   - `"<brand name>" hookah tobacco logo png`
   - ロシア系ブランドで英語で当たらない場合は原語表記を試す
     (例: `Sebero` → `Себеро`)

2. **画像 URL を選ぶ**。優先順位:
   a. Wikipedia/Wikimedia Commons 上の PNG/SVG (CC/PD のことが多い)
   b. ブランド公式サイトの header ロゴ / press kit
   c. オンラインショップ (hookah-shisha.com, hookahcompany.com 等) のブランドバナー
   d. 大手メディア/まとめサイトの画像

   避けるもの:
   - ソーシャル (Instagram/Facebook) の JPG サムネイル (低解像度・圧縮アーティファクト大)
   - Pinterest の再投稿画像 (出所不明)
   - AI 生成っぽい画像 / 非公式二次創作

3. **ダウンロード**。以下のテンプレを使う (拡張子は画像に合わせる):

   ```bash
   curl -sL --fail --max-time 20 \
     -A "Mozilla/5.0 (compatible; shisha-flavor-search-logo-bot/1.0)" \
     -o "public/images/brands/<slug>.png" \
     "<IMAGE_URL>"
   ```

   ポイント:
   - `-L` でリダイレクト追従 (Wikipedia のサムネイル URL は多段リダイレクト)
   - `-A` でブラウザっぽい UA (curl の素の UA を拒否するサイトがある)
   - `--fail` で HTTP エラー時に 0 バイトファイルを残さない
   - `--max-time 20` でハング回避

4. **検証**。`file --mime-type public/images/brands/<slug>.<ext>` で実際の MIME を
   確認。`image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` のいずれかであれば OK。
   `text/html` になっていたらエラーページを掴んでいるので、削除して別 URL を試す。

5. **サイズチェック**。
   - `ls -l public/images/brands/<slug>.<ext>` で 500 バイト以上あることを確認
   - 5 MB 超の場合は別のより小さい画像を探す (リポジトリサイズ抑制のため)

## 拡張子の扱い

- 元 URL が `.svg` なら `<slug>.svg` で保存 (SVG が最優先)
- 透過 PNG があれば `<slug>.png` を最推奨
- WebP しか無い場合は `<slug>.webp` で可
- JPEG は最後の手段 (背景が白 or ブランドカラーのフラット画像が確実な場合のみ)

## 出力

全ブランド処理後、以下の形式で結果を報告してください:

```
成功:
- Al Fakher: al-fakher.png (15 KB, Wikipedia)
- Starbuzz: starbuzz.svg (3 KB, 公式サイト)

スキップ / 失敗:
- Cleopatra: 検索結果に適切な画像なし (同名の無関係ブランドが多数ヒット)
- 北朝鮮ブランド: 公式サイトが到達不能
```

## やらないこと

- 実在しないブランドのロゴを捏造する (AI 生成で埋めるのは禁止)
- 解像度を水増しする目的で拡大処理をする (元解像度のまま保存)
- 明確に企業から画像削除を求められている場合にその画像を保存する
- `data/brandImages.ts` や `public/images/brands/README.md` を編集する (スキーマに影響するため触らない)
