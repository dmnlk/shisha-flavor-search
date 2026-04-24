type CountryInfo = { codes: string[]; label: string }

const COUNTRY_MAP: Record<string, CountryInfo> = {
  'アメリカ合衆国': { codes: ['US'], label: 'アメリカ' },
  'アメリ力合衆国': { codes: ['US'], label: 'アメリカ' },
  'USA': { codes: ['US'], label: 'アメリカ' },
  'ヨルダン': { codes: ['JO'], label: 'ヨルダン' },
  'Jordan': { codes: ['JO'], label: 'ヨルダン' },
  'トルコ': { codes: ['TR'], label: 'トルコ' },
  'アラブ首長国連邦': { codes: ['AE'], label: 'アラブ首長国連邦' },
  'UAE': { codes: ['AE'], label: 'アラブ首長国連邦' },
  'U.A.E': { codes: ['AE'], label: 'アラブ首長国連邦' },
  'ロシア': { codes: ['RU'], label: 'ロシア' },
  'インドネシア': { codes: ['ID'], label: 'インドネシア' },
  'switzerland': { codes: ['CH'], label: 'スイス' },
  'エジプト': { codes: ['EG'], label: 'エジプト' },
  'マレーシア': { codes: ['MY'], label: 'マレーシア' },
  'ロシアモルドバ': { codes: ['RU', 'MD'], label: 'ロシア・モルドバ' },
  'ロシア モルドバ': { codes: ['RU', 'MD'], label: 'ロシア・モルドバ' },
  'インド': { codes: ['IN'], label: 'インド' },
  'ドイツ': { codes: ['DE'], label: 'ドイツ' },
  'Germany': { codes: ['DE'], label: 'ドイツ' },
  '日本': { codes: ['JP'], label: '日本' },
  'スペイン': { codes: ['ES'], label: 'スペイン' },
  'パラグアイ': { codes: ['PY'], label: 'パラグアイ' },
  'モルドバ': { codes: ['MD'], label: 'モルドバ' },
  'ラオス': { codes: ['LA'], label: 'ラオス' },
  '台湾': { codes: ['TW'], label: '台湾' },
  'フランス': { codes: ['FR'], label: 'フランス' },
  'イタリア': { codes: ['IT'], label: 'イタリア' },
}

const REGIONAL_INDICATOR_BASE = 0x1F1E6
const ASCII_A = 'A'.charCodeAt(0)

function codeToFlag(code: string): string {
  const upper = code.toUpperCase()
  if (upper.length !== 2) return ''
  const codePoints = [...upper].map((ch) => ch.charCodeAt(0) - ASCII_A + REGIONAL_INDICATOR_BASE)
  return String.fromCodePoint(...codePoints)
}

export type CountryDisplay = {
  flag: string
  label: string
  known: boolean
}

export function getCountryDisplay(country?: string | null): CountryDisplay | null {
  if (!country) return null
  const key = country.trim()
  if (!key) return null
  const info = COUNTRY_MAP[key]
  if (!info) {
    return { flag: '', label: key, known: false }
  }
  return {
    flag: info.codes.map(codeToFlag).join(''),
    label: info.label,
    known: true,
  }
}
