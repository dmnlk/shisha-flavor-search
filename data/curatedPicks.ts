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
  { id: 4772, note: '米国産TangiersのCane Mint。ケインシュガー由来の甘みを帯びたミントが特徴で、愛好家の間で長年支持されるミント系の定番。' },
  { id: 1864, note: 'スイス産DoobaccoのCaipi。南米カクテル「カイピリーニャ」着想。ライムの酸みと甘みが爽やかに広がる珍しいカクテル系。' },
  { id: 3540, note: 'エジプト産NakhlaのMizo Cherry。百年超の老舗が手がけるチェリー系。強い甘みの中に自然な果実香が残るシンプルな仕上がり。' },
  { id: 5327, note: 'ロシア産MustHaveのEarl Grey。ベルガモットの柑橘香が際立つアールグレイを再現した、落ち着きのある茶系フレーバー。' },
  { id: 3251, note: 'UAE産LayalinaのJasmine。ジャスミンの清らかな花香を軸にした、シンプルかつ洗練されたフローラル系の一品。' },
  { id: 4602, note: '米国産StarbuzzのArabian Coffee。アラビカ豆の深いコーヒー香と上品な苦みが主体の珍しいコーヒー系フレーバー。' },
  { id: 202, note: 'UAE産Al FakherのGrape Mint。世界的シェアを持つブランドの看板フレーバー。ジューシーなグレープとスペアミントが溶け合うバランス型。' },
  { id: 1346, note: 'ヨルダン産ButaのBlack Peach。熟した桃の濃厚な甘みに深みが加わるバリアント。クリーミーな余韻が特徴的。' },
  { id: 4931, note: '米国産Tokyo ShishaのChai Masala。シナモン・カルダモン・ジンジャーを配した本格チャイ着想の複合スパイス系。' },
  { id: 496, note: 'ヨルダン産Al WahaのCactus Lemon。サボテンの水分感とレモンの酸みを組み合わせた独創的なライト系フレーバー。' },
]
