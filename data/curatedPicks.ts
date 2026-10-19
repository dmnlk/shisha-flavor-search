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
  { id: 4772, note: '米国産TangiersのCane Mint。サトウキビ由来の清涼感とタバコのコクが融合する本格ミント系の代名詞。' },
  { id: 163, note: 'UAE産Al FakherのCardamom。中東の伝統スパイス、カルダモンの芳醇な香りを素直に凝縮した純粋な一本。' },
  { id: 2249, note: 'トルコ産DozajのBergamot Tea。ベルガモットの柑橘的な花香が茶葉の渋みに溶けるアールグレイ着想系。' },
  { id: 2260, note: 'トルコ産DozajのBlack Jamaican Rum。濃厚なラムの甘辛さにスパイスが重なるカリブ海着想の個性派。' },
  { id: 5418, note: 'ロシア産DeusのJasmine Pear。ジャスミンの繊細な花香とみずみずしい洋梨の甘みが穏やかに溶け合う。' },
  { id: 462, note: 'ヨルダン産Al WahaのBounty。バウンティチョコバー着想のミルクチョコとヤシの実が濃密に絡むデザート系。' },
  { id: 69, note: 'インド産AfzalのGingerelle。ジンジャーの刺激的な辛みと清涼感が際立つスパイシー系の珍品。' },
  { id: 3500, note: 'エジプト産NakhlaのClassic Mint。スペアミント主体のオーソドックスな定番で、ミント系の基準となる一本。' },
  { id: 2365, note: '米国産Eternal SmokeのAloha Nights。ハワイをテーマにした熱帯フルーツの甘みが広がるトロピカル系。' },
  { id: 3382, note: 'ヨルダン産MazayaのCoffee with Cardamom。コーヒーとカルダモンが交わる中東式コーヒーの風合いを再現した一本。' },
]
