import { fuzzySearch } from '../fuzzySearch'

import { shishaData } from '../../../data/shishaData'
import type { ShishaFlavor } from '../../../types/shisha'

describe('fuzzySearch', () => {
  it('returns all items for an empty query', () => {
    const results = fuzzySearch('')
    expect(results).toHaveLength((shishaData as ShishaFlavor[]).length)
  })

  it('returns all items for whitespace-only query', () => {
    const results = fuzzySearch('   ')
    expect(results).toHaveLength((shishaData as ShishaFlavor[]).length)
  })

  it('finds an exact Latin substring match', () => {
    const results = fuzzySearch('mango')
    expect(results.length).toBeGreaterThan(0)
    expect(
      results.some(r => r.productName.toLowerCase().includes('mango'))
    ).toBe(true)
  })

  it('is case-insensitive', () => {
    const lower = fuzzySearch('mango')
    const upper = fuzzySearch('MANGO')
    expect(upper.length).toBeGreaterThan(0)
    expect(upper[0].id).toBe(lower[0].id)
  })

  it('tolerates a one-character typo (fuzzy)', () => {
    const exact = fuzzySearch('mango')
    const typo = fuzzySearch('manog')
    expect(typo.length).toBeGreaterThan(0)
    const exactIds = new Set(exact.map(r => r.id))
    const overlap = typo.filter(r => exactIds.has(r.id))
    expect(overlap.length).toBeGreaterThan(0)
  })

  it('ranks items containing all tokens at the top for multi-token queries', () => {
    // Fuse の extended search はトークンごとに fuzzy AND を適用するため、
    // 全トークンを厳密に含む項目が必ずしも全件とは限らない (近似ヒットも含まれる)。
    // ここでは最上位ヒットが両トークンを含むことを検証する (UX 上重要なのは順位)。
    const results = fuzzySearch('Abukhaliq Mango')
    expect(results.length).toBeGreaterThan(0)
    const top = results[0]
    const topText = `${top.manufacturer} ${top.productName}`.toLowerCase()
    expect(topText.includes('abukhaliq') && topText.includes('mango')).toBe(true)
  })

  it('restricts search to manufacturer when searchType is brand', () => {
    const flavorOnly = fuzzySearch('Caramel', 'flavor')
    const brandOnly = fuzzySearch('Caramel', 'brand')
    // "Caramel" shows up in productName often but rarely in manufacturer.
    expect(flavorOnly.length).toBeGreaterThan(brandOnly.length)
  })

  it('restricts search to productName when searchType is flavor', () => {
    const hits = fuzzySearch('Mango', 'flavor')
    expect(hits.length).toBeGreaterThan(0)
    // Top hits should contain the token in productName, not only manufacturer.
    const top = hits.slice(0, 5)
    expect(top.some(h => h.productName.toLowerCase().includes('mango'))).toBe(true)
  })
})
