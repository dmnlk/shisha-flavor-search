// wrangler (バンドラ) 固有の設定。Worker 本体の設定は `cloudflare.config.ts`。
import { defineWranglerConfig } from 'wrangler/experimental-config'

export default defineWranglerConfig({
  alias: {
    'open-next-worker': './.open-next/worker.js',
  },
  types: {
    generate: false,
  },
  assetsDirectory: '.open-next/assets',
})
