---
name: shisha-update
description: shisha-flavor-search リポジトリで、財務省「製造たばこ小売定価」ページ (https://www.mof.go.jp/policy/tab_salt/topics/kouriteika.html) から新規公告PDFを取得して data/shishaData.js にパイプたばこ (シーシャ) のフレーバーを差分反映する。ユーザーが「シーシャデータを更新」「MOFの新しい公告を取り込む」「小売定価の差分を反映」「shishaData.jsを更新」などと言ったとき、このスキルを必ず使うこと。
---

# shisha-update

このスキルは `data/shishaData.js` を最新化する定型ワークフローを自動化する。MOFは週数回PDFを追加するので、前回処理済みPDFを記録しておいて**新しいPDFだけ**処理するのがポイント。

## 全体フロー

1. **差分検出** — MOFページから現時点のPDF一覧を取り、`.claude/shisha-update-state.json` に記録済みのPDFと照合する
2. **新規PDFをダウンロード** — 差分のPDFのみ `/tmp/shisha-sources/pdfs/` に保存
3. **パイプたばこを抽出** — まずPyMuPDFで試し、文字化けPDFは Claude の Read ツールでサブエージェント並列処理
4. **除外フィルタ** — 伝統的パイプタバコ/シャグ系ブランドを除外 ([references/excluded_brands.md](references/excluded_brands.md))
5. **既存データにマージ** — `(productName, amount)` をキーに dedupe、`kouriteikahenkou` は新価格で上書き
6. **検証 & レポート** — `pnpm lint` と `npx tsc --noEmit` を走らせ、差分レポートを出力
7. **stateファイル更新** — 処理済みPDFリストを `.claude/shisha-update-state.json` に保存

## ステップ詳細

### 1. 差分検出

```bash
python3 .claude/skills/shisha-update/scripts/check_new_pdfs.py
```

このスクリプトは以下を行う:
- MOFページをダウンロード
- PDFリンクを抽出
- `.claude/shisha-update-state.json` の `processed_pdfs` と比較
- 新規PDFのURLとファイル名を `/tmp/shisha-sources/new_pdfs.json` に出力

初回実行でstateファイルが存在しない場合は、現行 `data/shishaData.js` の最終更新状態を既知と見なすのではなく、空から始まる。その場合、ユーザーに「全件処理しますか? (既存データは上書き)」と確認すること。通常の差分更新では、stateファイルが存在する前提で進む。

### 2. ダウンロード

```bash
mkdir -p /tmp/shisha-sources/pdfs
# new_pdfs.json を読んで parallel curl
python3 -c "
import json, subprocess
with open('/tmp/shisha-sources/new_pdfs.json') as f:
    pdfs = json.load(f)
for p in pdfs:
    subprocess.run(['curl', '-sL', '-A', 'claude-code/1.0', p['url'], '-o', f'/tmp/shisha-sources/pdfs/{p[\"filename\"]}'])
"
```

### 3. 抽出

```bash
python3 .claude/skills/shisha-update/scripts/extract_pdfs.py
```

このスクリプトは全新規PDFを PyMuPDF で開き、以下に分類する:
- `readable_pipe`: 「パイプたばこ」が抽出できた → その場でPython正規表現で抽出して `/tmp/shisha-sources/extracted_auto.json` に書く
- `garbled`: 文字化けしている → ファイル名リストを `/tmp/shisha-sources/garbled.json` に書く
- `no_pipe`: パイプたばこ無し → スキップ

文字化けPDFが存在する場合、それらをサブエージェント (`general-purpose`) 並列で処理する。1エージェントあたり10〜15個のPDFを割り当て、ClaudeのReadツールでPDFを直接読ませてJSON抽出させる。サブエージェントに渡すプロンプトのテンプレートは [references/subagent_prompt_template.md](references/subagent_prompt_template.md) を参照。

**重要**: ローカルOCR (Tesseract等) は使わない。ユーザーが明示的に Claude に直接読ませる方針を指定している。また変更認可 (`kouriteikahenkou`) では「変更小売定価」を採用する (現行価格ではない)。

### 4. マージと除外

```bash
python3 .claude/skills/shisha-update/scripts/merge_into_data.py
```

このスクリプトは:
- `data/shishaData.js` を読み込む
- `/tmp/shisha-sources/extracted_auto.json` と `extracted_group_*.json` (サブエージェント出力) を統合
- [references/excluded_brands.md](references/excluded_brands.md) のリストで除外判定
- NFKC正規化して `(productName, amount)` で既存データと突合、新規は追加、既存に対しては PDF 日付が新しい場合のみ価格を更新
- **変更認可 (`kouriteikahenkou`) 由来は必ず update になるはず** (既存製品の価格変更だから)。add に化けた場合は突合キー `(productName, amount)` の表記ゆれを疑う。スクリプトは henkou 由来が add された場合に `⚠️ WARNING` を出すので、出たら既存データを確認し、抽出側の amount を既存表記に合わせてマージし直す
- 新 `data/shishaData.js` を書き出し (idは連番で振り直し)
- 差分レポート (追加N件、更新M件、除外K件) を標準出力に

### 5. 検証

```bash
pnpm lint && npx tsc --noEmit
```

エラーが出たら絶対に止める。データ不整合 (例: 未エスケープの引用符) の可能性が高い。

### 6. state更新

`merge_into_data.py` は処理成功時に `.claude/shisha-update-state.json` を更新する:

```json
{
  "last_run": "2026-04-23T12:34:56",
  "processed_pdfs": ["20260415_kouriteika.pdf", ...]
}
```

## 対話の流れ (ユーザーとのやり取り)

スキル実行中、以下を都度ユーザーに報告すること:
- ステップ1完了時: 「MOFに新規PDF X 件あり。処理に進みますか?」 (新規0件ならここで終了)
- ステップ4完了時: 差分レポートを提示し、除外ブランドに想定外のものが含まれていたら確認
- ステップ5失敗時: エラー詳細を出して手動修正を促す

## 落とし穴

- **PDFのファイル名重複**: 同じ日付で `_1`, `_2` の派生がある。URLのフル文字列でdedupeすること。
- **相対パス**: MOFページのリンクは `./xxx.pdf` と `../xxx.pdf` が混在。`check_new_pdfs.py` で正規化済み。
- **User-Agent**: 財務省サーバーは一部UAを拒否する。`claude-code/1.0` を使う。
- **文字コード**: MOFページはUTF-8 BOM。suitadou (使わない) はShift_JIS。
- **「パイプたばこ」区分の混在**: MOFの「パイプたばこ」にはシーシャ以外 (伝統的パイプタバコ・シャグ) も含まれる。除外リストを必ず適用する。
- **変更認可 = update**: ファイル名に `kouriteikahenkou` を含むPDFは既存製品の価格変更。突合キーは `(productName, amount)` で、amount 表記が既存とズレる (例: PDFの「箱」 vs 既存の「プラスチックケース」) と突合失敗して**重複追加**される。henkou が add になったら必ず既存データを確認し、抽出側の amount を既存に合わせること。`merge_into_data.py` が警告を出す。
- **サブエージェントのパイプたばこ見落とし**: 1ページに葉巻・加熱式とパイプたばこが混在する変更認可PDFで、サブエージェントがパイプたばこ行を見落とすことがある。henkou PDFは特に、抽出0件報告でも疑わしければ自分でも Read して確認する。
