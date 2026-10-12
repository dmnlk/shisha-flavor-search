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
  { id: 1911, note: 'スイス産DoobaccoのFrozen Lemon。レモンの鋭い酸みと清涼感が刺激的に交差するシトラス系。' },
  { id: 2669, note: '米国産FumariのSpiced Chai。シナモンとカルダモンが香る濃厚なインド式チャイ着想系。' },
  { id: 1657, note: 'ロシア産DarksideのCOSMO FLOWER。花のアロマを独自ブレンドで表現した個性派フローラル。' },
  { id: 3070, note: 'トルコ産JiBiARのTiramisu。濃いめのエスプレッソとマスカルポーネが重なるデザート系。' },
  { id: 1349, note: 'ヨルダン産ButaのBlueberry Cake。甘酸っぱいベリーとスポンジケーキの風味が交わる菓子系。' },
  { id: 3232, note: 'UAE産LayalinaのCHERRY COLA。さくらんぼの甘みとコーラの炭酸感が弾ける個性派フルーツ系。' },
  { id: 1044, note: '米国産Azure Gold LineのViva La Horchata。シナモン米ドリンク着想の独特な甘みが広がる一本。' },
  { id: 2978, note: 'ロシア産JentのHerbal Labrador Tea。野生ハーブ茶ベースの植物香豊かなアロマ系の珍品。' },
  { id: 4209, note: 'ロシア産SeberoのBlack Lemon Waffle。レモンの酸みとワッフルの焼き菓子甘みが重なる菓子系。' },
  { id: 4619, note: '米国産StarbuzzのBold Brownie。コクある濃厚チョコレートブラウニーの甘みが広がる定番デザート。' },
]
