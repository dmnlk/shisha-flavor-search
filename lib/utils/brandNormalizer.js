/**
 * ブランド名を正規化する関数
 * 大文字小文字の違いを統一し、一般的な表記に変換する
 */

// よく知られているブランドの正式名称マッピング
const BRAND_CANONICAL_NAMES = {
  'AL FAKHER': 'Al Fakher',
  'ALFAKHER': 'Al Fakher',
  'STARBUZZ': 'Starbuzz',
  'STAR BUZZ': 'Starbuzz',
  'AZURE': 'Azure',
  'ADALYA': 'Adalya',
  'TANGIERS': 'Tangiers',
  'FUMARI': 'Fumari',
  'ETERNAL SMOKE': 'Eternal Smoke',
  'TRIFECTA': 'Trifecta',
  'ZOMO': 'Zomo',
  'AFZAL': 'Afzal',
  'SOCIAL SMOKE': 'Social Smoke',
  'HAZE': 'Haze',
  'UGLY HOOKAH': 'Ugly Hookah',
  'FANTASIA': 'Fantasia',
  'HYDRO': 'Hydro',
  'PURE': 'Pure',
  'DOZAJ': 'Dozaj',
  'CHAOS': 'Chaos',
  'B3': 'B3',
  'DARKSIDE': 'Darkside',
  'ELEMENT': 'Element',
  'MUSTHAVE': 'MustHave',
  'MUST HAVE': 'MustHave',
  'BLACKBURN': 'BlackBurn',
  'BLACK BURN': 'BlackBurn',
  'DAILY HOOKAH': 'Daily Hookah',
  'SPECTRUM': 'Spectrum',
  'BONCHE': 'Bonche',
  'SATYR': 'Satyr',
  'DUFT': 'Duft',
  'СЕВЕРНЫЙ': 'Северный',
  'SEVERNYI': 'Северный',
  'CHABACCO': 'Chabacco',
  'MATT PEAR': 'Matt Pear',
  'MATTPEAR': 'Matt Pear',
  'COBRA': 'Cobra',
  'MILANO': 'Milano',
  'OVERDOZZ': 'Overdozz',
  'OVER DOZZ': 'Overdozz',
};

/**
 * ブランド名を正規化する
 * @param {string} brandName - 正規化するブランド名
 * @returns {string} 正規化されたブランド名
 */
export function normalizeBrandName(brandName) {
  if (!brandName) return '';
  
  // トリムして余分な空白を削除
  let normalized = brandName.trim();
  
  // 連続する空白を単一の空白に置換
  normalized = normalized.replace(/\s+/g, ' ');
  
  // 大文字に変換してマッピングをチェック
  const upperCase = normalized.toUpperCase();
  if (BRAND_CANONICAL_NAMES[upperCase]) {
    return BRAND_CANONICAL_NAMES[upperCase];
  }
  
  // マッピングにない場合は、Title Caseに変換
  // ただし、全て大文字の短い名前（3文字以下）はそのまま大文字を保持
  if (upperCase === normalized && normalized.length <= 3) {
    return normalized;
  }
  
  // Title Caseに変換（各単語の最初の文字を大文字に）
  return normalized
    .split(' ')
    .map(word => {
      // 前置詞や冠詞は小文字のまま（ただし文頭は除く）
      const lowerWords = ['of', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for'];
      if (lowerWords.includes(word.toLowerCase()) && normalized.indexOf(word) !== 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * ブランド名の配列から重複を除去し、正規化された一意のリストを返す
 * @param {string[]} brands - ブランド名の配列
 * @returns {string[]} 正規化され重複が除去されたブランド名の配列
 */
export function getUniqueBrands(brands) {
  const normalizedMap = new Map();
  
  brands.forEach(brand => {
    const normalized = normalizeBrandName(brand);
    // 最初に出現したオリジナルのブランド名を保持
    if (!normalizedMap.has(normalized.toLowerCase())) {
      normalizedMap.set(normalized.toLowerCase(), normalized);
    }
  });
  
  return Array.from(normalizedMap.values()).sort();
}

/**
 * 検索用にブランド名を正規化（大文字小文字を無視）
 * @param {string} brandName - ブランド名
 * @returns {string} 検索用に正規化されたブランド名
 */
export function normalizeBrandForSearch(brandName) {
  return normalizeBrandName(brandName).toLowerCase();
}