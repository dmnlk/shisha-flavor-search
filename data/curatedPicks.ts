/**
 * 編集部による手選びフレーバー。トップページ § 005 「Editor's Selection」で使用。
 *
 * - `id` は shishaData の id と一致させる
 * - `note` は 1 行の日本語短評 (省略可。無いときはカードのみ表示)
 * - 画像が public/images/flavors/<id>.<ext> にあるもの優先で選ぶと見栄えが良い
 * - 並び順がそのまま UI の表示順
 */
export interface CuratedPick {
  id: number
  note?: string
}

export const EDITORS_PICKS: CuratedPick[] = [
  { id: 134, note: 'Al Fakher の原点。りんごは全ての基準点。' },
  { id: 1603, note: 'ダークリーフ × シリアルの異色作。甘さの底に焦げが走る。' },
  { id: 2531, note: 'Fumari のフレッシュ製法が映えるトロピカル。' },
  { id: 4003, note: '国産 Samurai Blond のシグネチャ。アーモンドの香ばしさ。' },
  { id: 4745, note: 'Tangiers 2005 復刻。ブルーベリーの酸の立ち方が別物。' },
  { id: 2218, note: 'DOZAJ のパンチが効く、ベリー系の入口。' },
  { id: 5014, note: 'Trifecta のブロンド葉、りんご軸の定番。' },
  { id: 2342, note: 'Eternal Smoke の夜向けブレンド。' },
  { id: 3887, note: 'Romman のハンドメイド 125g 缶。アーモンドの厚み。' },
  { id: 1313, note: 'Buta のハニーベース。アサイーの抜け感が良い。' },
]
