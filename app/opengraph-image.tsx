import { ImageResponse } from 'next/og'

export const alt = 'シーシャフレーバー検索 — 日本国内で流通しているシーシャ フレーバーを横断検索'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#fafaf7',
          color: '#0a0a0a',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              background: '#e8492c',
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#525252',
            }}
          >
            § Shisha Flavor Ledger
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: -4,
            }}
          >
            シーシャフレーバー
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 110,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: -4,
            }}
          >
            <span>検索</span>
            <span style={{ color: '#e8492c' }}>.</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #0a0a0a',
            paddingTop: 20,
          }}
        >
          <div style={{ fontSize: 26, color: '#404040', maxWidth: 760 }}>
            日本国内で流通している水たばこフレーバーを、ブランド・原産国・価格で横断検索
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#737373',
            }}
          >
            shisha-lento.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
