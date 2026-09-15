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
  'スイス': { codes: ['CH'], label: 'スイス' },
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

/**
 * 原産国の表記ゆれ・誤字 → data/shishaData.js に採用している正規表記。
 * MOF 公告の PDF は同じ国を「USA / アメリカ合衆国」「Jordan / ヨルダン」のように
 * 揺れて記載するため、取り込み時 (merge_into_data.py) とここで同じ表に揃える。
 * データ側は正規表記のみを持つ前提 (data/__tests__/shishaDataCountries.test.ts で検証)。
 */
const COUNTRY_CANONICAL: Record<string, string> = {
  'USA': 'アメリカ合衆国',
  'アメリ力合衆国': 'アメリカ合衆国',
  'Jordan': 'ヨルダン',
  'UAE': 'アラブ首長国連邦',
  'U.A.E': 'アラブ首長国連邦',
  'switzerland': 'スイス',
  'Germany': 'ドイツ',
  'ロシア モルドバ': 'ロシアモルドバ',
}

/** 表記ゆれを正規表記に寄せる。未知の値はトリムしてそのまま返す。 */
export function canonicalCountryName(country: string): string {
  const key = country.trim()
  return COUNTRY_CANONICAL[key] ?? key
}

/** 正規表記として COUNTRY_MAP に登録済みか (表記ゆれ・未知の国名は false)。 */
export function isCanonicalCountryName(country: string): boolean {
  const key = country.trim()
  return key in COUNTRY_MAP && !(key in COUNTRY_CANONICAL)
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
