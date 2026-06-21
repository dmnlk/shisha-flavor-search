# Editor's Selection 週次更新ルーチン

トップページ § 005「Editor's Selection」(`data/curatedPicks.ts` の `EDITORS_PICKS`) を
**毎週月曜 09:00 (JST)** にリフレッシュするクラウドルーチン。Claude エージェントが
画像付きフレーバーから10件を再選定し、日本語短評を付け、PR を作成する（人が merge）。

## 構成

- **候補プール**: `pnpm picks:candidates` (`scripts/list-imaged-flavors.ts`)
  - `public/images/flavors/<id>.<ext>` を直接走査し、画像付きフレーバーのみを出力。
  - これに載っている id だけが選定対象 = 「画像があるフレーバーのみ」を機械的に保証。
  - `--summary` でブランド分布、`--json` で JSON、`--local` でローカル画像限定。
- **更新対象**: `data/curatedPicks.ts` の `EDITORS_PICKS` 配列のみ。
- **実行基盤**: `/schedule` で作成したクラウドルーチン（cron: 毎週月曜 09:00 JST）。

## ルーチンが実行するプロンプト

> shisha-flavor-search リポジトリのトップページ「Editor's Selection」
> (`data/curatedPicks.ts` の `EDITORS_PICKS`) を週次でリフレッシュする。
>
> 1. `main` を最新化し、新しいブランチ `chore/editors-picks-<YYYYMMDD>` を切る。
> 2. `pnpm install` 後、`pnpm picks:candidates --summary` でブランド分布を、
>    `pnpm picks:candidates` で候補プール（画像付きフレーバー）を取得する。
>    **このプールに存在する id だけを選ぶ。画像が無いフレーバーは絶対に選ばない。**
> 3. 候補から魅力的な10件を選定する。制約:
>    - 同一ブランドは最大2件まで（ブランド多様性）
>    - 原産国・フレーバー系統（フルーツ / ミント / デザート / タバコ感 等）を散らす
>    - 前週 (`git log -p data/curatedPicks.ts` で確認) と全く同じ並びにしない
> 4. 各 id に1行の日本語短評 `note`（〜40字程度、既存のトーンに合わせ、事実ベースで誇張しない）を付ける。
> 5. `EDITORS_PICKS` 配列を新しい10件で置き換える。id は shishaData と一致させる。
> 6. `pnpm lint && pnpm typecheck && pnpm test` を全て通す。
> 7. commit して PR を作成。PR 本文に選定10件（id / ブランド / 製品名 / 短評）の表を載せる。
>    **`main` へ直接 push しない。** 失敗時はエラーを報告して終了する。

## メンテ

- プロンプトを変えたいときは `/schedule` でこのルーチンを更新する。
- 候補の絞り込みロジックを変えたいときは `scripts/list-imaged-flavors.ts` を編集する。
