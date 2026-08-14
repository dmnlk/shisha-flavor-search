import { describe, expect, it } from 'vitest'

import { normalizeFlavorName, tagFlavorName } from '../flavorTagger'

describe('normalizeFlavorName', () => {
  it('strips the manufacturer prefix', () => {
    expect(normalizeFlavorName('Adalya Love 66', 'Adalya')).toBe('love 66')
  })

  it('keeps the name when there is no manufacturer prefix', () => {
    expect(normalizeFlavorName('クレオパトラ・グレープ', 'Cleopatra')).toBe('クレオパトラ グレープ')
  })

  it('removes diacritics and punctuation, lowercases', () => {
    expect(normalizeFlavorName('Eternal Smoke CAFE ́ NOIR', 'Eternal Smoke')).toBe('cafe noir')
  })
})

describe('tagFlavorName', () => {
  it('tags a single-keyword name', () => {
    expect(tagFlavorName('AL FAKHER Double Apple', 'AL FAKHER')).toEqual(['apple'])
  })

  it('collects tags from every matched keyword', () => {
    expect(tagFlavorName('Adalya Lemon Mint', 'Adalya')).toEqual(
      expect.arrayContaining(['citrus', 'mint'])
    )
  })

  it('respects word boundaries (grapefruit is not grape, pineapple is not apple)', () => {
    expect(tagFlavorName('Fumari Grapefruit', 'Fumari')).toEqual(['citrus'])
    expect(tagFlavorName('Fumari Pineapple', 'Fumari')).toEqual(['tropical'])
  })

  it('does not misread ice inside juice', () => {
    expect(tagFlavorName('Al Waha Orange Juice', 'Al Waha')).toEqual(
      expect.arrayContaining(['citrus', 'drink'])
    )
    expect(tagFlavorName('Al Waha Orange Juice', 'Al Waha')).not.toContain('ice')
  })

  it('consumes longer phrases before their parts (cherry blossom is floral, not fruit)', () => {
    expect(tagFlavorName('Buta Cherry Blossom', 'Buta')).toEqual(['floral'])
  })

  it('treats ice cream as dessert, not as cooling', () => {
    const tags = tagFlavorName('Fantasia Vanilla Ice Cream', 'Fantasia')
    expect(tags).toEqual(expect.arrayContaining(['cream', 'dessert']))
    expect(tags).not.toContain('ice')
  })

  it('matches katakana keywords without word boundaries', () => {
    expect(tagFlavorName('クレオパトラ・グレープ', 'Cleopatra')).toEqual(['grape'])
    expect(tagFlavorName('BS・シーシャ・チェリーコーラ', 'BS')).toEqual(
      expect.arrayContaining(['fruit', 'drink'])
    )
  })

  it('returns an empty array for names it cannot judge', () => {
    expect(tagFlavorName('BONCHE Base', 'BONCHE')).toEqual([])
  })

  it('resolves well-known fantasy names via overrides', () => {
    expect(tagFlavorName('ADALYA Love66', 'ADALYA')).toEqual(
      expect.arrayContaining(['tropical', 'melon', 'mint'])
    )
  })
})
