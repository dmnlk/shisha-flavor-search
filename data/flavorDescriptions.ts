import { normalizeFlavorName } from '../lib/tags/flavorTagger'
import { brandSlug } from '../lib/utils/brandNormalizer'
import type { ShishaFlavor } from '../types/shisha'

import { EDITORS_PICKS } from './curatedPicks'

/**
 * フレーバー詳細ページ「Tasting note」用の日本語説明。
 *
 * - キーは `flavorDescriptionKey(manufacturer, productName)` の結果
 *   (`brandSlug` + `normalizeFlavorName` の複合キー)。同一フレーバーの
 *   サイズ違い・表記ゆれ id をまとめて 1 エントリでカバーする。
 * - 公知のテイスト情報に基づく記述のみ。確信が持てないフレーバーは
 *   このファイルに載せず未記載のままにする方針 — 根拠のない捏造をしないこと。
 * - 大半のフレーバーには説明が無い前提。呼び出し側 UI は `null` のとき
 *   セクションごと非表示にする (brandDescriptions.ts と同じ扱い)。
 * - トップページ Editor's Selection の手書き `note` (curatedPicks.ts) は
 *   id フォールバックとして再利用する。名前キーのエントリが優先。
 *
 * Client-safe: fs 非依存。ただし詳細ページはサーバー側で解決して props で渡す。
 */

const AL_FAKHER_TWO_APPLES =
  'りんごにアニス(八角様)の薬草的な香りを重ねた中東伝統のダブルアップル。Al Fakherの看板であり、シーシャの定番中の定番。'
const AL_FAKHER_TWO_APPLES_MINT =
  'ダブルアップルにミントの清涼感を加えたバリエーション。アニスの甘い香りと冷涼な後味の組み合わせ。'
const TANGIERS_CANE_MINT =
  'ダークリーフのTangiersを代表するピュアミント。強い清涼感とタバコ感を併せ持ち、単体でもミックスのベースでも定番。'

export const FLAVOR_DESCRIPTIONS: Record<string, string> = {
  // Al Fakher — Two Apples 系 (サイズ・表記ゆれをキー別にカバー)
  'al-fakher:two apple': AL_FAKHER_TWO_APPLES,
  'al-fakher:two apples': AL_FAKHER_TWO_APPLES,
  'al-fakher:shisha molasses two apple': AL_FAKHER_TWO_APPLES,
  'al-fakher:two apples mint': AL_FAKHER_TWO_APPLES_MINT,
  'al-fakher:two apples with mint': AL_FAKHER_TWO_APPLES_MINT,
  'al-fakher:shisha molasses two apples with mint': AL_FAKHER_TWO_APPLES_MINT,

  // Adalya
  'adalya:love66':
    'パッションフルーツ・スイカ・メロンにミントを効かせたAdalyaの看板ミックス。甘さと清涼感のバランスで世界的に人気。',
  'adalya:lady killer':
    'メロン・マンゴー・ブルーベリーにミントを重ねたフルーツミックス。Love66と並ぶAdalyaの代表作。',
  'adalya:the two apples':
    'トルコ・Adalya流のダブルアップル。りんごの甘みにアニスの香りを効かせた伝統系フレーバー。',

  // Azure Gold Line
  'azure:hookah tobacco gold line blue mist':
    'ブルーベリーの甘酸っぱさにミントの清涼感を重ねた定番ミックス。Azure Gold Lineの人気銘柄。',
  'azure:hookah tobacco gold line white gummi bear':
    'パイナップル系のホワイトグミキャンディを再現した甘系フレーバー。Azure Gold Lineの人気銘柄。',

  // Tangiers — Cane Mint 系
  'tangiers:cane mint': TANGIERS_CANE_MINT,
  'tangiers:noir cane mint': TANGIERS_CANE_MINT,
  'tangiers:noir a cane mint': TANGIERS_CANE_MINT,

  // Darkside
  'darkside:supernova':
    '突き抜けるメンソールの超強清涼系。単体よりもミックスに清涼感を足す用途で広く使われるDARKSIDEの定番。',
}

// Editor's Selection の手書き短評を id フォールバックとして流用
const CURATED_NOTE_BY_ID = new Map<number, string>()
for (const pick of EDITORS_PICKS) {
  if (pick.note) CURATED_NOTE_BY_ID.set(pick.id, pick.note)
}

/**
 * FLAVOR_DESCRIPTIONS の参照キー。将来の生成スクリプトからも使えるよう公開。
 */
export function flavorDescriptionKey(manufacturer: string, productName: string): string {
  return `${brandSlug(manufacturer)}:${normalizeFlavorName(productName, manufacturer)}`
}

/**
 * フレーバーの説明を返す。見つからなければ `null` (UI 側で非表示にする)。
 */
export function getFlavorDescription(
  flavor: Pick<ShishaFlavor, 'id' | 'manufacturer' | 'productName'>
): string | null {
  const byName = FLAVOR_DESCRIPTIONS[flavorDescriptionKey(flavor.manufacturer, flavor.productName)]
  if (byName) return byName
  return CURATED_NOTE_BY_ID.get(flavor.id) ?? null
}

/**
 * `description` が空のフレーバーに既知の説明を埋めて返す。元データに
 * description がある場合はそちらを優先する (resolveFlavorImage と同じ流儀)。
 */
export function resolveFlavorDescription<
  T extends Pick<ShishaFlavor, 'id' | 'manufacturer' | 'productName'> & { description?: string },
>(flavor: T): T {
  if (flavor.description && flavor.description.trim() !== '') return flavor
  const description = getFlavorDescription(flavor)
  if (!description) return flavor
  return { ...flavor, description }
}
