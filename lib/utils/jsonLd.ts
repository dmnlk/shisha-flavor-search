// JSON-LD を <script> に dangerouslySetInnerHTML で注入する際の XSS / パース崩壊対策。
// `</script>` などのトークンと、JSON.stringify がエスケープしない U+2028 / U+2029
// (JS のソース上で行終端と解釈される) をエスケープする。
const LINE_SEPARATORS = new RegExp('[\\u2028\\u2029]', 'g')

export function escapeJsonLd(json: unknown): string {
  return JSON.stringify(json)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(LINE_SEPARATORS, (ch) => (ch.charCodeAt(0) === 0x2028 ? '\\u2028' : '\\u2029'))
}
