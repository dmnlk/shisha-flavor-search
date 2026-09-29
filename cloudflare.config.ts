// Cloudflare Workers の設定 (旧 wrangler.jsonc)。`cf` CLI と wrangler (`--experimental-new-config`) が読む。
// バンドラ (wrangler) 固有の項目 — alias / assets ディレクトリ — は `wrangler.config.ts` 側にある。
import { bindings, defineConfig } from 'cf/config'

export default defineConfig({
  worker: {
    name: 'shisha-flavor-search',
    compatibilityDate: '2025-09-01',
    compatibilityFlags: ['nodejs_compat'],
    // Sentry でラップした自前のエントリ。OpenNext 生成物は wrangler.config.ts の alias 経由で読み込む。
    entrypoint: './worker.ts',
    observability: {
      enabled: false,
      headSamplingRate: 1,
      logs: {
        enabled: true,
        headSamplingRate: 1,
        persist: true,
        invocationLogs: true,
      },
      traces: {
        enabled: false,
        persist: true,
        headSamplingRate: 1,
      },
    },
    env: {
      ASSETS: bindings.assets(),
    },
  },
})
