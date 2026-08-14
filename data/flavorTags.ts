// ビルド時に scripts/build-data.ts が生成するフレーバーid → タグスラッグのマップ。
// (dev / build / test / typecheck が build-data を前段実行するため常に存在する)

import type { FlavorTagSlug } from './flavorTagTaxonomy'
import flavorTagsJson from './generated/flavorTags.json'

const FLAVOR_TAG_MAP = flavorTagsJson as Record<string, FlavorTagSlug[]>

/** フレーバーidのタグを返す。未タグの項目は空配列。 */
export function getFlavorTags(id: number): FlavorTagSlug[] {
  return FLAVOR_TAG_MAP[String(id)] ?? []
}

/**
 * フレーバーに `tags` を付与して返す。APIレスポンス整形用
 * (resolveFlavorImage と同じ「派生情報の後付け」パターン)。
 */
export function attachFlavorTags<T extends { id: number }>(flavor: T): T & { tags: FlavorTagSlug[] } {
  return { ...flavor, tags: getFlavorTags(flavor.id) }
}
