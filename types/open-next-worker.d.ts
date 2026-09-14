/**
 * `open-next-worker` は wrangler.jsonc の `alias` で `.open-next/worker.js` (opennextjs-cloudflare build の
 * 生成物、gitignore) に解決される仮想モジュール。生成物の有無に関わらず `worker.ts` を型チェック
 * できるよう、ここで公開面を宣言する。
 */
declare module 'open-next-worker' {
  import type { ExportedHandler } from '@cloudflare/workers-types'

  const handler: ExportedHandler
  export default handler

  // OpenNext が定義する Durable Object クラス (queue / sharded tag cache / bucket purge)。
  // このプロジェクトでは binding していないため型は緩いままにしている。
  export const DOQueueHandler: unknown
  export const DOShardedTagCache: unknown
  export const BucketCachePurge: unknown
}
