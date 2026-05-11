// "14,000円" や "1,200円" のような表記から税込小売定価の数値 (JPY) を抜き出す。
// JSON-LD Product offers の price フィールド用。
export function parseJpyPrice(price: string | undefined | null): number | null {
  if (!price) return null
  const digits = price.replace(/[^\d]/g, '')
  if (!digits) return null
  const n = Number(digits)
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}
