import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 構造化アクセスログ proxy（旧 middleware 規約。Next.js 16 で proxy にリネーム）。
 *
 * Cloudflare Workers が自動で吐く invocation log は「GET <url>」だけで情報量が乏しいため、
 * ここで 1 リクエスト = 1 行の JSON ログを追加で出力する。Cloudflare Workers Logs は
 * メッセージが JSON のとき各キーをフィールドとして取り込むので、ダッシュボードの
 * 「Fields」から ua / referer / type などを列・フィルタとして使えるようになる。
 *
 * status / 応答時間は proxy からは取得できないため対象外（取得には Worker の
 * ラップが必要）。
 */

// 代表的なクローラー / 自動化ツールの判定用。最初にマッチしたトークンを botName とする。
const BOT_PATTERN =
  /(googlebot|bingbot|yandexbot|baiduspider|duckduckbot|applebot|ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|oai-searchbot|perplexitybot|amazonbot|facebookexternalhit|twitterbot|slackbot|discordbot|telegrambot|whatsapp|linkedinbot|pinterest|redditbot|google-inspectiontool|chrome-lighthouse|headlesschrome|python-requests|curl|wget|go-http-client|node-fetch|axios|bot|crawler|spider)/i

/**
 * リクエストの種別を判定する。
 * 実アクセスログに大量に現れる `?_rsc=...` は RSC / プリフェッチ fetch のノイズだが、
 * Next.js は `_rsc` クエリパラメータも `RSC` / `Next-Router-Prefetch` ヘッダも proxy
 * 到達前に除去してしまう。唯一 proxy まで残る `Accept: text/x-component` で RSC を判定する。
 * （プリフェッチと soft navigation はヘッダが残らないため区別できない＝まとめて rsc 扱い）
 */
function classify(request: NextRequest): 'api' | 'rsc' | 'page' {
  if (request.nextUrl.pathname.startsWith('/api/')) return 'api'
  const accept = request.headers.get('accept') ?? ''
  if (accept.includes('text/x-component')) return 'rsc'
  return 'page'
}

export function proxy(request: NextRequest): NextResponse {
  const ua = request.headers.get('user-agent') ?? ''
  const botMatch = ua.match(BOT_PATTERN)

  // JSON 1 行で出すことで Workers Logs がフィールド化する。msg は従来の見た目を踏襲。
  // アクセスログは info 相当で出したいので、ここでは意図的に console.log を使う。
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      msg: `${request.method} ${request.nextUrl.pathname}`,
      method: request.method,
      path: request.nextUrl.pathname,
      type: classify(request),
      referer: request.headers.get('referer') ?? null,
      ua: ua || null,
      bot: botMatch !== null,
      botName: botMatch ? botMatch[1].toLowerCase() : null,
      ray: request.headers.get('cf-ray') ?? null,
    })
  )

  return NextResponse.next()
}

export const config = {
  // 静的アセットと Next 内部パスは除外し、ページ・API・RSC のみを対象にする。
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|images/).*)',
  ],
}
