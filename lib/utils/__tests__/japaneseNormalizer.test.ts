import { normalizeForSearch, tokenizeForSearch } from '../japaneseNormalizer'

describe('normalizeForSearch', () => {
  it('returns empty string for falsy input', () => {
    expect(normalizeForSearch('')).toBe('')
  })

  it('converts hiragana to katakana', () => {
    expect(normalizeForSearch('みんと')).toBe('ミント')
    expect(normalizeForSearch('すいか')).toBe('スイカ')
  })

  it('leaves katakana unchanged', () => {
    expect(normalizeForSearch('ミント')).toBe('ミント')
  })

  it('treats hiragana and katakana as identical keys', () => {
    expect(normalizeForSearch('みんと')).toBe(normalizeForSearch('ミント'))
  })

  it('converts full-width ASCII to half-width and lowercases', () => {
    expect(normalizeForSearch('ＭＩＮＴ')).toBe('mint')
    expect(normalizeForSearch('Ａｌ　Ｆａｋｈｅｒ')).toBe('al fakher')
  })

  it('normalizes half-width katakana to full-width', () => {
    expect(normalizeForSearch('ﾐﾝﾄ')).toBe('ミント')
  })

  it('normalizes full-width space to half-width and collapses whitespace', () => {
    expect(normalizeForSearch('  ミント   フレーバー  ')).toBe('ミント フレーバー')
    expect(normalizeForSearch('ミント　フレーバー')).toBe('ミント フレーバー')
  })

  it('lowercases latin characters', () => {
    expect(normalizeForSearch('Al Fakher')).toBe('al fakher')
  })

  it('is idempotent', () => {
    const once = normalizeForSearch('Ａｌ　Ｆａｋｈｅｒ　みんと')
    expect(normalizeForSearch(once)).toBe(once)
  })
})

describe('tokenizeForSearch', () => {
  it('splits on whitespace after normalization', () => {
    expect(tokenizeForSearch('ミント　レモン')).toEqual(['ミント', 'レモン'])
  })

  it('returns an empty array for empty input', () => {
    expect(tokenizeForSearch('')).toEqual([])
    expect(tokenizeForSearch('   ')).toEqual([])
  })

  it('drops empty tokens from multiple spaces', () => {
    expect(tokenizeForSearch('a   b')).toEqual(['a', 'b'])
  })
})
