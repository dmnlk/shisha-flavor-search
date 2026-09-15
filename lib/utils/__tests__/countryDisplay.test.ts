import { describe, expect, it } from 'vitest'

import { canonicalCountryName, getCountryDisplay, isCanonicalCountryName } from '../countryDisplay'

describe('getCountryDisplay', () => {
  it('returns null for null, undefined, or empty strings', () => {
    expect(getCountryDisplay(null)).toBeNull()
    expect(getCountryDisplay(undefined)).toBeNull()
    expect(getCountryDisplay('')).toBeNull()
    expect(getCountryDisplay('   ')).toBeNull()
  })

  it('maps Japanese country names to flag + label', () => {
    expect(getCountryDisplay('マレーシア')).toEqual({
      flag: '🇲🇾',
      label: 'マレーシア',
      known: true,
    })
    expect(getCountryDisplay('ヨルダン')).toEqual({
      flag: '🇯🇴',
      label: 'ヨルダン',
      known: true,
    })
  })

  it('maps English variants to the same entry', () => {
    expect(getCountryDisplay('USA')?.flag).toBe('🇺🇸')
    expect(getCountryDisplay('USA')?.label).toBe('アメリカ')
    expect(getCountryDisplay('Jordan')?.flag).toBe('🇯🇴')
    expect(getCountryDisplay('Germany')?.label).toBe('ドイツ')
    expect(getCountryDisplay('switzerland')?.flag).toBe('🇨🇭')
  })

  it('normalises UAE spelling variants', () => {
    const expected = { flag: '🇦🇪', label: 'アラブ首長国連邦', known: true }
    expect(getCountryDisplay('UAE')).toEqual(expected)
    expect(getCountryDisplay('U.A.E')).toEqual(expected)
    expect(getCountryDisplay('アラブ首長国連邦')).toEqual(expected)
  })

  it('handles the OCR typo アメリ力合衆国', () => {
    expect(getCountryDisplay('アメリ力合衆国')).toEqual({
      flag: '🇺🇸',
      label: 'アメリカ',
      known: true,
    })
  })

  it('emits two flag glyphs for multi-country entries', () => {
    const russiaMoldova = getCountryDisplay('ロシアモルドバ')
    expect(russiaMoldova?.flag).toBe('🇷🇺🇲🇩')
    expect(russiaMoldova?.label).toBe('ロシア・モルドバ')
    expect(getCountryDisplay('ロシア モルドバ')?.flag).toBe('🇷🇺🇲🇩')
  })

  it('trims surrounding whitespace before lookup', () => {
    expect(getCountryDisplay('  マレーシア  ')?.flag).toBe('🇲🇾')
  })

  it('returns an unknown entry with the raw label for unmapped values', () => {
    expect(getCountryDisplay('アトランティス')).toEqual({
      flag: '',
      label: 'アトランティス',
      known: false,
    })
  })
})

describe('canonicalCountryName', () => {
  it('maps spelling variants and the OCR typo to the canonical Japanese name', () => {
    expect(canonicalCountryName('USA')).toBe('アメリカ合衆国')
    expect(canonicalCountryName('アメリ力合衆国')).toBe('アメリカ合衆国')
    expect(canonicalCountryName('Jordan')).toBe('ヨルダン')
    expect(canonicalCountryName('UAE')).toBe('アラブ首長国連邦')
    expect(canonicalCountryName('U.A.E')).toBe('アラブ首長国連邦')
    expect(canonicalCountryName('switzerland')).toBe('スイス')
    expect(canonicalCountryName('Germany')).toBe('ドイツ')
    expect(canonicalCountryName('ロシア モルドバ')).toBe('ロシアモルドバ')
  })

  it('returns canonical and unknown names unchanged (trimmed)', () => {
    expect(canonicalCountryName('アメリカ合衆国')).toBe('アメリカ合衆国')
    expect(canonicalCountryName('  トルコ ')).toBe('トルコ')
    expect(canonicalCountryName('アトランティス')).toBe('アトランティス')
  })
})

describe('isCanonicalCountryName', () => {
  it('accepts canonical names and rejects variants or unknown values', () => {
    expect(isCanonicalCountryName('アメリカ合衆国')).toBe(true)
    expect(isCanonicalCountryName('ロシアモルドバ')).toBe(true)
    expect(isCanonicalCountryName('スイス')).toBe(true)
    expect(isCanonicalCountryName('USA')).toBe(false)
    expect(isCanonicalCountryName('アメリ力合衆国')).toBe(false)
    expect(isCanonicalCountryName('アトランティス')).toBe(false)
  })
})
