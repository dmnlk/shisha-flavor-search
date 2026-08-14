/**
 * フレーバータグの固定タクソノミー。
 *
 * タグはこの18種に固定し、自由記述タグは持たない (表記ゆれで検索が壊れるため)。
 * 各フレーバーへの割り当ては lib/tags/flavorTagger.ts のキーワード辞書 +
 * data/flavorTagOverrides.ts (辞書で判定できない商品名のAI分類結果) で決まり、
 * ビルド時に scripts/build-data.ts が data/generated/flavorTags.json へ出力する。
 *
 * client-safe (fs 依存なし)。クライアントコンポーネントから直接 import してよい。
 */

export const FLAVOR_TAG_DEFS = [
  { slug: 'citrus', label: '柑橘', labelEn: 'Citrus' },
  { slug: 'apple', label: 'アップル', labelEn: 'Apple' },
  { slug: 'grape', label: 'グレープ', labelEn: 'Grape' },
  { slug: 'berry', label: 'ベリー', labelEn: 'Berry' },
  { slug: 'peach', label: 'ピーチ', labelEn: 'Peach' },
  { slug: 'melon', label: 'メロン・スイカ', labelEn: 'Melon' },
  { slug: 'tropical', label: 'トロピカル', labelEn: 'Tropical' },
  { slug: 'fruit', label: 'フルーツその他', labelEn: 'Other Fruit' },
  { slug: 'mint', label: 'ミント', labelEn: 'Mint' },
  { slug: 'ice', label: 'アイス・清涼', labelEn: 'Ice' },
  { slug: 'cream', label: 'クリーム・バニラ', labelEn: 'Cream' },
  { slug: 'dessert', label: 'スイーツ', labelEn: 'Dessert' },
  { slug: 'coffee', label: 'コーヒー', labelEn: 'Coffee' },
  { slug: 'tea', label: 'ティー', labelEn: 'Tea' },
  { slug: 'drink', label: 'ドリンク・カクテル', labelEn: 'Drink' },
  { slug: 'spice', label: 'スパイス・ハーブ', labelEn: 'Spice & Herb' },
  { slug: 'floral', label: 'フローラル', labelEn: 'Floral' },
  { slug: 'nut', label: 'ナッツ', labelEn: 'Nut' },
] as const

export type FlavorTagSlug = (typeof FLAVOR_TAG_DEFS)[number]['slug']

export const FLAVOR_TAG_SLUGS: FlavorTagSlug[] = FLAVOR_TAG_DEFS.map(d => d.slug)

const LABEL_MAP = new Map<FlavorTagSlug, { label: string; labelEn: string }>(
  FLAVOR_TAG_DEFS.map(d => [d.slug, { label: d.label, labelEn: d.labelEn }])
)

export function flavorTagLabel(slug: FlavorTagSlug): string {
  return LABEL_MAP.get(slug)?.label ?? slug
}

export function flavorTagLabelEn(slug: FlavorTagSlug): string {
  return LABEL_MAP.get(slug)?.labelEn ?? slug
}

export function isFlavorTagSlug(value: string): value is FlavorTagSlug {
  return (FLAVOR_TAG_SLUGS as string[]).includes(value)
}
