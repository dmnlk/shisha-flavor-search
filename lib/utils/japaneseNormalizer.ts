/**
 * 日本語テキストを検索用に正規化する。
 *
 * - NFKC 正規化: 全角英数記号 → 半角、半角カナ → 全角カナ、全角スペース → 半角
 * - ひらがな → カタカナ (例: みんと → ミント)
 * - 小文字化 (ASCII のみ実質影響)
 * - 連続空白を単一空白に集約し、両端をトリム
 *
 * これにより「ミント / みんと / ＭＩＮＴ / mint」が同一の検索キーに写像される。
 * カタカナ表記 (ミント) を正規化ターゲットにするのは、データ側がカタカナ主体のため。
 */
export function normalizeForSearch(input: string): string {
  if (!input) return ''

  let s = input.normalize('NFKC')

  s = s.replace(/[ぁ-ゖ]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  )

  s = s.toLowerCase().replace(/\s+/g, ' ').trim()

  return s
}

/**
 * スペース区切りのクエリをトークンに分割し、それぞれを正規化した配列を返す。
 * 空文字トークンは除去する。
 */
export function tokenizeForSearch(query: string): string[] {
  const normalized = normalizeForSearch(query)
  if (!normalized) return []
  return normalized.split(' ').filter(Boolean)
}
