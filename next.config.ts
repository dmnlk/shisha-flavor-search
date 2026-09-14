import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import { withSentryConfig } from '@sentry/nextjs/config'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shisha-mart.com',
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
      },
    ],
  },
}

export default withSentryConfig(nextConfig, {
  // org / project / authToken は SENTRY_ORG / SENTRY_PROJECT / SENTRY_AUTH_TOKEN 環境変数から読まれる。
  // ソースマップのアップロードは auth token があるときだけ行う (未設定ならソースマップ自体を生成しない)。
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  // Turbopack ビルドで生成される全クライアントチャンクをアップロード対象にする
  widenClientFileUpload: true,
  // ビルドログは CI のときだけ出す
  silent: !process.env.CI,
  // Sentry 社への SDK 利用状況テレメトリは送らない
  telemetry: false,
})
