/**
 * トップページ § 003 「Latest Additions」に載せる手選びフレーバー。
 *
 * shisha-update で新規フレーバーを取り込んだら、その回の追加分から見栄えの良いものを
 * 6 件選んでここを書き換える (手順は .claude/skills/shisha-update/SKILL.md)。
 *
 * - `id` は shishaData の id と一致させる。並び順がそのまま UI の表示順
 * - 画像が public/images/flavors/<id>.<ext> にあるものを選ぶ (無いと空のカードになる)
 * - ブランド・産地・系統が偏らないように選ぶ (同一ブランドは最大 2 件)
 * - 空配列にすると homeSections.getLatestFlavors が自動選定 (lastAddedIds の先頭) にフォールバックする
 */
export const LATEST_ADDITIONS: number[] = [
  5634, // Sapphire Crown MATCHA COCOS (ロシア)
  5667, // Tombacco Whiteline VANILLA (インドネシア)
  5625, // Debaj Green Lemon (UAE)
  5643, // Sapphire Crown WAFFLES (ロシア)
  5624, // Debaj Berry (UAE)
  5515, // SERBETLI ICE ACAI RASPBERRY (トルコ、前回から継続)
]
