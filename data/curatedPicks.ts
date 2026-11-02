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
  { id: 2567, note: '米国産FumariのBlueberry Muffin。完熟ブルーベリーの甘酸っぱさに焼きたてマフィンの香ばしさが重なる定番ベーカリー系。' },
  { id: 4418, note: '米国産Social SmokeのHong Kong Milk Tea。濃厚な紅茶と練乳が絡む香港式ミルクティー着想のクリーミーな甘み系。' },
  { id: 5042, note: '米国産TrifectaのCucumber Mojito。清涼感あるキュウリとミント、ライムが混在する個性的なカクテル系の異色作。' },
  { id: 3911, note: 'ヨルダン産RommanのApple Cinnamon。林檎の自然な甘みにシナモンスパイスが絡む親しみやすいフルーツスパイス系。' },
  { id: 1633, note: 'ロシア産DarksideのBasil Blast。フレッシュバジルの青々しい植物香が前面に出る他に類を見ないハーブ系の異色作。' },
  { id: 4033, note: 'ヨルダン産Samurai BlondのAZUKI。和菓子的な小豆の甘みを再現した希少なアジア系変わり種。' },
  { id: 1305, note: 'ロシア産BoncheのClove。クローブ固有の強い芳香と甘みが煙に乗るシンプルかつ骨格のあるスパイス系純品。' },
  { id: 1185, note: 'ヨルダン産BangbangのBlack Russian。コーヒーリキュールとウォッカのカクテルに着想した甘辛い個性派。' },
  { id: 904, note: '米国産AzureのMoroccan Tea。甘みとスペアミントが重なる北アフリカ式甘茶着想の爽やかな茶系フレーバー。' },
  { id: 1778, note: 'UAE産DebajのCinnamon Cake。シナモンの辛みとスポンジケーキの甘みが折り重なる中東発のスパイスデザート系。' },
]
