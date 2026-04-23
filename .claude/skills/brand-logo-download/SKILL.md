---
name: brand-logo-download
description: shisha-flavor-search リポジトリで /brands ページ用のブランドロゴ画像を公開ソース (Wikipedia / 公式サイト等) から収集し、命名規約に従って public/images/brands/<slug>.(png|svg|webp) にローカル保存する。ユーザーが「ブランドロゴを集めて」「brand-logo-download」「シーシャブランドのロゴをダウンロード」「ブランド画像を取得」「missing brand logo を落としてきて」「ブランドの画像を追加」などと言ったときに使うこと。
---

# brand-logo-download

data/brandImages.ts の `brandSlug()` で生成されるスラグに一致するファイル名で、
public/images/brands/ 以下にロゴ画像を配置するためのスキル。配置すれば /brands
ページで自動的にカード画像として表示される (ない場合はタイポグラフィックの
フォールバックが使われる)。

## 前提

- このスキルは Claude Code をリポジトリルートから起動した状態で実行する
- 外部ホスト (Wikipedia, 公式サイト等) への HTTP が通るネットワーク環境であること
- `pnpm install` 済み (tsx が使える状態) であること
- 画像は個人利用目的。商用配布はしない前提で、ロゴの出所は Wikipedia/Wikimedia
  Commons を最優先 (CC/PD が明示されていることが多いため)、次点で各ブランド
  公式サイトの header / press kit の画像、最後に一般画像検索結果

## 全体フロー

1. **未取得ブランドのリストアップ** — `scripts/list_missing_brands.ts` で
   data/shishaData.js から全ブランドを抽出し、public/images/brands/ に
   未配置のものを人気 (フレーバー件数) 順でソートして `/tmp/shisha-brand-logos/missing.json` に出力
2. **対象を絞る** — 引数がなければ missing 全件、「top 20」「top N」指定が
   あればその件数だけ、「<brand>」指定があれば単一ブランドだけ
3. **並列ダウンロード** — 対象ブランドを 10〜15 件ごとにバッチに分け、
   general-purpose サブエージェントで並列に [WebSearch → 画像URL 特定 → curl
   でダウンロード → ファイル検証 → 配置] を実行。サブエージェントへのプロンプト
   雛形は [references/subagent_prompt_template.md](references/subagent_prompt_template.md)
4. **検証** — `scripts/verify_images.ts` で全ファイルを magic bytes で
   画像形式を検出、0 バイトや HTML 誤取得を弾く
5. **再実行で足りないものを埋める** — サブエージェントが失敗したブランドは
   missing.json に残るので、プロンプトを変えて再実行 (例: 正式社名で検索)
6. **レポート** — 追加できた件数、残った件数、スキップしたブランド一覧を
   ユーザーに提示

## ステップ詳細

### 1. 未取得ブランドの抽出

```bash
npx tsx .claude/skills/brand-logo-download/scripts/list_missing_brands.ts
```

出力例 (stderr):

```
Total brands: 92
With logo:    0
Missing:      92
Missing list written to: /tmp/shisha-brand-logos/missing.json
  [380] Doobacco  →  doobacco
  [251] Al Fakher  →  al-fakher
  ...
```

`/tmp/shisha-brand-logos/missing.json` の構造:

```json
{
  "all": [{ "name": "Al Fakher", "slug": "al-fakher", "count": 251, "has": false }, ...],
  "missing": [ ... ]
}
```

### 2. 対象を絞る

ユーザーが明示していない場合は missing 全件を対象にする。ただし件数が多いので、
初回実行時はまず上位 30 件程度から試すことを推奨する (失敗時の修正コストが低い)。

```python
import json
with open('/tmp/shisha-brand-logos/missing.json') as f:
    data = json.load(f)
targets = data['missing'][:30]  # 上位 30 件
```

### 3. 並列サブエージェント

対象を 10〜15 件ずつのバッチに分け、バッチ数ぶんのサブエージェントを **単一の
メッセージで並列起動** する。各サブエージェントには以下を渡す:

- 担当ブランド名と対応スラグのペア一覧
- 出力ディレクトリ (`public/images/brands/`)
- 検索方針 (Wikipedia → 公式 → 一般画像)
- curl コマンドのテンプレ (UA 指定必須)
- 成功/失敗の報告フォーマット

プロンプト本文は [references/subagent_prompt_template.md](references/subagent_prompt_template.md) を
そのまま使い、`{{BRANDS}}` プレースホルダーを JSON で置換する。

**並列数の目安**: missing が 90 件なら 6〜9 並列 (1 エージェント 10〜15 件)。
これ以上増やすと WebSearch のレート制限に当たる可能性がある。

### 4. 検証

全サブエージェント完了後:

```bash
npx tsx .claude/skills/brand-logo-download/scripts/verify_images.ts
```

このスクリプトは public/images/brands/ の全ファイルを走査し、以下をチェック:

- ファイルサイズが 500 バイト以上
- magic bytes が PNG / JPEG / GIF / WebP / SVG のいずれか
- 拡張子と実際の形式が一致しているか

不正なファイル (HTML 誤取得、サイズ 0、形式不一致) はパスを stderr に出して
削除候補として提示する。ユーザー確認のうえ削除する。

### 5. 再挑戦

`list_missing_brands.ts` をもう一度実行して、残ったブランドを再度サブエージェントに
渡す。このとき検索クエリを変えると成功率が上がる:

- 正式社名で検索 (例: "Layalina Premium Tobacco")
- ブランドの原語表記で検索 (例: "Северный" → Cyrillic のまま)
- ロシア系ブランド (Darkside, Sebero, Bang Bang 等) は ВКонтакте や ozon.ru に
  ロゴがあることが多い

### 6. 最終レポート

ユーザーに以下を提示:

- 追加できたブランド件数と合計ファイルサイズ
- 残った (= 検索で見つからなかった) ブランド一覧
- 目視確認推奨の画像 (例: 2KB 未満の極端に小さいもの)

ユーザーがコミットするかどうかを判断できるよう、`git status` で差分も表示する。

## 命名規則 (重要)

ファイル名 (拡張子を除く部分) は `data/brandImages.ts` の `brandSlug()` が返す
スラグと **完全一致** しなければならない。このスキルのスクリプトはその値を自動で
計算するので、サブエージェントは `missing.json` 内の `slug` 値をそのまま使うこと。

対応関係の例:

| ブランド名               | スラグ / ファイル名       |
| ----------------------- | ------------------------ |
| Al Fakher               | `al-fakher.png`          |
| Starbuzz                | `starbuzz.png`           |
| Coco Nara               | `coco-nara.png`          |
| Khalil Maamoon Tobacco  | `khalil-maamoon-tobacco.png` |
| Северный                | `северный.png`           |

サポート拡張子: `.png` `.jpg` `.jpeg` `.webp` `.svg` `.avif`。可能なら
PNG (透過あり) か SVG を優先。

## 落とし穴

- **HTML の誤取得**: curl が HTML ページを取得したのに `.png` として保存する
  事故が多い。`file --mime-type` か magic bytes で検証必須。`verify_images.ts` が
  この検証をやる。
- **User-Agent**: 一部サイトは curl の素の UA を 403 で弾く。サブエージェントの
  プロンプトで `-A "Mozilla/5.0 (compatible; shisha-flavor-search-logo-bot/1.0)"`
  を必ず付ける指示にしている。
- **リダイレクト**: Wikipedia のサムネイル URL はリダイレクト多段なので `curl -L` 必須。
- **ドメイン制限**: 一部の環境 (特にクラウド sandbox) では外部ホストがブロックされる。
  このスキルは **ローカル環境で実行する前提**。`host_not_allowed` 等のエラーが出たら
  環境側の制限を疑う。
- **大きすぎる画像**: 2MB 超のロゴは最適化候補。next/image が最適化するので必須では
  ないが、リポジトリサイズ抑制のため 1024px 未満に収めるのが望ましい。
- **Cyrillic/非ASCII ファイル名**: ファイルシステムとブラウザ両方で通るが、URL 参照
  時に %-encoding される。問題ない。気になる場合はそのブランドだけ手動で ASCII 名に
  リネームし、`data/brandImages.ts` の正規化ルールに合う範囲で調整する。
- **冪等性**: public/images/brands/ に既に配置されているブランドは `missing.json` に
  含まれないので、同じブランドを二重に上書きする事故は発生しない。再配置したい場合は
  先に既存ファイルを削除する。

## 対話の流れ

スキル実行中にユーザーへ報告する:

- ステップ1 完了時: 「未取得ブランド X 件。top N だけ試しますか? 全件いきますか?」
- ステップ3 着手時: 「Y 個のサブエージェントに分けて並列ダウンロード開始」
- ステップ4 完了時: 追加成功 N 件 / 失敗 M 件、失敗一覧を提示
- ステップ6 終了時: `git status` を添えて、コミットの要否を確認
