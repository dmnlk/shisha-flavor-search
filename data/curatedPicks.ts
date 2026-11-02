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
  { id: 4438, note: '米国産Social SmokeのJapanese Yuzu。柚子の爽やかな柑橘香を米国流に解釈した、国際的に珍しいシトラス系。' },
  { id: 2588, note: '米国産FumariのDark White Peach。白桃の果肉感ある甘みをダーク仕上げで深みを加えた、フルーティーな一本。' },
  { id: 4033, note: 'ヨルダン産Samurai BlondのAzuki。小豆の素朴な甘みを和菓子着想で再現した、国際的に珍しい和風デザート系。' },
  { id: 3137, note: 'ヨルダン産Khalil MaamoonのSpiced Tea。スパイスを纏った中東式紅茶の香り豊かな風合いが広がるティー系。' },
  { id: 1316, note: 'ロシア産BoncheのLavender。ラベンダーの淡い花香が穏やかに漂うフローラル系で、シンプルながら存在感がある。' },
  { id: 5327, note: 'ロシア産MustHaveのEarl Grey。ベルガモットの柑橘花香と紅茶の渋みが上品に溶け合うアールグレイ系。' },
  { id: 3911, note: 'ヨルダン産RommanのApple Cinnamon。リンゴの甘みにシナモンの温かいスパイシーさが重なる親しみやすい組み合わせ。' },
  { id: 1768, note: 'UAE産DebajのCactus。サボテン果実の甘酸っぱいジュースを思わせる、希少感のある個性派フルーツ系。' },
]
