import { getCountryDisplay } from '../countryDisplay'

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
