import { describe, expect, it } from 'vitest'
import type { ShishaFlavor } from '../../types/shisha'
import {
  flavorDescriptionKey,
  getFlavorDescription,
  resolveFlavorDescription,
} from '../flavorDescriptions'

type FlavorInput = Pick<ShishaFlavor, 'id' | 'manufacturer' | 'productName' | 'description'>

describe('flavorDescriptionKey', () => {
  it('ブランド表記ゆれ・サイズ違いでも同じキーに正規化される', () => {
    expect(flavorDescriptionKey('AL FAKHER', 'AL FAKHER Two Apples')).toBe('al-fakher:two apples')
    expect(flavorDescriptionKey('AL Fakher', 'AL Fakher Two Apples')).toBe('al-fakher:two apples')
  })
})

describe('getFlavorDescription', () => {
  it('名前キーのエントリから説明を返す (表記ゆれ id をまとめてカバー)', () => {
    const upper = getFlavorDescription({
      id: 364,
      manufacturer: 'AL FAKHER',
      productName: 'AL FAKHER Two Apples',
    })
    const mixed = getFlavorDescription({
      id: 365,
      manufacturer: 'AL Fakher',
      productName: 'AL Fakher Two Apples',
    })
    expect(upper).toContain('ダブルアップル')
    expect(mixed).toBe(upper)
  })

  it("Editor's Selection の note に id でフォールバックする", () => {
    const description = getFlavorDescription({
      id: 1398,
      manufacturer: 'Buta',
      productName: 'Buta Ice Mint',
    })
    expect(description).toContain('ミント')
  })

  it('未知のフレーバーは null (UI はセクションを非表示にする)', () => {
    expect(
      getFlavorDescription({ id: 999999, manufacturer: 'Unknown Brand', productName: 'Mystery' })
    ).toBeNull()
  })
})

describe('resolveFlavorDescription', () => {
  it('description が空のとき既知の説明を埋める', () => {
    const flavor: FlavorInput = {
      id: 364,
      manufacturer: 'AL FAKHER',
      productName: 'AL FAKHER Two Apples',
    }
    const resolved = resolveFlavorDescription(flavor)
    expect(resolved.description).toContain('ダブルアップル')
  })

  it('元データの description があればそちらを優先する', () => {
    const resolved = resolveFlavorDescription({
      id: 364,
      manufacturer: 'AL FAKHER',
      productName: 'AL FAKHER Two Apples',
      description: '元データの説明',
    })
    expect(resolved.description).toBe('元データの説明')
  })

  it('説明が見つからないフレーバーはそのまま返す', () => {
    const flavor: FlavorInput = { id: 999999, manufacturer: 'Unknown Brand', productName: 'Mystery' }
    const resolved = resolveFlavorDescription(flavor)
    expect(resolved).toBe(flavor)
    expect(resolved).not.toHaveProperty('description')
  })
})
