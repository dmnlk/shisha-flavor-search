import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { ThemeProvider } from '../components/ThemeProvider'
import { ThemeToggle } from '../components/ThemeToggle'
import { escapeJsonLd } from '../lib/utils/jsonLd'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// NEXT_PUBLIC_SITE_URL は build-time inline されるため、未設定のまま
// deploy されると og:url / og:image が dev ホストに化ける。env が抜けても
// 本番が壊れないよう、本番ドメインをフォールバックにする。
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shisha-lento.com'
).replace(/\/$/, '')

const SITE_NAME = 'シーシャフレーバー検索 — Shisha Flavor Ledger'
const SITE_TITLE = 'シーシャフレーバー検索 | 全銘柄の価格・内容量・原産国を横断検索'
const SITE_DESCRIPTION =
  '日本で流通しているシーシャ(水たばこ)フレーバーを横断検索できる無料データベース。AlFakher / STARBUZZ / Adalya / Fumari など主要ブランドの商品名・内容量・原産国・小売定価を網羅し、財務省「製造たばこ小売定価」公告に基づいて随時更新しています。'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | シーシャフレーバー検索',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  keywords: [
    'シーシャ',
    'フレーバー',
    '水たばこ',
    'シーシャ 銘柄',
    'シーシャ フレーバー 一覧',
    'シーシャ 値段',
    'AlFakher',
    'STARBUZZ',
    'Adalya',
    'Fumari',
  ],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: 'シーシャフレーバー検索',
  url: `${SITE_URL}/`,
  inLanguage: 'ja',
  description: SITE_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon.svg`,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className="min-h-screen bg-paper-0 dark:bg-paper-950 text-ink-900 dark:text-ink-100 transition-colors duration-150 font-sans-tight"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJsonLd(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJsonLd(organizationJsonLd) }}
        />
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
