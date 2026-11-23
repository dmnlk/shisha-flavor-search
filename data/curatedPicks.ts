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
  { id: 2699, note: '米国産FumariのWhite Peach。白桃特有の柔らかな甘みと花香を率直に引き出した、クリーンなフルーツ系の代表作。' },
  { id: 3510, note: 'エジプト産NakhlaのEl Basha Cappuccino。モカ調のコーヒー香とほどよい甘みが溶け合うコーヒー系の一本。' },
  { id: 3137, note: 'ヨルダン産Khalil MaamoonのSpiced Tea。紅茶にスパイスが溶け込む中東式茶着想の、香り高く奥行きのある一本。' },
  { id: 4185, note: 'ロシア産SeberoのBarberry。バーベリー（メギ）特有の鋭い酸みと微かな渋みが際立つ、他に類を見ない希少なベリー系。' },
  { id: 5573, note: 'インドネシア産TombaccoのTropical Juice。東南アジア発の複数トロピカルフルーツが一体となった爽やかで鮮烈なフルーツ系。' },
  { id: 1633, note: 'ロシア産DarksideのBasil Blast。フレッシュバジルの青々しい植物香が前面に出る他に類を見ないハーブ系の異色作。' },
  { id: 4519, note: '米国産Social SmokeのMango Habanero。完熟マンゴーの甘みにハバネロのスパイシーな刺激が絡む、大胆な甘辛フルーツ系。' },
  { id: 1864, note: 'スイス産DoobaccoのCaipi。南米カクテル・カイピリーニャに着想したライムの酸みと甘みが弾けるカクテル系の異色作。' },
  { id: 2329, note: 'トルコ産DozajのPassion Fruit。パッションフルーツ特有の強烈な甘酸っぱさとトロピカルな香りを余さず再現したフルーツ系。' },
]
