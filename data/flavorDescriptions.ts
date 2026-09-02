import { normalizeFlavorName } from '../lib/tags/flavorTagger'
import { brandSlug } from '../lib/utils/brandNormalizer'
import type { ShishaFlavor } from '../types/shisha'

import { EDITORS_PICKS } from './curatedPicks'

/**
 * フレーバー詳細ページ「Tasting note」用の日本語説明。
 *
 * - キーは `flavorDescriptionKey(manufacturer, productName)` の結果
 *   (`brandSlug` + `normalizeFlavorName` の複合キー)。同一フレーバーの
 *   サイズ違い・表記ゆれ id をまとめて 1 エントリでカバーする。
 * - 公知のテイスト情報に基づく記述のみ。確信が持てないフレーバーは
 *   このファイルに載せず未記載のままにする方針 — 根拠のない捏造をしないこと。
 * - 大半のフレーバーには説明が無い前提。呼び出し側 UI は `null` のとき
 *   セクションごと非表示にする (brandDescriptions.ts と同じ扱い)。
 * - トップページ Editor's Selection の手書き `note` (curatedPicks.ts) は
 *   id フォールバックとして再利用する。名前キーのエントリが優先。
 *
 * Client-safe: fs 非依存。ただし詳細ページはサーバー側で解決して props で渡す。
 */

const AL_FAKHER_TWO_APPLES =
  'りんごにアニス(八角様)の薬草的な香りを重ねた中東伝統のダブルアップル。Al Fakherの看板であり、シーシャの定番中の定番。'
const AL_FAKHER_TWO_APPLES_MINT =
  'ダブルアップルにミントの清涼感を加えたバリエーション。アニスの甘い香りと冷涼な後味の組み合わせ。'
const TANGIERS_CANE_MINT =
  'ダークリーフのTangiersを代表するピュアミント。強い清涼感とタバコ感を併せ持ち、単体でもミックスのベースでも定番。'

export const FLAVOR_DESCRIPTIONS: Record<string, string> = {
  // Al Fakher — Two Apples 系 (サイズ・表記ゆれをキー別にカバー)
  'al-fakher:two apple': AL_FAKHER_TWO_APPLES,
  'al-fakher:two apples': AL_FAKHER_TWO_APPLES,
  'al-fakher:shisha molasses two apple': AL_FAKHER_TWO_APPLES,
  'al-fakher:two apples mint': AL_FAKHER_TWO_APPLES_MINT,
  'al-fakher:two apples with mint': AL_FAKHER_TWO_APPLES_MINT,
  'al-fakher:shisha molasses two apples with mint': AL_FAKHER_TWO_APPLES_MINT,

  // Adalya
  'adalya:love66':
    'パッションフルーツ・スイカ・メロンにミントを効かせたAdalyaの看板ミックス。甘さと清涼感のバランスで世界的に人気。',
  'adalya:lady killer':
    'メロン・マンゴー・ブルーベリーにミントを重ねたフルーツミックス。Love66と並ぶAdalyaの代表作。',
  'adalya:the two apples':
    'トルコ・Adalya流のダブルアップル。りんごの甘みにアニスの香りを効かせた伝統系フレーバー。',

  // Azure Gold Line
  'azure:hookah tobacco gold line blue mist':
    'ブルーベリーの甘酸っぱさにミントの清涼感を重ねた定番ミックス。Azure Gold Lineの人気銘柄。',
  'azure:hookah tobacco gold line white gummi bear':
    'パイナップル系のホワイトグミキャンディを再現した甘系フレーバー。Azure Gold Lineの人気銘柄。',

  // Tangiers — Cane Mint 系
  'tangiers:cane mint': TANGIERS_CANE_MINT,
  'tangiers:noir cane mint': TANGIERS_CANE_MINT,
  'tangiers:noir a cane mint': TANGIERS_CANE_MINT,

  // DARKSIDE — htreviews.org と hookah-reviews.com のレビューを要約 (2026-08 時点)。
  // 日本流通品は輸出版 Core ライン (htreviews のロシア国内版とはライン表記が異なる場合がある)
  'darkside:admiral acbar cereal':
    'ベリー入りオートミール粥を再現したクリーミーなデザート系。htreviewsでは「何でも上に乗せられる伝説的ミックスベース」と評される一方、ソロでは弱く香りが飛びやすいとの指摘も。',
  'darkside:bananapapa':
    '完熟バナナの濃厚な甘さ。htreviewsではバナナガム的でソロだと甘すぎとされ、イチゴ等と合わせるデザートミックス用の定番。hookah-reviews.comでは71点で「後味のエグみが控えめで地味に良く出来ている」。',
  'darkside:barvy citrus':
    'オレンジ・レモン・グレープフルーツのシトラスミックス。htreviewsでは低評価が優勢な癖の強い銘柄で (リピート意向13%)、乾いた皮の苦みを好むかで評価が分かれる。',
  'darkside:barvy orange':
    'オレンジジュースを再現した明るい柑橘系。htreviewsでは「果汁感ある明るいオレンジ」派と「皮っぽく薄い」派で賛否。ミントや針葉樹系とのミックス推奨が多い。',
  'darkside:basil blast':
    '摘みたてグリーンバジルのフレッシュな香り。htreviewsでは「本物のバジルそのもの」「バジル系の頂点」と絶賛される高評価銘柄 (4点以上94%)。非常に濃厚で1〜2割をミックスに挿す使い方が定番。',
  'darkside:bassberry':
    '花のニュアンスを持つエルダーベリー (ニワトコ)。htreviewsでは蜂蜜っぽい甘さで少量でもミックスに存在感が出るとされ、チャイや森ベリー系と好相性。ソロは単調との声が多い。',
  'darkside:bergamonstr':
    '名前どおり「モンスター級」に濃厚なベルガモット。htreviewsでは強い渋みでソロはほぼ不可とされ、5〜15%を紅茶系ミックスに挿すのが定石 (リピート意向89%)。',
  'darkside:blackberry':
    '摘みたてブラックベリーの甘い香り。htreviewsでは「石鹸的」との酷評と「自然な甘酸っぱさ」で評価が二極化。hookah-reviews.comでは66点で「クセなく万人受けする珍しいブラックベリー単体もの」。',
  'darkside:blackcurrant':
    'カシス (黒スグリ) の渋みある香り。htreviewsでは「カシスジャムそのもの」と評され、ソロ・ミックス両用で持続も良好と好意的な声が多数。',
  'darkside:bloody orange':
    'シチリアオレンジの甘さ控えめな柑橘系。htreviewsでは序盤の甘さから15〜20分でピールの苦みに移る変化が語られ、ミックス適性が高評価 (リピート意向90%)。',
  'darkside:blueberry blast':
    '森のブルーベリー系。htreviewsでは評価が割れるが、hookah-reviews.comでは66点で「中東メーカー風のサッパリ系ブルーベリー+軽いフローラル」と評される。',
  'darkside:bounty hunter':
    'クリーミーなトロピカルココナッツ。htreviewsではソロは薄く退屈とされるが、ピニャコラーダや焼き菓子系ミックスの素材として高評価。hookah-reviews.comでは79点で「ココナッツミルクそのものの無難で高水準な出来」。',
  'darkside:breaking red':
    '果汁から皮・種の渋みまで再現した本格ザクロ。htreviewsでは絶賛が多くソロ・ミックス両対応 (4点以上78%)。香りが強くミックスでは1〜2.5割で十分とされる。',
  'darkside:c r e a m s o d a':
    'バニラを効かせたクリームソーダ系。htreviewsではクリーミーなバニラ基調が好評 (リピート意向85%) だが「炭酸感は薄い」との声も。コーラ系と合わせるミックスが推される。',
  'darkside:cherry rocks':
    'チェリーキャンディの濃厚な甘酸っぱさ。htreviewsでは「探していた最高のチェリー」と人気が高く (評価165件・4点以上83%)、コーラや炭酸系とのミックスが定番。hookah-reviews.comでは71点で「バナナ香がチェリーの刺激を丸めている」と分析。',
  'darkside:code cherry':
    '完熟チェリーの甘酸っぱさがコンセプト。htreviewsでは「化学的」「種・アーモンド感が支配的」と酷評が目立ち、同社Cherry Rocksを勧める声が多い。hookah-reviews.comでは63点で「無難だが凡庸」。',
  'darkside:cosmo flower':
    'ベリーの後味を伴うフローラル系。htreviewsではブルーベリー+ライラック様の花香で賛否が分かれるが、hookah-reviews.comでは78点で「DSのベリー系で一番の当たり」と高評価。',
  'darkside:cosmos':
    'カクテル「コスモポリタン」を再現したライム+クランベリー。htreviewsでは「ミックスに酸味と捻りを加えるDS屈指の名作」と「洗剤のよう」で評価が二極化する。',
  'darkside:crystal grape':
    '濃縮ジュース級に濃く甘い白ブドウ。htreviewsでは最初の10分は攻撃的なほど強烈とされ (4点以上74%)、ミックスでは15〜20%に抑えないと他を潰すと言われる。',
  'darkside:cyber kiwi':
    'キウイスムージーの甘酸っぱさがコンセプト。htreviewsでは「薄い・果肉感がない」という不満が支配的な低調銘柄で、ミックスの脇役向きとされる。過熱すると辛くなるとの指摘も。',
  'darkside:dark icecream':
    'チョコチップ入りアイスがコンセプト。htreviewsでは「実際はミント+チョコで、クリーム感よりメントールが前に出る」という指摘が支配的で賛否が割れる。',
  'darkside:dark passion':
    '甘酸っぱいパッションフルーツ。htreviewsでは「マラクヤが欲しい時の定番」とミックス適性が高評価 (4点以上84%)。hookah-reviews.comでは78点で「輪郭がハッキリした甘めのパッションフルーツ単体でシンプルかつ良い出来」。',
  'darkside:darkside cola':
    'レモンスライス入りコーラ。htreviewsでは「コーラグミ」と形容される再現度でソロ・ミックス両対応の人気銘柄 (評価177件・4点以上80%)。SupernovaやLemon Blastとの定番ミックスが知られる。',
  'darkside:darksupra':
    '日本の煎茶にジャスミンを効かせた緑茶系。htreviewsでは再現度が高くミックスのベースとして理想的と評され、リピート意向89%。口が乾きやすいためジューシー系と割るのが推奨される。',
  'darkside:deep blue sea':
    'クリームのニュアンスを持つシュガークッキー系。htreviewsでは「ミルクに浸したクッキー」と好評で、ベリーや柑橘と合わせるデザートミックスのベースとして優秀とされる。',
  'darkside:desert eagle':
    'サボテン (カクタス) の甘さと渋い後味。htreviewsではキウイ+青リンゴ様の草っぽさをミックスに足す名脇役と評され (リピート意向86%)、ライムやレモネード系と好相性。',
  'darkside:falling star':
    'マンゴーとパッションフルーツのトロピカルカクテル系。htreviewsでは「外れなしの鉄板トロピカルミックス」と好意的。hookah-reviews.comでは73点で「丸みのある甘さの穏やかなマンゴー系」。',
  'darkside:fruittallity':
    '森のベリー果汁入りソフトキャンディ (フルテラ風)。htreviewsではキャンディの再現度が好評だが甘ったるさへの批判もあり賛否両論。少量でも香りが出るためミックス向き。hookah-reviews.comでは65点。',
  'darkside:fruity dust':
    'ピタヤ (ドラゴンフルーツ) 主体のエキゾチックフルーツ系。htreviewsでは「ソロではほぼ無味」との声が支配的でミックスの角取り用途向きとされる一方、「市場最高のピタヤ」との絶賛も。',
  'darkside:generis raspberry':
    '熟したラズベリーの繊細な甘さ。htreviewsでは「可もなく不可もない基本のラズベリー」評が主流でミックス向き。hookah-reviews.comでは57点で「後味に発酵茶のような独特のキレが残る変わった作り」。',
  'darkside:glitch ice tea':
    '冷たいピーチティー系。htreviewsでは「紅茶感はあるがピーチが弱い」という声と「ネスティーそっくり」という絶賛が混在。ピーチや蜂蜜系を重ねるミックスが推される。',
  'darkside:goal':
    'ブルーベリーエナジードリンク+軽い清涼感。2018年ロシアW杯限定から定番化した銘柄で、htreviewsではブルーベリーは感じるがエナジードリンク感が弱いという指摘が多く賛否二分。',
  'darkside:grape core':
    '熟したブドウ果肉のグレープ系。htreviewsでは「市場最高峰」と「草っぽくて弱い」に真っ二つ。ベリー・ミント・コーラ系と好相性とされる。hookah-reviews.comでは55点と辛口。',
  'darkside:green beam':
    'フェイジョアを再現した希少なグリーン系。htreviewsでは再現度は好評だが好みが分かれ、少量ミックス用途が推される。hookah-reviews.comでは67点で「青臭さを少量で足すミックス用途に有用」。',
  'darkside:green mist':
    'アルコールのノートを効かせたシトラスカクテル。htreviewsでは評価が低め (リピート意向29%) の上級者向けで、ジントニック風に5〜10%だけミックスに足す使い方なら有用とされる。',
  'darkside:guava rebel':
    '軽い渋みを添えたグアバ果肉。htreviewsでは「草っぽく甘いグアバ」という中庸評価が主流で、グアバを主役にしたいミックス (コーラ・ベリー・柑橘) 向き。',
  'darkside:honey dust':
    '百花蜂蜜の甘さにかすかな渋み。htreviewsでは花蜂蜜の再現度が高評価 (リピート意向100%) だがソロでは甘すぎとされ、茶系・ナッツ・ベリーとのミックスに2割以下で使うのが推奨される。',
  'darkside:ice granny':
    'グラニースミス青リンゴ+ほのかな清涼感。htreviewsでは「凡庸だが手堅い」評。hookah-reviews.comでは72点で「駄菓子の青リンゴガムのようなクセのない万人受け系」。',
  'darkside:kalee grapefruit 2 0':
    'グレープフルーツの果肉と皮の苦み・渋みを再現したリニューアル版。htreviewsではシトラスミックスの主軸として好評 (リピート意向88%)。',
  'darkside:kashmir goa java':
    'グアバの渋みにインドスパイスの後味を効かせた限定系。htreviewsではスパイスは期待通りだが濃度が物足りないという指摘が繰り返され、ピーチやマンゴーと合わせるミックス向き。',
  'darkside:killer milk':
    '練乳の濃厚な甘さ。htreviewsではラズベリーと合わせる「ピンクミルク」などデザートミックスにクリーミーさを足すベース素材として定評。ソロは激甘で不評が多い。',
  'darkside:lemonblast':
    '熟したレモンの酸味とほのかな苦み。htreviewsでは「市場屈指の模範的レモン」と酸味担当のミックス素材として高評価。hookah-reviews.comでは77点で「後味にラムネ菓子感のあるクセのないレモン」。',
  'darkside:mango lassi':
    '完熟マンゴーの濃厚な甘さ (旧版)。htreviewsでは「市場最高の完熟マンゴー」と「未熟で草っぽい」で真っ二つ。名前に反しラッシー感は無いという点は共通認識で、ミックス推奨。',
  'darkside:mango lassi 2 0':
    '旧Mango Lassiのリニューアル版。htreviewsでは鮮やかで非常に甘いマンゴーと安定した評価 (4点以上85%) で、ソロだと甘すぎるためピーチやパイナップルで割るミックスが推奨される。',
  'darkside:mary jane 2 0':
    'DARKSIDEのハーブ系の再始動版。htreviewsでは実際の味は「刈りたての芝生」「スイバ似の甘い草」とされ、ハーブ/グリーン系ミックスに渋みと厚みを足す素材として好評。',
  'darkside:needls':
    'モミ・松の針葉樹系という個性派。htreviewsでは「市場最高クラスのモミ」としてミックス素材の定番 (評価200件・5点47%・リピート意向94%)。みかん8:本品2のような使い方が語られる。',
  'darkside:nordberry':
    '冷やしたクランベリーモルス (果汁ドリンク) 系。htreviewsでは軽い苦みを「一滴」足すミックス用途に向くとされるが、香りが15〜20分で消えるという不満も。hookah-reviews.comでは55点。',
  'darkside:pear':
    '洋梨レモネードの甘いアロマ。htreviewsでは「洋梨ソーダ的」でミックス向きと賛否が割れる。hookah-reviews.comでは77点で「皮と実の境目のような微かな渋みがコクを生む独特な洋梨」と評価。強火だと渋みが出るため弱めの火力推奨。',
  'darkside:pineapple pulse':
    'ジューシーなパイナップル。htreviewsではリピート意向96%と支持される一方「缶詰シロップ的で酸味不足」との指摘もあり、ソロは単調でミックス向きとの評が多い。',
  'darkside:polar cream':
    'ピスタチオアイスクリーム系。htreviewsではナッツ+クリーム+清涼感の構成で評価が分かれる。hookah-reviews.comでは77点で「ピスタチオミルクセーキのような再現度」、陶器ファンネル推奨。',
  'darkside:pomelow':
    '甘いポメロ (ブンタン) の柑橘系。htreviewsでは「苦み控えめの甘いグレープフルーツ似」でソロは地味、ミックスで映えるという評価でほぼ一致 (4点63%)。',
  'darkside:raf in the jungle':
    'オレンジピール添えラフコーヒーのクリーミーチョコ系。htreviewsでは「ミルクコーヒーは感じるがオレンジはほぼ無い」との指摘が多数派で、デザート好きが試す一本という位置づけ。',
  'darkside:red alert':
    '蜂蜜メロンのノートを効かせたスイカドリンク系。htreviewsでは実態はスイカ主体とされ、「まともなスイカが少ない市場では最良クラス」という消極的支持が多い (リピート意向86%)。',
  'darkside:red rush':
    'ロシアの駄菓子バルバリス飴を再現した濃厚な甘さ。htreviewsでは「あの飴1:1」と再現度への称賛でほぼ一致し (リピート意向91%)、ソロ・ミックス両用の定番。',
  'darkside:red tea':
    'ハイビスカスティー (カルカデ) のスパイシーな赤い紅茶系。htreviewsではソロでは弱く、赤ベリー系と合わせるミックス向きが定番評。長時間だとシナモンだけが残るとの指摘も。',
  'darkside:red zeppelin':
    '赤グーズベリーの甘酸っぱさと渋み。htreviewsでは「グーズベリーに似ていない」が大勢の癖の強い一本で、草っぽさや渋みをミックスに足す前提の銘柄とされる。',
  'darkside:retro apple':
    '旧式ダブルアップル香料へのオマージュ的な赤リンゴ。htreviewsでは果肉より皮寄りでアニスの残り香を感じるという指摘が頻出。ソロよりミックス向き。',
  'darkside:salbei':
    '摘みたてセージの葉の薬草系。htreviewsでは「のど飴・薬草そのもの」と再現度への評価が高く (4点以上84%)、非常に強力なため5〜10%の少量ミックス専用が定説。',
  'darkside:space jam':
    'シロップ漬けイチゴジャム系。htreviewsでは「ケミカルでイチゴがいない」という批判が目立ち、高温だとタバコ臭に転ぶため熱控えめ+デザート系ミックス推奨。',
  'darkside:starlime':
    '包み込むようなライム果汁。htreviewsでは皮の苦みや化学臭が控えめな素直なライムとして高評価 (4点67%・リピート意向93%)。ソロ・ミックス両用。',
  'darkside:strawberry light':
    '庭イチゴの繊細な甘さ。htreviewsでは「弱く薄い」と酷評が主流だが、hookah-reviews.comでは対照的に73点で「ケーキ用イチゴピューレ的な丸い甘さで良くできている」と好意的。',
  'darkside:supermint':
    '甘いペパーミント+冷感。htreviewsではミントガム系として好評で、少量ミックス向き。入れすぎやソロだと苦みが出るとされる。',
  'darkside:supernova':
    '「突き抜ける冷たさ」が代名詞のDARKSIDEを代表する超強メンソール。htreviewsでは冷感ブースターの定番として評価246件・5点56%を集め、葉1〜2枚をミックスに添える使い方が標準とされる。',
  'darkside:sweet comet':
    'クランベリーにバナナを添えたベリー系。htreviewsでは「バナナはほぼ感じずクランベリー主体」との声が大勢。hookah-reviews.comでは62点で「再現度は高いが好みが分かれる」。',
  'darkside:top gum':
    'イチゴとスイカのチューインガム系。htreviewsでは「駄菓子ガムの再現度が高い」と好評が主流 (リピート意向70%)。香りが30〜40分で飛ぶとの不満もあり、ミックスの甘み足しに便利とされる。',
  'darkside:torpedo':
    'メロンとスイカのクラシック系。htreviewsでは酷評が多い一方「昔からの定番メロンとしてカルト的存在」という擁護も。hookah-reviews.comでは69点で、渋みが出やすいため弱めの火加減推奨。',
  'darkside:tropic ray':
    'ココナッツとパイナップルのカリブ風カクテル (ピニャコラーダ) 系。htreviewsではクリーミーなココナッツ優勢でミックスのベース向き。hookah-reviews.comでは75点で「王道ミックスの無難で高水準な出来」。',
  'darkside:virgin melon':
    '砂糖メロンの柔らかい甘さ。htreviewsでは「昔ながらのメロン」という位置づけで、レモンやSupernovaと合わせると化けるという報告が複数ある。',
  'darkside:virgin peach':
    '蜂蜜桃のベルベットのような味わい (旧版)。htreviewsでは「地味でジューシーさに欠ける」という評が支配的で、メーカー自身が改良版2.0を出した経緯がレビューでも語られる。',
  'darkside:virgin peach 2 0':
    '果肉と果汁感を強化した桃のリニューアル版。htreviewsでは「旧版から大幅改善された甘くジューシーな桃」と高評価 (4点以上90%・リピート意向97%) で、ソロ・ミックス両対応。',
  'darkside:waffle shuffle':
    'クリーミーなレモンワッフルのデザート系。htreviewsでは再現度への高評価が多数だが賛否も割れる。熱を上げるとレモンが焦げ味に転ぶため熱管理注意。練乳系と合わせると「レモンパイ」になるとの声。',
  'darkside:wild forest':
    '野イチゴ主導の森ベリーミックス。htreviewsではミックスのベリーベースとして優秀とされ (4点80%)、hookah-reviews.comでは69点で「クセなく目立った欠点も無い定番ベリーMix」。',
  'darkside:wildberry':
    '深い森のベリー系。htreviewsでは「どのベリーか判別できない無難な森ベリー」で一致し、ソロは退屈だがミックスのベリーベースとして優秀 (リピート意向92%)。',
  'darkside:yagoda malina':
    '甘酸っぱいラズベリーのジャム的な再現。htreviewsでは「化学臭のない甘酸っぱさで旧Raspberryから大幅改善」と高評価 (4点以上92%・リピート意向97%)。ソロ・ミックス両対応で耐熱性も良好。',

  // DOGMA — htreviews.org の公式説明とレビュー/コメント欄の傾向を要約 (2026-08 時点)
  'dogma:apple punch':
    'スパイスを効かせた焼きリンゴの菓子系アロマ。htreviewsのレビューではシナモン入りアップルケーキやシュトゥルーデルに例える声が多く、クリーム系・生地系フレーバーとのミックス適性が好評。',
  'dogma:bashkir honey':
    'バシコルトスタン産オーガニック蜂蜜でベースを煮た実験ライン。htreviewsでは「市場最高のハチミツフレーバー」との賛辞が並び、べたつかない花の蜂蜜の香りと紅茶・レモン・ベリー系ミックスへの強さが高評価 (リピート意向96%)。',
  'dogma:black orchid':
    '香水着想「シガーパフューム」ラインの一本。カシスやイランイラン、バニラ・ムスクを重ねたTom Fordの同名香水を思わせる濃厚なフローラルで、htreviewsでは単体では強すぎるため1〜2割だけミックスに使う楽しみ方が定番とされる。',
  'dogma:chinese pear':
    '渋みを残した甘すぎない枝付きの梨がコンセプト。htreviewsでは「キャンディではなく本物の梨」と香りの自然さが好評で、吸い進めるとジャム様に甘さが増す。桜や蜂蜜系とのミックス報告も多い。',
  'dogma:crimean lavender':
    'ラベンダーとシガーリーフを織り合わせた実験ライン。htreviewsでは化学臭のないナチュラルな花の香りが絶賛され (5点評価71%)、2〜3割をミックスに混ぜる使い方が特に好評。',
  'dogma:cubita columbia':
    'コロンビア産シガーリーフ (セコ) のノンアロマモノソート。ラベル記載のノートは革・レモン・白樺の樹液で、htreviewsでもノートどおりの味と再現度が好評。マイルドでノンアロマ入門にも向く。',
  'dogma:guerlinade for him':
    'ジャスミンやベチバー、サンダルウッドを重ねた男性香水着想の一本。htreviewsでは「男性用コロンそのもの」と好みが真っ二つに割れ、ウイスキー系や洋梨系ミックスに1〜2割加えるスパイス使いが多数派。',
  'dogma:gummi bears':
    '白いグミベアを再現した甘酸っぱいデザート系。htreviewsでは評価が割れており、熱に非常に弱く低温運用が必須とされる一方、ベリー系・レモン系とのミックスでは好評。',
  'dogma:habano garcia':
    'コロンビア産シガーリーフのノンアロマモノソート。ノートはゼフィール (マシュマロ菓子)・バニラ・カシスで、ライン中でも軽い部類。htreviewsではバニラ様の甘さとクリーミーさが好評で、ノンアロマ入門向きとされる。',
  'dogma:k t broadleaf':
    '米国産コネチカット・ブロードリーフ (2019年収穫・5年熟成) のノンアロマモノソート。ノートは胡椒・ウイスキー・ヘーゼルナッツ。htreviewsでは序盤の胡椒からウイスキー樽様の燻香への変化が語られ、十分な予熱が必須とされる。',
  'dogma:lemon drops':
    '吐息に酸味が残る甘いレモンキャンディ。htreviewsでは「昔ながらのレモンキャンディそのもの」と再現度への称賛が圧倒的で、リピート意向98%とブランド屈指の高評価。弱火ではキャンディ、高火力ではレモンの皮が前に出る。',
  'dogma:mata fina':
    'ブラジル産の著名品種マタ・フィナ (5年熟成) のノンアロマモノソート。ノートは栗・カルダモン・コーヒー。htreviewsでは序盤のカルダモンとナッツ感が20〜30分でコーヒーの苦みへ移る時間変化が好評。',
  'dogma:olor carbonell':
    'ドミニカ産オロール種 (3年熟成) のノンアロマモノソート。ノートはザクロの皮とチェリーウッド。htreviewsでは「DOGMAのノンアロマで一番おいしい」との声もある人気銘柄で、軽めなので初心者やミックス使いにも推される。',
  'dogma:piloto cubano':
    'キューバ由来の古典品種ピロート・クバーノをドミニカで栽培したノンアロマモノソート (3年熟成)。ノートはダークウーロン茶・トネリコ・チェリー。htreviewsでは濃い茶の渋みと木質感が語られ、ミックスのボディ足しに理想的との評が多い。',
  'dogma:play':
    'ピーチや白い花、バニラを重ねた繊細な香水着想の一本。htreviewsでは「香水ライン入門に最適」とされ、リピート意向96%とライン内で最も支持が高い。フルーツ・ベリー系とのミックス耐性も高い。',
  'dogma:pure dogma':
    'ドミニカ・インドネシア・カメルーンのシガーリーフを合わせたDOGMAのノンアロマベースそのもの。htreviewsでは「ノンアロマ入門に最適」と高評価が集中し、木や革、コーヒーの風味が語られる。ミックスに3割ほど混ぜるブースター用途も定番。',
  'dogma:raspberry compot':
    'ラズベリーコンポートを再現したベリー系。htreviewsでは化学臭のないナチュラルな甘さと「ジャムではなくコンポート」の軽やかさが称賛され、リピート意向98%。香りが飛びやすく熱管理はシビアとされる。',
  'dogma:sakura':
    'ドリンクのニュアンスを伴う桜の繊細なアロマがコンセプト。htreviewsでは「花のニュアンスを持つチェリー」として評され、後半にアーモンド様の風味が出るという声も。ソロよりミックス向きという評価が多い。',

  // MustHave — htreviews.org と hookah-reviews.com のレビューを要約 (2026-08 時点)
  'musthave:alova':
    'ピンクグアバとアロエを合わせたジューシーなミックス。htreviewsでは甘いグアバにアロエのハーブ感が添うと好評で、ソロ・ミックス両用 (リピート意向87%)。ベリー系やレモネード系との組み合わせが推される。',
  'musthave:cucunade':
    'きゅうりシロップにレモン果肉とペパーミントを合わせたキュウリレモネード。htreviewsでは「実質レモネードでミックス向き」との評が主流。hookah-reviews.comでは強めのウリ香+ライムと評され、夏のミックスのキレ出しに推される。',
  'musthave:earl grey':
    'ベルガモットを効かせたクラシックな紅茶フレーバー。htreviewsでは「市場のアールグレイ系でトップ級」と絶賛が並ぶ高評価銘柄 (5点評価52%・リピート意向96%)。ソロではやや渋く、ティーミックスのベースとして人気。',
  'musthave:honey holls':
    '蜂蜜の甘さに強い清涼感を合わせたハニーのど飴系。htreviewsでは蜂蜜の再現度が高い一方ソロでは甘さと冷えが強いとされ、ミックス添加用が主流。hookah-reviews.comでは80点で「納得のいくハチミツ」と評価。',
  'musthave:kiwi smoothie':
    'キウイにペパーミントとリンゴジュースを効かせたスムージー系。htreviewsでは評価が割れる銘柄だが、hookah-reviews.comでは82点で「ハズレの多いキウイ系では珍しい良作」。弱火+陶器ボウル推奨とされる。',
  'musthave:lemon tonic':
    'レモンにトニックの苦みを効かせた炭酸ドリンク系。htreviewsではトニックの苦みとシュワ感の再現度が好評で (リピート意向91%)、ジンやコーラ系などドリンク風ミックスのベースとして人気。',
  'musthave:lemon lime':
    'レモンとライムの甘酸っぱいシトラスミックス。htreviewsでは「酸味を足すミックスベースの定番」との位置づけ。hookah-reviews.comでは87点で、Tangiersの人気作New Lemon-Limeに似た完成度と評される。',
  'musthave:mad pear':
    '洋梨ネクターの濃厚な甘さがコンセプト。htreviewsでは洋梨キャンディ様のドリンク的な梨として賛否が分かれる。hookah-reviews.comでは82点で、再現度高めの洋梨としてソロでも吸える良作と評価。',
  'musthave:melonade':
    'メロン・スイカ・バーバリスシロップのレモネード系。htreviewsでは実質メロン主体との指摘が多く夏の定番ながら賛否両論。hookah-reviews.comでは「サッパリしてキレが良い清涼飲料水系」と評され、焦げにくく扱いやすい。',
  'musthave:milky rice':
    '甘いミルク粥を再現したノスタルジックなクリーム系。htreviewsではMustHave屈指の人気デザート系で (リピート意向90%)、マンゴーと合わせる「マンゴースティッキーライス」などクリーミーなミックスのベースとして絶賛される。',
  'musthave:pinkman':
    'グレープフルーツ・イチゴ・ラズベリーを合わせたMustHaveの看板ミックス。htreviewsでは「迷ったらこれ」と言われるロシアの定番 (評価606件)。hookah-reviews.comでも84点で「非常に完成度が高い」と評される。',
  'musthave:red bomb':
    'ザクロの渋みと後味の苦みを再現したフルーツ系。htreviewsでは「実ではなく皮の味」と評価が二極化する上級者向け。hookah-reviews.comでは泥臭さまで含めて「明らかに再現度が高いザクロ」と忠実さが評価される。',
  'musthave:tropic juice':
    'パイナップルとパッションフルーツの濃厚なトロピカルジュース系。htreviewsでは「懐かしいマルチフルーツジュース」と評される無難な良作でミックスのベース向き。hookah-reviews.comでは希少なパッションフルーツ主体系として価値ありと評価。',
  'musthave:violet':
    'ブルーベリー・メロン・スパイスを謳うクリーミーシェイク系。htreviewsでは「実際は甘いクリーム系が支配的」との指摘が多く賛否が割れるが、デザートミックスのクリーミーさ補強用としては好評。',

  // BONCHE — htreviews.org のレビューを要約 (2026-08 時点)。ダークリーフ系プレミアムで
  // 公式強度は「強」表記。Happy New Year は htreviews 上では「New Year 2026」。
  'bonche:base':
    '香料を使わずシガーリーフそのものを楽しむBONCHEのノンアロマベース。htreviewsではコーヒーや木、ナッツの風味が時間とともに変化する「シガーリーフ入門に最適」な一本と好評 (リピート意向93%)。',
  'bonche:basil':
    'ミックス用「Notes」ラインのバジル。htreviewsでは「市場最高クラスのバジル再現」と命名どおりの再現度が絶賛され (リピート意向100%)、スパイス系ミックスの素材として高評価。',
  'bonche:brownie':
    'チョコの表層としっとり生地を再現したブラウニー。htreviewsでは「本当にブラウニーの味」と称賛が主流 (リピート意向94%)。30分ほどで香りが落ちシガーリーフが前面に出るブランド仕様への言及も。',
  'bonche:caramel':
    'クレームブリュレのカラメルからトフィーのクリーミーさへ展開するキャラメル。htreviewsでは「現時点で市場最高のキャラメル」と絶賛され (リピート意向95%)、ミックスに15〜20%加える使い方が推奨される。',
  'bonche:cherry':
    'ダークリーフのチェリー。htreviewsでは「完璧な再現」と「果肉ではなく種の味」で最も評価が割れる銘柄で、ソロよりミックス向きとされる。',
  'bonche:clove':
    '丁子 (クローブ) のスパイス系。htreviewsでは「10%足すだけで効く超鮮烈なクローブ」としてチャイやグリューワイン系ミックスの隠し味に高評価。ソロには不向き。',
  'bonche:clover club':
    'ジン・レモン・ラズベリーの古典カクテルを再現したBartenderラインの一本。htreviewsでは甘いラズベリーとレモンの皮の爽やかさが前面と評され、4点中心の堅実な評価 (リピート意向83%)。',
  'bonche:coffee':
    'シガーリーフとコーヒー豆を合わせたビターなコーヒー。htreviewsでは「市場最高のコーヒー」と絶賛が大勢のBONCHE屈指の人気銘柄 (評価144件・5点54%)。ソロでも吸える苦みが持ち味。',
  'bonche:dark chocolate':
    '濃厚なダークチョコレート。htreviewsでは「業界に少ない本格ダークチョコの決定版」とソロ・ミックス両方で高評価のブランド最人気クラス (評価197件・リピート意向96%)。',
  'bonche:gimlet':
    'ジンとライムのカクテル「ギムレット」を再現したBartenderラインの一本。htreviewsではシロップ的な甘いライムと控えめなジュニパーのバランスが良いと好評 (リピート意向94%)。',
  'bonche:happy new year':
    'ココア・メープルシロップ・シナモンを合わせた年末限定フレーバー (htreviews上は「New Year 2026」)。htreviewsでは評価が低調で (リピート意向43%)、初期ロットでは記載にないアニス・リコリス様の味が出たという報告が相次いだ。低温運用でココアとメープルの甘さが出るとブランドは案内している。',
  'bonche:honey':
    '花蜜系のナチュラルな蜂蜜 (Notesライン)。htreviewsでは「市場最高の蜂蜜」との声が複数あり3点以下ゼロという安定した高評価 (5点65%・リピート意向98%)。ミルク系・フルーツ系ミックスで支持される。',
  'bonche:irga':
    'イルガ (ジューンベリー) の甘みに天然の渋みと酸味を添えたベリー系。htreviewsでは「ドライベリーのコンポート風でシガーベースと好相性」と好意的な評価が優勢。',
  'bonche:kiwi':
    '酸味と穏やかな甘みのキウイ。htreviewsでは「皮の苦みまで再現されたナチュラルなキウイ」と「水っぽい」で二分され、緑系やレモネード系ミックスの脇役推奨が多い。',
  'bonche:lavender':
    'ウッディなノートを加えた濃厚なラベンダー。htreviewsでは「石鹸っぽさのない本物のエッセンシャルオイル的ラベンダー」として少量で効くミックス素材として高評価 (リピート意向94%)。',
  'bonche:lychee':
    '「市場で最もナチュラルなライチ」と絶賛されるBONCHEの看板フレーバー。htreviewsでは5点55%・リピート意向91%と圧倒的な高評価で、甘く花のような再現度が支持される。',
  'bonche:mango':
    '完熟マンゴーの濃厚な甘さ。htreviewsでは「青臭さのない強い香りでミックスでも主役を奪う」との評価が主流で、マンゴー好きへの推奨が多い。',
  'bonche:olive':
    '黒オリーブのオイリーな塩気という唯一無二のガストロ系。htreviewsでは「ミックスに油脂っぽい質感を加える名脇役」と評される一方、香りの持続が20分程度と短い点が弱点とされる。',
  'bonche:passion fruit':
    'パッションフルーツ (マラクヤ)。htreviewsでは「市場最高・お手本のパッションフルーツ」「甘みから酸味へ表情が変わる」と絶賛が多く、ソロで完結する完成度と評される (リピート意向86%)。',
  'bonche:rum':
    'オーク樽やスパイスのニュアンスを持つ本物寄りのラム。htreviewsでは「モノで吸える市場最高のラムの一つ」と評され、ピニャコラーダなどカクテルミックスの材料として人気 (リピート意向89%)。',
  'bonche:salami':
    '燻製サラミという衝撃のガストロ系。htreviewsでは「命中率が衝撃的」と絶賛され (評価114件)、オリーブやトマト系と合わせるピザ風ミックスが定番。強烈な香りで好みは明確に割れる。',
  'bonche:singapore sling':
    'パイナップル・チェリー・柑橘のカクテル「シンガポールスリング」を再現したBartenderラインの一本。htreviewsでは甘いパイナップルシロップが主役という評が大勢で、ノンアルカクテル風と好意的な声が多い。',
  'bonche:vanilla':
    'クリーミーで化学臭のない上質なバニラ (Notesライン)。htreviewsでは「ミックスを主張しすぎず支える教科書的な脇役」と評され、リピート意向97%と高い支持。ベリーや焼き菓子系と好相性。',
  'bonche:wild strawberry':
    '森の野いちご (ゼムリャニカ) を再現したベリー系。htreviewsでは「唯一まともに野いちごを実現した銘柄」との絶賛と「ジャム寄り」との指摘があるが、おおむね好評 (リピート意向78%)。',
  // Trifecta — 日本語レビューブログ hookah-reviews.com (byダビデ) の各フレーバー記事を要約
  // (2026-09 時点)。Blonde / Dark の 2 ライン。財務省公告名は「Trifecta Tobacco <名前>」
  // のようにライン表記が無いものが多いため、説明文の冒頭で記事側のライン
  // (Blonde / Dark) を明示している。同一銘柄が複数の公告名で登録されている場合は
  // 同じ記事を出典として同じ説明を共有する (56 記事 → 99 キー)。
  // 公告名が Blonde だが記事は Dark ライン版のみの Blonde Peppermint Shake は
  // 本文に出典ラインを明記。
  // 記事が見つからなかった Apple 509 / Pineapple Iced Tea / Raspberry Lemon Roll /
  // The Buzz は意図的に未記載。
  'trifecta:arak':
    'Darkラインの、アニスあるいはリコリスの香りを軸にした一本で、マッタリした甘さと薬っぽいキレ感が強く全体に濃い口。hookah-reviews.comでは50点で「個人的にLicorice系の香りが苦手なので、これも好きではなかった」と評された。開封後は半日ほど空気に晒す必要がある。',
  'trifecta:b d s':
    'Blondeラインの、甘めのピーチ味タブレット菓子を思わせる、香りの輪郭がハッキリしたPeach系単体。hookah-reviews.comでは77点で「アメリカの会社らしいPeach系として無難に良く出来ている」と評された。ボウルによる差が大きく、陶器のPhunnel系だと甘さが控えめになる。',
  'trifecta:bds':
    'Blondeラインの、甘めのピーチ味タブレット菓子を思わせる、香りの輪郭がハッキリしたPeach系単体。hookah-reviews.comでは77点で「アメリカの会社らしいPeach系として無難に良く出来ている」と評された。ボウルによる差が大きく、陶器のPhunnel系だと甘さが控えめになる。',
  'trifecta:blonde nawar':
    'Blondeラインの、バラの入浴剤や芳香剤を思わせるシンプルで濃い口のRose系単体。hookah-reviews.comでは69点で「個人的にRose系が苦手なので、点数は不当に低い可能性が高い」と評された。煙はAl FakherのRoseよりウェットでソフトで、香りとの相性が良い。',
  'trifecta:blonde peppermint shake':
    'ややアッサリしたCream系とシャープな清涼感に微かなChocolate系を重ねた、ミントシロップとチョコチップ入りのバニラシェイクのような香り。hookah-reviews.comのDarkライン版レビューでは85点で「個々の香りのバランスも絶妙」と評された。陶器のPhunnel系で作ると特徴がよりハッキリ出る。',
  'trifecta:blue strawberry':
    'Blondeラインの、外国のイチゴ味のガムやキャンディを思わせる人工的なStrawberry系。他社に多いヘタのような青臭さが無く、可愛らしい甘さとウェットな煙の相性も良い。hookah-reviews.comでは72点で「お菓子っぽいイチゴの香りで、割と珍しいタイプのStrawberry系」と評された。',
  'trifecta:bohemian mix':
    'BlondeラインのSpice系Mixで、濃いめのCardamon系を軸に少々のClove系とフンワリした紅茶っぽい香りが重なり、ほんのり甘くEarthyに仕上がる。hookah-reviews.comでは79点で「Cardamon系の香りが濃いめでハッキリしているフレーバーは珍しい」と評された。',
  'trifecta:bonafide':
    'Blondeラインの、紙パックのバナナオレのように輪郭がハッキリしたBanana系に、Clove系とCinnamon系らしきスパイスが微かなアクセントとして重なる一本。hookah-reviews.comでは77点で「他社には珍しいMixでちゃんと形にもなっている」と評された。火加減はBlondeラインの平均で扱いやすい。',
  'trifecta:cherry berry':
    'BlondeラインのCherry系とBlueberry系のMixで、杏仁やアマレットのようなツンとした感じが強いアメリカ的なCherry系が主役。hookah-reviews.comでは69点で「普通にアメリカの会社っぽいCherry系」と評された。陶器のPhunnel系で作るとBlueberry系が分かりやすい。',
  'trifecta:coconut ginger':
    'Blondeラインの、ココナッツミルクのようなマッタリした甘さのCoconut系に、すりおろしショウガの絞り汁のようなピリッとした香りがアクセントで乗る。hookah-reviews.comでは81点で「思った以上に楽しめた」と評され、人を選ぶクセが無く吸いやすい点も評価された。',
  'trifecta:cucumber mojito':
    'BlondeラインのLime系をメインに、キュウリを思わせるウリっぽい青臭さと控えめな清涼感が重なる、キレのあるスッキリした甘い香り。hookah-reviews.comでは79点で「キュウリの香りの入ったフレーバーの中では、これが一番好きだった」と評され、煙の質と扱いやすさも良好。',
  'trifecta:dark pineapple':
    'Darkラインの、缶詰のパイナップルとパイン飴の中間のような、Al FakherのPineappleに近い香り。hookah-reviews.comでは50点で「短所ばかりが目立つ」と評された。開封後に数時間空気へ晒さないと気管支に負担のかかる煙になり、手間の割に香りは凡庸。',
  'trifecta:death by ice':
    'Darkラインの、シャープで冷たい清涼感に特化したMint系。湿布のようなイチヤクソウの香りは控えめで、微かなビターさとホンノリした甘さで全体が引き締まる。hookah-reviews.comでは77点で「ある程度の重さや少々のイチヤクソウの香り、鮮烈な清涼感を求めるのであれば、試す価値はある」と評された。',
  'trifecta:earl grey':
    'Darkラインの、ベルガモットが強めで再現度の極めて高いアールグレイ。甘さは控えめでストレートの紅茶らしいビターさが出るが安定感は皆無で、作り方と火加減の工夫が要る。hookah-reviews.comでは83点で「香り自体はLavooのRussian Teaと優劣つけがたい出来」と評された。',
  'trifecta:huckleberry':
    'Blondeラインの、紅茶や少し渋めのフローラルを思わせるフンワリした広がりのあるBlueberry系に、微かな清涼感が混じるStarBuzzのBlue Mist系の香り。hookah-reviews.comでは77点で「甘さはあるが意外とキレが良い」と評された。',
  'trifecta:iced orange mint':
    'Blondeラインの、皮のようなビターさが強く酸味は控えめなOrange系に、グリーンな香りのMint系が重なる一本。hookah-reviews.comでは73点で「ボウルによって香りの出方が結構違い、幅があって面白い」と評された。気持ち弱めの火加減が向く。',
  'trifecta:indianan kheer':
    'Darkラインの、砂糖を入れたホットミルクのような甘い牛乳の香りに、Cardamon系のキリッとしたアクセントを重ねたMix。香りと煙の質がマッチし、火の調節で苦労することも無い。hookah-reviews.comでは88点で「個人的にはTrifecta Darkの中で1番の当たりだと思った」と評された。',
  'trifecta:lavender mint':
    'Darkラインの、甘さの無い生花のようなラベンダーの香りと、シャープでキリッとした強めの清涼感の組み合わせ。後味の少々のビターさが芳香剤っぽさを抑えている。hookah-reviews.comでは83点で「他社には無い香りながら再現度が高く、良く出来ている」と評された。',
  'trifecta:lemon mint':
    'Blondeラインの、酸味とビターさを残しつつ丸みのある甘さが強めのLemon系に、微かな清涼感を添えた香り。ノドへの当たりが抑えられ、クラシックなLemon系よりソフトで吸いやすい。hookah-reviews.comでは78点で「丸みのある甘さが強いが、確かにLemon系らしい香りはハッキリ感じられる」と評された。',
  'trifecta:lychee':
    'Darkラインの、ボンヤリしたマッタリめの甘さとCoconut系寄りのトロピカルなテイストが実物のライチらしい香り。ただし安定感に欠け、長めの空気晒しと弱めの火加減が要る。hookah-reviews.comでは77点で「煙まわりに難を感じるが、珍しい香りだし個人的にも好みなので割と楽しめた」と評された。',
  'trifecta:mango smoothie':
    'Blondeラインの、ワックスっぽいツンとしたテイストのあるMango系に、Vanilla系っぽい甘さのマッタリしたCream系が少々加わる一本。hookah-reviews.comでは80点で「Mango系とCream系の相性が良い」と評され、着香が濃いめで香りの持ちも長め。',
  'trifecta:mediterranean mint':
    'Blondeラインの、グリーンな香りと丸みのある甘さでクセを抑えたSpear Mint系。清涼感はAl FakherのMint程度で、歯磨き粉っぽさは無い。hookah-reviews.comでは73点で「Spear Mint系の中では割と良く出来ている」と評されたが、Mixでの使い勝手は劣るとされる。',
  'trifecta:melon melange':
    'Blondeラインの、ウリ臭さがやや強めでマッタリと甘いMelon系。メロン味のチューイングキャンディを思わせるお菓子っぽさがあり、hookah-reviews.comでは77点で「無難かつ高水準にまとまっている」と評された。火が強いと甘さがノドに残りやすい。',
  'trifecta:moro zest':
    'Blondeラインの、バヤリースのオレンジジュースを何倍にも濃くしたような、やや甘めでハッキリした着香のOrange系。酸味が控えめで吸いやすい反面、やや人工的でわざとらしさもある。hookah-reviews.comでは75点で「吸いやすく分かりやすいこれは、Orange系の入り口に良いと思う」と評された。',
  'trifecta:morozest':
    'Blondeラインの、バヤリースのオレンジジュースを何倍にも濃くしたような、やや甘めでハッキリした着香のOrange系。酸味が控えめで吸いやすい反面、やや人工的でわざとらしさもある。hookah-reviews.comでは75点で「吸いやすく分かりやすいこれは、Orange系の入り口に良いと思う」と評された。',
  'trifecta:mountain fog':
    'Blondeラインの、ライムの香料が入った炭酸飲料を濃くしたような、甘めでケミカルなLime系。ツンとした感じは同系統のものより穏やかで、香りの持ちはやや長い。hookah-reviews.comでは77点で「輪郭がハッキリした香りで甘めだったので、分かりやすくて良いと思った」と評された。',
  'trifecta:nawar':
    'Blondeラインの、バラの入浴剤や芳香剤を思わせるシンプルで濃い口のRose系単体。hookah-reviews.comでは69点で「個人的にRose系が苦手なので、点数は不当に低い可能性が高い」と評された。煙はAl FakherのRoseよりウェットでソフトで、香りとの相性が良い。',
  'trifecta:p3':
    'Blondeラインの、パインアメのようなやや甘いPineapple系にサッパリしたBlueberry系を3:1ほどで重ねたMix。hookah-reviews.comでは72点で「商品名の割に素直なMixだと思った」と評され、Pineapple系単体と割り切っても吸える香りとされる。煙の質は問題の出やすいPineapple系としては優秀。',
  'trifecta:peach mint':
    'Blondeラインの、気になるケミカルさが無く実物の桃を思わせるPeach系に、ノドがスッとする程度の控えめな清涼感を添えた一本。hookah-reviews.comでは83点で「派手さは無いが完成度は高い」と評された。モワッとした煙との相性が良く、単体でも吸えMixの邪魔にもならない。',
  'trifecta:pearfect':
    'Darkラインの、ラ・フランスのような洋梨をトロンとした甘い余韻まで再現した再現度の高いフレーバー。hookah-reviews.comでは83点で「やや火の調節は厄介だが、オススメ」と評された。序盤は弱めの火加減で維持する必要があるが、中盤からは落ち着き煙の質も良くなる。',
  'trifecta:peppermint shake':
    'ややアッサリしたCream系とシャープな清涼感に微かなChocolate系を重ねた、ミントシロップとチョコチップ入りのバニラシェイクのような香り。hookah-reviews.comのDarkライン版レビューでは85点で「個々の香りのバランスも絶妙」と評された。陶器のPhunnel系で作ると特徴がよりハッキリ出る。',
  'trifecta:persian melon':
    'Blondeラインの、Melon系としてはアッサリした甘さで、ダークリーフを思わせる土っぽい微かな渋みが混じるクラシック寄りの一本。hookah-reviews.comでは68点で「Melon系としては引き締まった香り」と評される一方、万人受けはしにくいとされた。',
  'trifecta:pineapple':
    'Darkラインの、缶詰のパイナップルとパイン飴の中間のような、Al FakherのPineappleに近い香り。hookah-reviews.comでは50点で「短所ばかりが目立つ」と評された。開封後に数時間空気へ晒さないと気管支に負担のかかる煙になり、手間の割に香りは凡庸。',
  'trifecta:pineapple guava':
    'Blondeラインの、パインアメっぽい甘めのPineapple系にGuava系の青臭さを2:1ほどで効かせたMix。hookah-reviews.comでは75点で「無難に良く出来ていた」と評された。青臭さが甘さを引き締めMixのバランスも良く、火の調節も難しくない。',
  'trifecta:pumpkin somethin':
    'Blondeラインの、缶詰のカボチャペーストのようなモッタリしたイモっぽい香りに、Cinnamon系主体のスパイスが強めに重なる一本。hookah-reviews.comでは60点で「イマイチだった」と評され、カボチャと分かる香りかは想像力で補完が要るとされた。',
  'trifecta:ruby':
    'Darkラインの、ウリ臭さと青臭さが強いクラシックなMelon系にツンとしたCherry系とCinnamon系が重なり、全体ではリコリスのような香草系っぽさが立つ一本。hookah-reviews.comでは69点で「ややクセはあるが、地味に凝ったMix」と評された。',
  'trifecta:spiced java':
    'Blondeラインの、Cream系のテイストがある甘めのCoffee系に、ごく微かなSpice系のアクセントを効かせた一本。hookah-reviews.comでは66点で「個人的にCoffee系があまり好きでないので、点数は不当に低い」と断りつつ評された。同系統より薄味でクドさが控えめのライトな仕上がり。',
  'trifecta:tko':
    'Darkラインの、ヘーゼルナッツ入りチョコレート、いわばヌテラを思わせる香りで、余韻の香ばしさが特徴。hookah-reviews.comでは82点で「Chocolate系単体やそれに近い香りが好きであれば、試す価値は大きい」と評された。安定感があって扱いやすく、煙の量と質を両立しやすい。',
  'trifecta:tnt':
    'Blondeラインの、ワックスっぽいツンとしたMango系と微かなビターさのあるGrapefruit系を1:1で合わせたMix。hookah-reviews.comでは80点で「他社には珍しい感じのスッキリ感が出ているのが良かった」と評された。清涼感はほぼ無く、火の調節でも苦労しない。',
  'trifecta:tobacco apple pie':
    'Darkラインの、リコリス感のあるDouble Apple系とCinnamon系に、クッキーのような焼き菓子の香りが濃く重なるアップルパイ系。hookah-reviews.comでは79点で「再現度が高く、かなり頑張ってる部類」と評された。火加減は弱めが無難。',
  'trifecta:tobacco arak':
    'Darkラインの、アニスあるいはリコリスの香りを軸にした一本で、マッタリした甘さと薬っぽいキレ感が強く全体に濃い口。hookah-reviews.comでは50点で「個人的にLicorice系の香りが苦手なので、これも好きではなかった」と評された。開封後は半日ほど空気に晒す必要がある。',
  'trifecta:tobacco bdh':
    'Darkラインの、ウリ臭さが強めのWatermelon系とMelon系を、Vanilla系っぽいCream系のテイストで柔らかくまとめた一本。hookah-reviews.comでは78点で「万人受けする」と評され、煙の質の良さと火加減に強い扱いやすさも評価された。',
  'trifecta:tobacco bds':
    'Blondeラインの、甘めのピーチ味タブレット菓子を思わせる、香りの輪郭がハッキリしたPeach系単体。hookah-reviews.comでは77点で「アメリカの会社らしいPeach系として無難に良く出来ている」と評された。ボウルによる差が大きく、陶器のPhunnel系だと甘さが控えめになる。',
  'trifecta:tobacco blue strawberry':
    'Blondeラインの、外国のイチゴ味のガムやキャンディを思わせる人工的なStrawberry系。他社に多いヘタのような青臭さが無く、可愛らしい甘さとウェットな煙の相性も良い。hookah-reviews.comでは72点で「お菓子っぽいイチゴの香りで、割と珍しいタイプのStrawberry系」と評された。',
  'trifecta:tobacco bohemian mix':
    'BlondeラインのSpice系Mixで、濃いめのCardamon系を軸に少々のClove系とフンワリした紅茶っぽい香りが重なり、ほんのり甘くEarthyに仕上がる。hookah-reviews.comでは79点で「Cardamon系の香りが濃いめでハッキリしているフレーバーは珍しい」と評された。',
  'trifecta:tobacco bona fide':
    'Blondeラインの、紙パックのバナナオレのように輪郭がハッキリしたBanana系に、Clove系とCinnamon系らしきスパイスが微かなアクセントとして重なる一本。hookah-reviews.comでは77点で「他社には珍しいMixでちゃんと形にもなっている」と評された。火加減はBlondeラインの平均で扱いやすい。',
  'trifecta:tobacco cherry berry':
    'BlondeラインのCherry系とBlueberry系のMixで、杏仁やアマレットのようなツンとした感じが強いアメリカ的なCherry系が主役。hookah-reviews.comでは69点で「普通にアメリカの会社っぽいCherry系」と評された。陶器のPhunnel系で作るとBlueberry系が分かりやすい。',
  'trifecta:tobacco cherry plum':
    'Darkラインの、梅ガムや梅キャンディを思わせる香り。典型的なチェリー系のミックスではなく、酸味はほとんど無く香りに一体感があるのが特徴。hookah-reviews.comでは80点で「梅ガムや梅キャンディと思えば再現度が高く、かなり楽しめた」と評された。',
  'trifecta:tobacco coconut ginger':
    'Blondeラインの、ココナッツミルクのようなマッタリした甘さのCoconut系に、すりおろしショウガの絞り汁のようなピリッとした香りがアクセントで乗る。hookah-reviews.comでは81点で「思った以上に楽しめた」と評され、人を選ぶクセが無く吸いやすい点も評価された。',
  'trifecta:tobacco concord grape':
    'Darkラインの濃いめのブラックグレープ系で、巨峰やデラウェアの皮の近くのフォクシー香を何倍にも濃くしたような香り。単体では濃すぎて分かりにくいが、ミント系などとミックスして薄めると実物のブドウらしさが際立つ。hookah-reviews.comでは78点で、余韻の再現度は非常に高いと評された。',
  'trifecta:tobacco cucumber mojito':
    'BlondeラインのLime系をメインに、キュウリを思わせるウリっぽい青臭さと控えめな清涼感が重なる、キレのあるスッキリした甘い香り。hookah-reviews.comでは79点で「キュウリの香りの入ったフレーバーの中では、これが一番好きだった」と評され、煙の質と扱いやすさも良好。',
  'trifecta:tobacco death by ice':
    'Darkラインの、シャープで冷たい清涼感に特化したMint系。湿布のようなイチヤクソウの香りは控えめで、微かなビターさとホンノリした甘さで全体が引き締まる。hookah-reviews.comでは77点で「ある程度の重さや少々のイチヤクソウの香り、鮮烈な清涼感を求めるのであれば、試す価値はある」と評された。',
  'trifecta:tobacco deja dew':
    'Darkラインの、ライム味の炭酸飲料やリキュールを思わせるケミカルなライム系。StarBuzzのPirate\'s Caveと同系統でケミカルさはさらに強く、好き嫌いが分かれる。hookah-reviews.comでは73点で「まぁまぁ楽しめた」ものの飽きる人もいそうと評された。',
  'trifecta:tobacco earl gray':
    'Darkラインの、ベルガモットが強めで再現度の極めて高いアールグレイ。甘さは控えめでストレートの紅茶らしいビターさが出るが安定感は皆無で、作り方と火加減の工夫が要る。hookah-reviews.comでは83点で「香り自体はLavooのRussian Teaと優劣つけがたい出来」と評された。',
  'trifecta:tobacco earl grey':
    'Darkラインの、ベルガモットが強めで再現度の極めて高いアールグレイ。甘さは控えめでストレートの紅茶らしいビターさが出るが安定感は皆無で、作り方と火加減の工夫が要る。hookah-reviews.comでは83点で「香り自体はLavooのRussian Teaと優劣つけがたい出来」と評された。',
  'trifecta:tobacco enigma':
    'Darkラインの、ブルーベリー系を軸にしたフルーツミックスで、後味にサンダルウッドのような香木の香りがアクセントとして乗る。甘さは控えめでキレが良く、煙の質も平均以上。hookah-reviews.comでは82点で「最初は違和感があるが何度か吸ううちに妙にクセになる」と評された。',
  'trifecta:tobacco grapefruit':
    'Darkラインの、酸味とビターさが非常に控えめでアッサリ方面に特化したグレープフルーツ系。スウィーティのような可愛らしくキレの良い甘さで、最後までサッパリ吸える。hookah-reviews.comでは81点で、他社には珍しい仕上がりと評された。',
  'trifecta:tobacco hipster mint':
    'Darkラインの、シャープで冷たい強めの清涼感に主張の控えめなガム系（スペアミント系）の香りを重ねたミント系。Al FakherのGumほどの主張やクセは無い。hookah-reviews.comでは74点で、同ラインのDeath by IceやDurty Mintの方が万人受けしそうと評された。',
  'trifecta:tobacco huckleberry':
    'Blondeラインの、紅茶や少し渋めのフローラルを思わせるフンワリした広がりのあるBlueberry系に、微かな清涼感が混じるStarBuzzのBlue Mist系の香り。hookah-reviews.comでは77点で「甘さはあるが意外とキレが良い」と評された。',
  'trifecta:tobacco iced orange mint':
    'Blondeラインの、皮のようなビターさが強く酸味は控えめなOrange系に、グリーンな香りのMint系が重なる一本。hookah-reviews.comでは73点で「ボウルによって香りの出方が結構違い、幅があって面白い」と評された。気持ち弱めの火加減が向く。',
  'trifecta:tobacco indian kheer':
    'Darkラインの、砂糖を入れたホットミルクのような甘い牛乳の香りに、Cardamon系のキリッとしたアクセントを重ねたMix。香りと煙の質がマッチし、火の調節で苦労することも無い。hookah-reviews.comでは88点で「個人的にはTrifecta Darkの中で1番の当たりだと思った」と評された。',
  'trifecta:tobacco lavender mint':
    'Darkラインの、甘さの無い生花のようなラベンダーの香りと、シャープでキリッとした強めの清涼感の組み合わせ。後味の少々のビターさが芳香剤っぽさを抑えている。hookah-reviews.comでは83点で「他社には無い香りながら再現度が高く、良く出来ている」と評された。',
  'trifecta:tobacco lemon mint':
    'Blondeラインの、酸味とビターさを残しつつ丸みのある甘さが強めのLemon系に、微かな清涼感を添えた香り。ノドへの当たりが抑えられ、クラシックなLemon系よりソフトで吸いやすい。hookah-reviews.comでは78点で「丸みのある甘さが強いが、確かにLemon系らしい香りはハッキリ感じられる」と評された。',
  'trifecta:tobacco lemon pie':
    'Darkラインの、ライム入りのレアチーズケーキやムースのような香り。キリッとしたレモン＋ライムのシトラス系とマッタリしたクリーム系のコントラストが持ち味。hookah-reviews.comでは83点で、他社に珍しいミックスで満足感があると評された。',
  'trifecta:tobacco lime':
    'Darkラインの、アメリカのブランドによくあるライム系だがケミカルさはやや控えめで、微かなビターさが良い。StarBuzz VintageのFresh Limeに近い香り。hookah-reviews.comでは79点で、目新しさは無いがバランスは悪くないと評された。',
  'trifecta:tobacco lychee':
    'Darkラインの、ボンヤリしたマッタリめの甘さとCoconut系寄りのトロピカルなテイストが実物のライチらしい香り。ただし安定感に欠け、長めの空気晒しと弱めの火加減が要る。hookah-reviews.comでは77点で「煙まわりに難を感じるが、珍しい香りだし個人的にも好みなので割と楽しめた」と評された。',
  'trifecta:tobacco mango smoothie':
    'Blondeラインの、ワックスっぽいツンとしたテイストのあるMango系に、Vanilla系っぽい甘さのマッタリしたCream系が少々加わる一本。hookah-reviews.comでは80点で「Mango系とCream系の相性が良い」と評され、着香が濃いめで香りの持ちも長め。',
  'trifecta:tobacco manzanas':
    'Darkラインの、リコリスやアニス特有のキレが非常に強いダブルアップル系。NakhlaのDouble Appleにマッタリした甘さを足したような濃い口で、クラシックな作りに忠実。hookah-reviews.comでは78点で、キレと甘さがシッカリして満足感があると評された。',
  'trifecta:tobacco mediterranean mint':
    'Blondeラインの、グリーンな香りと丸みのある甘さでクセを抑えたSpear Mint系。清涼感はAl FakherのMint程度で、歯磨き粉っぽさは無い。hookah-reviews.comでは73点で「Spear Mint系の中では割と良く出来ている」と評されたが、Mixでの使い勝手は劣るとされる。',
  'trifecta:tobacco melon melange':
    'Blondeラインの、ウリ臭さがやや強めでマッタリと甘いMelon系。メロン味のチューイングキャンディを思わせるお菓子っぽさがあり、hookah-reviews.comでは77点で「無難かつ高水準にまとまっている」と評された。火が強いと甘さがノドに残りやすい。',
  'trifecta:tobacco morning glory':
    'Darkラインの、ミルクと砂糖のたっぷり入ったコーヒーキャンディのような香り。クリーム系とバニラ系が多めで、焦げたようなビターさは控えめで吸いやすい。hookah-reviews.comでは64点で、よくあるアメリカのブランドのコーヒー系で没個性的と評された。',
  'trifecta:tobacco moro zest':
    'Blondeラインの、バヤリースのオレンジジュースを何倍にも濃くしたような、やや甘めでハッキリした着香のOrange系。酸味が控えめで吸いやすい反面、やや人工的でわざとらしさもある。hookah-reviews.comでは75点で「吸いやすく分かりやすいこれは、Orange系の入り口に良いと思う」と評された。',
  'trifecta:tobacco mountain fog':
    'Blondeラインの、ライムの香料が入った炭酸飲料を濃くしたような、甘めでケミカルなLime系。ツンとした感じは同系統のものより穏やかで、香りの持ちはやや長い。hookah-reviews.comでは77点で「輪郭がハッキリした香りで甘めだったので、分かりやすくて良いと思った」と評された。',
  'trifecta:tobacco natural order':
    'Darkラインの、ローズマリーやセージのようなスッキリした香草系にライム系と清涼感を重ねた香り。陶器のファンネル系ボウルで作ると香草系の香りがハッキリ出る。hookah-reviews.comでは81点で、他社に無い香りが欠点も無く無難にまとまっていると評された。',
  'trifecta:tobacco p3':
    'Blondeラインの、パインアメのようなやや甘いPineapple系にサッパリしたBlueberry系を3:1ほどで重ねたMix。hookah-reviews.comでは72点で「商品名の割に素直なMixだと思った」と評され、Pineapple系単体と割り切っても吸える香りとされる。煙の質は問題の出やすいPineapple系としては優秀。',
  'trifecta:tobacco peach mint':
    'Blondeラインの、気になるケミカルさが無く実物の桃を思わせるPeach系に、ノドがスッとする程度の控えめな清涼感を添えた一本。hookah-reviews.comでは83点で「派手さは無いが完成度は高い」と評された。モワッとした煙との相性が良く、単体でも吸えMixの邪魔にもならない。',
  'trifecta:tobacco pearfect':
    'Darkラインの、ラ・フランスのような洋梨をトロンとした甘い余韻まで再現した再現度の高いフレーバー。hookah-reviews.comでは83点で「やや火の調節は厄介だが、オススメ」と評された。序盤は弱めの火加減で維持する必要があるが、中盤からは落ち着き煙の質も良くなる。',
  'trifecta:tobacco persian melon':
    'Blondeラインの、Melon系としてはアッサリした甘さで、ダークリーフを思わせる土っぽい微かな渋みが混じるクラシック寄りの一本。hookah-reviews.comでは68点で「Melon系としては引き締まった香り」と評される一方、万人受けはしにくいとされた。',
  'trifecta:tobacco pineapple':
    'Darkラインの、缶詰のパイナップルとパイン飴の中間のような、Al FakherのPineappleに近い香り。hookah-reviews.comでは50点で「短所ばかりが目立つ」と評された。開封後に数時間空気へ晒さないと気管支に負担のかかる煙になり、手間の割に香りは凡庸。',
  'trifecta:tobacco pineapple guava':
    'Blondeラインの、パインアメっぽい甘めのPineapple系にGuava系の青臭さを2:1ほどで効かせたMix。hookah-reviews.comでは75点で「無難に良く出来ていた」と評された。青臭さが甘さを引き締めMixのバランスも良く、火の調節も難しくない。',
  'trifecta:tobacco pulp friction':
    'Darkラインの、オレンジリキュールを少し垂らした甘くないドライなカクテルのような香り。硬質でキレの良いアルコール的なテイストが特徴だが、中盤でそれが先に薄れバランスが崩れる。hookah-reviews.comでは78点で、キレとドライさに特化した作りと評された。',
  'trifecta:tobacco pumpkin somethin':
    'Blondeラインの、缶詰のカボチャペーストのようなモッタリしたイモっぽい香りに、Cinnamon系主体のスパイスが強めに重なる一本。hookah-reviews.comでは60点で「イマイチだった」と評され、カボチャと分かる香りかは想像力で補完が要るとされた。',
  'trifecta:tobacco raspberry':
    'Darkラインの、少々の青臭さと草木のような爽やかさ、独特の水々しさを持つ軽やかなラズベリー。実物のラズベリーに近い薄味で香りの持ちは短めだが、煙の質はスムーズで強めの火加減でも崩れず扱いやすい。hookah-reviews.comでは78点で「最近のRaspberry系としては異色の出来」と評された。',
  'trifecta:tobacco ruby':
    'Darkラインの、ウリ臭さと青臭さが強いクラシックなMelon系にツンとしたCherry系とCinnamon系が重なり、全体ではリコリスのような香草系っぽさが立つ一本。hookah-reviews.comでは69点で「ややクセはあるが、地味に凝ったMix」と評された。',
  'trifecta:tobacco spiced java':
    'Blondeラインの、Cream系のテイストがある甘めのCoffee系に、ごく微かなSpice系のアクセントを効かせた一本。hookah-reviews.comでは66点で「個人的にCoffee系があまり好きでないので、点数は不当に低い」と断りつつ評された。同系統より薄味でクドさが控えめのライトな仕上がり。',
  'trifecta:tobacco spumoni':
    'Darkラインの、ローストナッツのような香ばしさとバニラ的な甘さを持つクリーム系に、シロップ漬けチェリーのツンとしたアクセントが少し混じるミックス。煙はやや重めでウェット、適当な火加減でも焦げにくい。hookah-reviews.comでは81点で「なかなか上手く形になっている」と評された。',
  'trifecta:tobacco the twist':
    'Darkラインの、キリッとしたシャープな清涼感とミント系のグリーンな香りが強めのスイカミント。高温に強く安定感が良いうえ、煙の量も吸いごたえも十分。hookah-reviews.comでは78点で「万人受けする鉄板の香り」と評された。',
  'trifecta:tobacco tko':
    'Darkラインの、ヘーゼルナッツ入りチョコレート、いわばヌテラを思わせる香りで、余韻の香ばしさが特徴。hookah-reviews.comでは82点で「Chocolate系単体やそれに近い香りが好きであれば、試す価値は大きい」と評された。安定感があって扱いやすく、煙の量と質を両立しやすい。',
  'trifecta:tobacco tnt':
    'Blondeラインの、ワックスっぽいツンとしたMango系と微かなビターさのあるGrapefruit系を1:1で合わせたMix。hookah-reviews.comでは80点で「他社には珍しい感じのスッキリ感が出ているのが良かった」と評された。清涼感はほぼ無く、火の調節でも苦労しない。',
  'trifecta:tobacco true grape':
    'Darkラインの、マスカットを思わせる甘さ控えめなホワイトグレープに、スペアミント系の香りと微かな清涼感を合わせた一本。煙はウェットでボリュームがあり、香りの持ちも長めで扱いやすい。hookah-reviews.comでは77点で「非常にオツなMix」と評された。',
  'trifecta:tobacco twice the ice':
    'Blondeラインの、シャープで冷たい強い清涼感に、お菓子のような丸みのある可愛らしい甘さが混じるミント系。煙量・煙質ともBlondeの平均でソツなく、陶器のファンネル系で作るとよりスッキリ出る。hookah-reviews.comでは84点で「人気があるのも納得の出来」と評された。',
  'trifecta:tobacco twice the ice x':
    'Blondeラインの、ミント系でも最も強い部類のシャープで鮮烈な清涼感に、可愛らしい甘さと後味の少々のビターさが乗る一本。煙質も安定感も平均的で、火の調節に苦労しにくい。hookah-reviews.comでは87点で「シンプルだがちゃんと特徴があり」と評された。',
  'trifecta:tobacco vanilla':
    'Blondeラインの、バニラエッセンスと砂糖入りのホイップクリームのような、マッタリした甘さがやや強めのバニラ。着香が濃いめで香りの持ちは長く、ミックスでも主張を残しやすい。hookah-reviews.comでは77点で「無難に良く出来ている」と評された。',
  'trifecta:tobacco vertigo':
    'Blondeラインの、ウリ臭さのあるやや甘めのスイカに控えめな清涼感と微かなスペアミントが乗る、王道のスイカミント。煙はモワッとして満足感があり、陶器のファンネル系の方が特徴がハッキリ出る。hookah-reviews.comでは75点で「マズくする方が難しい王道のMix」と評された。',
  'trifecta:twice the ice':
    'Blondeラインの、シャープで冷たい強い清涼感に、お菓子のような丸みのある可愛らしい甘さが混じるミント系。煙量・煙質ともBlondeの平均でソツなく、陶器のファンネル系で作るとよりスッキリ出る。hookah-reviews.comでは84点で「人気があるのも納得の出来」と評された。',
  'trifecta:twice the ice x':
    'Blondeラインの、ミント系でも最も強い部類のシャープで鮮烈な清涼感に、可愛らしい甘さと後味の少々のビターさが乗る一本。煙質も安定感も平均的で、火の調節に苦労しにくい。hookah-reviews.comでは87点で「シンプルだがちゃんと特徴があり」と評された。',
  'trifecta:twice the icex':
    'Blondeラインの、ミント系でも最も強い部類のシャープで鮮烈な清涼感に、可愛らしい甘さと後味の少々のビターさが乗る一本。煙質も安定感も平均的で、火の調節に苦労しにくい。hookah-reviews.comでは87点で「シンプルだがちゃんと特徴があり」と評された。',
  'trifecta:vanilla':
    'Blondeラインの、バニラエッセンスと砂糖入りのホイップクリームのような、マッタリした甘さがやや強めのバニラ。着香が濃いめで香りの持ちは長く、ミックスでも主張を残しやすい。hookah-reviews.comでは77点で「無難に良く出来ている」と評された。',
  'trifecta:vertigo':
    'Blondeラインの、ウリ臭さのあるやや甘めのスイカに控えめな清涼感と微かなスペアミントが乗る、王道のスイカミント。煙はモワッとして満足感があり、陶器のファンネル系の方が特徴がハッキリ出る。hookah-reviews.comでは75点で「マズくする方が難しい王道のMix」と評された。',
}

// Editor's Selection の手書き短評を id フォールバックとして流用
const CURATED_NOTE_BY_ID = new Map<number, string>()
for (const pick of EDITORS_PICKS) {
  if (pick.note) CURATED_NOTE_BY_ID.set(pick.id, pick.note)
}

/**
 * FLAVOR_DESCRIPTIONS の参照キー。将来の生成スクリプトからも使えるよう公開。
 */
export function flavorDescriptionKey(manufacturer: string, productName: string): string {
  return `${brandSlug(manufacturer)}:${normalizeFlavorName(productName, manufacturer)}`
}

/**
 * フレーバーの説明を返す。見つからなければ `null` (UI 側で非表示にする)。
 */
export function getFlavorDescription(
  flavor: Pick<ShishaFlavor, 'id' | 'manufacturer' | 'productName'>
): string | null {
  const byName = FLAVOR_DESCRIPTIONS[flavorDescriptionKey(flavor.manufacturer, flavor.productName)]
  if (byName) return byName
  return CURATED_NOTE_BY_ID.get(flavor.id) ?? null
}

/**
 * `description` が空のフレーバーに既知の説明を埋めて返す。元データに
 * description がある場合はそちらを優先する (resolveFlavorImage と同じ流儀)。
 */
export function resolveFlavorDescription<
  T extends Pick<ShishaFlavor, 'id' | 'manufacturer' | 'productName'> & { description?: string },
>(flavor: T): T {
  if (flavor.description && flavor.description.trim() !== '') return flavor
  const description = getFlavorDescription(flavor)
  if (!description) return flavor
  return { ...flavor, description }
}
