import { normalizeBrandForSearch } from '../lib/utils/brandNormalizer'

/**
 * ブランド名 (normalizeBrandForSearch を通した小文字キー) → 画像URL のマップ。
 * 画像は Wikimedia Commons などの信頼できる公開ホストを優先。
 * 追加する場合は next.config.ts の remotePatterns に hostname を追加すること。
 */
const BRAND_IMAGE_ENTRIES: Record<string, string> = {
  shiazo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Shiazo_Blueberry.png',
}

export function getBrandImageUrl(brand: string): string | undefined {
  return BRAND_IMAGE_ENTRIES[normalizeBrandForSearch(brand)]
}

export const REGISTERED_BRAND_IMAGE_COUNT = Object.keys(BRAND_IMAGE_ENTRIES).length
