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
  { id: 364, note: 'UAE産Al FakherのTwo Apples。ダブルアップルの甘い芳香が広がる中東シーシャの基点とも言える定番古典。' },
  { id: 4776, note: '米国産TangiersのHorchata。メキシコのライスミルク飲料に着想した甘くまろやかな異色のデザート系。' },
  { id: 5042, note: '米国産TrifectaのCucumber Mojito。清涼感あるキュウリとミント、ライムが混在する個性的なカクテル系の異色作。' },
  { id: 3012, note: 'トルコ産JiBiARのCardamom。芳醇なカルダモン香が一本立ちする、スパイス系の剛直な純品。' },
  { id: 1341, note: 'ヨルダン産ButaのBanana Ice Cream。熟したバナナとアイスクリームのミルク感が溶け合うデザート系。' },
  { id: 5400, note: 'ロシア産DEUSのBlackberry Wine。ブラックベリーを赤ワイン風に昇華した甘酸っぱいフルーツ系。' },
  { id: 1633, note: 'ロシア産DarksideのBasil Blast。フレッシュバジルの青々しい植物香が前面に出る他に類を見ないハーブ系の異色作。' },
  { id: 85, note: 'インド産AfzalのLychee。ライチ特有のジューシーな甘みと花香を率直に再現したフルーツ系の一本。' },
  { id: 41, note: 'トルコ産AdalyaのJamaican Vibes。カリブ着想のトロピカルフルーツが陽気に炸裂するサマー系。' },
  { id: 1778, note: 'UAE産DebajのCinnamon Cake。シナモンの辛みとスポンジケーキの甘みが折り重なる中東発のスパイスデザート系。' },
]
