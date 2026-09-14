/**
 * Sentry の共通設定。client / server / edge の各 `Sentry.init` から参照する。
 *
 * DSN はクライアントにも露出する公開値のため直書きで問題ない (GA 計測 ID と同じ扱い)。
 * 別プロジェクトへ向けたいときは `NEXT_PUBLIC_SENTRY_DSN` を build-time にセットする。
 */
export const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  'https://00ef64c83396e046d3521c2f72407cb7@o4512082702827520.ingest.us.sentry.io/4512082707218432'

/**
 * production build (= `pnpm build` / `pnpm preview` / `pnpm deploy`) のときだけ送信する。
 * `next dev` の HMR や再レンダーで発生するノイズを本番プロジェクトに混ぜないため。
 */
export const SENTRY_ENABLED = process.env.NODE_ENV === 'production'

/** パフォーマンストレースのサンプリング率。エラーは常に 100% 送信される。 */
export const SENTRY_TRACES_SAMPLE_RATE = 0.1
