# サブエージェント用プロンプト

文字化けPDFをClaudeに直接Readさせて「パイプたばこ」行を抽出するためのプロンプトテンプレート。

`general-purpose` サブエージェントを並列起動し、1エージェントあたり10〜15個のPDFを担当させる。`run_in_background: true` で起動し、完了通知を待ってから次に進む。

PDFを 9 グループに分割する例:

```python
import json
with open('/tmp/shisha-sources/garbled.json') as f:
    garbled = sorted(json.load(f))
n = 9  # or adjust by count
chunks = [garbled[i::n] for i in range(n)]
for i, c in enumerate(chunks):
    with open(f'/tmp/shisha-sources/garbled_group_{i}.json', 'w') as f:
        json.dump(c, f)
```

## プロンプト本文

各サブエージェントに以下のプロンプトを渡す (`{N}` は 0..8 のグループ番号、`{FILES}` は担当するPDFファイル名のJSON配列):

```
日本の財務省が公開している「製造たばこ小売定価」のPDFから「パイプたばこ」に分類されている製品だけを抽出するタスクです。

## 対象PDF
以下のPDFを処理します。ファイルは既に`/tmp/shisha-sources/pdfs/`にダウンロード済みです：

{FILES}

## 処理手順
1. 各PDFを Read ツールで開く (絶対パス `/tmp/shisha-sources/pdfs/<filename>`)
2. PDFの左端の「製造たばこの区分」列が「パイプたばこ」になっている行だけを抽出する（紙巻たばこ、葉巻たばこ、刻みたばこ、かぎたばこ、加熱式たばこ等は除外）
3. 各行から以下を取得：
   - `product`: 名称（銘柄名、PDFに書かれているまま。改行は半角スペースに正規化）
   - `amount`: 量+製品区分（例: "50.0g箱"、"250.0gパウチ"。複数行にまたがる場合は連結）
   - `country`: 製造国
   - `price`: 小売定価（例: "1,800円"）
4. ファイル名から `date`(先頭8桁 YYYYMMDD)と `is_henkou`(ファイル名に`kouriteikahenkou`を含むか)も記録
5. `source`: 元のPDFファイル名を記録

## 出力
抽出した全行をJSONとして `/tmp/shisha-sources/extracted_group_{N}.json` にWriteツールで書き出してください。

## 注意
- パイプたばこが全く含まれていないPDFもあります。その場合は該当PDFの行は0件でOK。
- Read tool で PDF を直接開けば、Claudeが内容を画像/テキストとして読み取れます。OCRツールは使わないでください。
- 変更認可 (ファイル名に kouriteikahenkou) では「変更小売定価」(新価格) を採用してください。
- 全PDFを処理し終えたら、件数を簡潔に報告してください。
```

## 完了後

全サブエージェントの完了通知を受けたら、`extracted_group_*.json` が全部揃っているか確認する:

```bash
ls /tmp/shisha-sources/extracted_group_*.json
```

揃ったら `merge_into_data.py` がこれらを自動で拾う。
