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
  // Tangiers — 日本語レビューブログ hookah-reviews.com (byダビデ) の各フレーバー記事を要約
  // (2026-09 時点)。記事はほぼ全てが Noir ラインのため、財務省公告名が Burley など別ライン
  // の銘柄では本文に「Noir版レビューでは」と出典ラインを明記している。
  // 既存の Cane Mint 系 3 キー (ファイル冒頭の TANGIERS_CANE_MINT) はそのまま維持。
  // 記事が見つからなかった Aussie Juice / Birquq Ololiuqui / Birquq Panic Punch /
  // Maraschino Cherry / Peach Cobbler / Noir Bacon / Noir Lime (New Lime とは別商品) /
  // Noir Banana Foster / Noir Bubblegum / Noir Caramel Apple / Noir Cardamom Cheesecake /
  // Noir Coconut / Noir Dark Cherry / Noir Ginger Pear / Noir Kashmir Lime /
  // Noir Ololiuqui / Noir Vanilla は意図的に未記載。
  'tangiers:2005 blueberry':
    'クリーム系4：ブルーベリー系1ほどの構成で、トロンとした甘さのクリーム系が主体、ブルーベリーは吐き終わりに華やぎを添える隠し味程度。TangiersのWelsh Creamよりアッサリした質感で、煙の質と香りの持ちも良好。hookah-reviews.comでは85点で「Cream系単体に近い香りは意外と珍しく、試す価値は大きい」と評された。',
  'tangiers:burley a cane mint':
    '甘さ控えめでやや強めのシャープな清涼感に少々のビターさが乗り、ダークリーフの土っぽいベース香がほどよく抑えられたバランス型のミント。焦げにくくボウルも選ばない。hookah-reviews.comのNoir版レビューでは96点で「最も売れているだけの出来で家に常備している」と評された。',
  'tangiers:burley canemint':
    'やや強めのシャープな清涼感に控えめな甘さと少々のビターさが乗り、土っぽいダークリーフのベースの香りが程よく活きたミント系。焦げにくくボウルも選ばない扱いやすさが持ち味。hookah-reviews.comのNoir版レビューでは96点で「Tangiersは苦手だがこれだけは好きという人も多い」と評された。',
  'tangiers:cane mint alpha':
    '控えめな甘さと少々のビターさ、やや強めでシャープな清涼感が土っぽいダークリーフのベースの香りをうまく抑え込んだバランス型のミント系。安定感が高く焦げにくいうえ、煙の量と質もTangiers平均以上。hookah-reviews.comでは96点で「Mint系が好きならば一度は試す価値がある」と評された。',
  'tangiers:cool strawberry':
    '少々の青臭さを伴う中東の会社にありそうなストロベリー系に、ケミカルなチェリー系特有のツンと鼻を抜ける感じが微かに混じるサッパリめの香りで、商品名に反して清涼感は無い。比較的高温にも耐え扱いやすい。hookah-reviews.comでは69点で「TangiersのStrawberryの方が分かりやすい」と再現度の低さを指摘された。',
  'tangiers:foreplay on the peach':
    'TangiersのJuicy PeachとApricot Spring Blendの中間、ややJuicy Peach寄りのピーチ系で、アプリコット系に似たフワッとした香りが微かなアクセントになる。ケミカルさは控えめで輪郭はハッキリ。hookah-reviews.comでは80点で「無難に良く出来ている」と評されたが、Juicy Peachと似るため片方あれば足りるとも指摘された。',
  'tangiers:horchata':
    'ライトでフンワリしたクリーム系のテイストに、後味のシナモン系の甘い香りとローストナッツのような香ばしさが重なるチャイ系。その香ばしさがTangiersのベースの香りをうまく溶け込ませている。hookah-reviews.comでは81点で「Cream系のテイストが強めのChai系を探しているのであれば、試す価値はある」と評された。',
  'tangiers:kashmir guajava':
    '砂糖入りのフレッシュなグァバジュースを思わせるマッタリ甘いグァバ系に、ターメリックやナツメグに似たクセのあるスパイス系の香りが強く混じる。煙はTangiersの平均で可もなく不可もなし。hookah-reviews.comでは70点で、スパイスが出来の良いグァバ系を邪魔しており「Guajava単体で良い」と評された。',
  'tangiers:melon blend':
    '人工香料100％のメロンゼリーやメロンソーダのような、輪郭のハッキリしたケミカルなメロン系。火が強くても酸っぱくなりにくく、メロン系としては扱いやすいのが利点。hookah-reviews.comでは63点と辛口で「ワザとらしさが目立つ」「定番のMelon系でこの出来は少し微妙」と評された。',
  'tangiers:mime':
    '渋味が少なく軽やかな酸味のレモン系に、ライム系と弱い清涼感を重ねたクリアなシトラス系のミックスで、ケミカルさは非常に少ない。ノドへの当たりもソフトで扱いやすい。hookah-reviews.comでは91点で、TangiersのNew Lemon-Limeよりクリアで軽やかな仕上がりと評された。',
  'tangiers:noir 2005 blueberry':
    'クリーム系とブルーベリー系を4：1ほどで合わせ、トロンとした甘さとマッタリした煙の質を持つクリーム系が主体。ブルーベリーは吐き終わりにわずかな華やぎを添える程度で、香りの持ちも長め。hookah-reviews.comでは85点で、TangiersのWelsh Creamと甲乙つけがたい出来と評された。',
  'tangiers:noir blitzsturm':
    'ハーブティー用の乾燥ラベンダーのようなハッキリしたフローラルの香りに、マットで甘さのあるそこそこ強めの清涼感が重なる。ベースの香りは控えめで、焦げにくく扱いやすい。hookah-reviews.comでは91点で「ラベンダーの香りが非常に分かりやすい」と評され、TangiersのLeviathanとほぼ同じ香りとも指摘された。',
  'tangiers:noir blue gumball 2 0':
    'Al FakherとStarBuzzの中間あたりに位置するブルーベリー系で、輪郭はハッキリしつつケミカルさは控えめ。ダークリーフのベースが皮の渋みのように溶け込みコクを出している。hookah-reviews.comでは77点で「基本に忠実で無難に良く出来ている」と評された一方、目新しさは無いとも指摘された。',
  'tangiers:noir cherry limeade':
    '鼻を抜けるツンとしたアメリカの会社らしいケミカルなチェリー系と、輪郭のハッキリしたライム系をほぼ1：1で合わせた、清涼飲料水を思わせる香り。煙はTangiersの平均的。hookah-reviews.comでは68点で「Mixのチョイス自体は割と捻りが無い」としつつ、ドクターペッパー好きに向くと評された。',
  'tangiers:noir chocolate iced cream':
    'キスチョコやココアシガレットを思わせるクラシックなチョコレートに、バニラ入りのマッタリしたクリームが重なる、紙パックのココアのような香り。hookah-reviews.comでは74点で「Chocolate系の基本に忠実だが商品名の割に目新しさが無い」と評された。粉っぽさが少なく高温にも比較的耐える。',
  'tangiers:noir chocolate mint':
    'キスチョコのような駄菓子っぽいチョコレートにミントペーストを混ぜたクラシックなチョコミントで、清涼感は吐き出しに軽くヒンヤリする程度。hookah-reviews.comでは70点で、ベースの土臭い香りがチョコにビターな奥行きを与える点は良いが好き嫌いは分かれると評された。火が強すぎると粉っぽさが出る。',
  'tangiers:noir clove':
    '鼻にツンと抜けるスパイス感と少々の甘さを持つ、クローブそのものの再現度が非常に高い香り。ベース香の有機的なニュアンスで精油的な他社品よりホールの粒に近く、ミックス素材にも使える。hookah-reviews.comでは72点で「スパイス系が好きでなければ好みではないが、用途と需要はある」と評された。',
  'tangiers:noir cocoa':
    'ココアシガレット的なクラシックChocolate系に粉乳っぽい乳臭さを強めた、薄めの缶ココアのような香り。バニラやコーヒーは入らないシンプルな作りで、hookah-reviews.comでは73点で「言われてみれば確かにココアで再現度は高いが、香り自体の目新しさは薄い」と評された。やや弱めの火加減向き。',
  'tangiers:noir cooling':
    '甘さもビターさも持たず、冷たく切り込むシャープな清涼感とTangiersのベース香だけという極めてシンプルな構成。そのベース香が強く、他社フレーバーとのミックスでは邪魔になりやすい。hookah-reviews.comでは68点で「単体で吸うならCane Mintの方がずっと良い」と評された。',
  'tangiers:noir foreplay on the peach':
    'マッタリした甘さのピーチ系に、アプリコットに似たフワッとした香りが微かなアクセントを添える。ケミカルさは目立たず輪郭は明瞭で、高温にも耐えて扱いやすい。hookah-reviews.comでは80点で「無難によく出来ているが、Juicy Peachと似ておりどちらか一つで足りる」と評された。',
  'tangiers:noir french jelly':
    '微かにツンとした青臭さのある香草系で、余韻にうっすらセロリらしさが出る程度。全体の8割がTangiersのベースの香りに押され、フレーバー自体が分かりにくい。hookah-reviews.comでは51点で、香りの持ちも悪くKiwiやPearと同じくTangiersの残念な出来の典型と評された。',
  'tangiers:noir it s like that one breakfast cereal':
    'シロップ漬けチェリー主体にオレンジが少し混じり、吐き終わりにクッキーのような焼き菓子感が広がる、砂糖多めのフルーツグラノーラ風の香り。中盤からはジェリービーンズ寄りに変化する。hookah-reviews.comでは68点で、香りの変化は気になるが煙はきめ細かく扱いやすいと評された。',
  'tangiers:noir kashmir':
    'タイムやレモングラスのようなスッキリした香草感に、ターメリック系のスパイスが4対1ほどで加わる、甘さ控えめでキレのある香り。hookah-reviews.comのライン表記「Tangiers」のレビューでは点数は付されていないが、Kashmir系の中で最も好みで煙の質も扱いやすさも優秀と評された。',
  'tangiers:noir kashmir apple':
    'ターメリックやナツメグのようなマッタリしたスパイス香が支配的で、アップルの甘さは奥にぼんやり感じられる程度。煙質と香りの持ちは良いがクセは強い。hookah-reviews.comでは55点で「ベースの果実香が立たず、オススメしにくい」と評された。',
  'tangiers:noir kashmir black':
    'ターメリックやナツメグに似たクセのある甘いスパイスが主体で、スパイス多めのチャイのようなマッタリした香り。Kashmir単体よりキレは控えめ。hookah-reviews.comでは70点で、キレのあるKashmirの方が好みとしつつ、マッタリしたSpice系が好きなら合うと評された。安定感はやや良い。',
  'tangiers:noir kashmir peach':
    'Al Fakher系に近いマッタリ甘いピーチに、Kashmir系共通のターメリックのようなスパイスが重なる香り。hookah-reviews.comでは70点で、濃いめのフルーツとスパイスの相性は良い部類だがクセが強く勧めにくいと評された。煙はきめ細かく香りの持ちも良い。',
  'tangiers:noir kosmik':
    'Al FakherのTwo Applesに近い、ボディのあるマッタリ甘いダブルアップル系。ダークリーフのベース香と重さが加わってドッシリした仕上がりで、煙も程よくソリッド。hookah-reviews.comでは76点で「基本に忠実で、重さによる満足感がしっかりしている」と評された。',
  'tangiers:noir lemon':
    '酸味のシッカリしたクラシックなレモンで、Al Fakherより酸味とビターさが穏やか。ベースの香りも悪目立ちしない。hookah-reviews.comでは85点で「目新しさは無いがバランスが良く、オーソドックスなLemon系が半歩リファインされている」とオススメされた。強めの火加減でも崩れにくい。',
  'tangiers:noir lemon lime':
    'TangiersのNew LimeとLemonを3対2で混ぜた構成で、レモンがライム特有のケミカルさだけを消し、キュッとした輪郭は残るライム系単体のような香り。hookah-reviews.comでは90点で、他社を含めてもライム系で一番との高評価。ただしタバコ的には重い。',
  'tangiers:noir lemon tea':
    '酸味控えめでラムネ菓子のような甘さが混じるレモン系で、瓶詰めの甘め濃いめのレモネードを思わせる香り。商品名の紅茶感はベース香に押されて分かりにくい。hookah-reviews.comでは79点で「変なクセがなく万人受けする」と評された。',
  'tangiers:noir mime':
    'ケミカルさの少ないスッキリした酸味のLemon系に軽やかなLime系を重ねたCitrus系で、Mint由来の弱い清涼感も少し感じられる。hookah-reviews.comでは91点で「New Lemon-Limeよりクリアで軽やかな仕上がり」と評された。酸味はあるがノドへの当たりはソフトで、火の調節も難しくない。',
  'tangiers:noir mimon':
    'Al Fakherのレモンを穏やかにして少し甘くしたソフトなレモンに、Spear Mint感の無い純粋な清涼感を合わせたレモンミント。hookah-reviews.comでは88点で、ベースの香りが上手く活かされた無難に良い出来と評された。ノド越しが良く高温にも比較的耐える。',
  'tangiers:noir mixed fruit 6':
    '王道のグレープフルーツを薄めてサッパリさせた香りが7割、マッタリした甘いパッションフルーツ系が3割ほどのミックス。hookah-reviews.comでは79点で、個々の香りは拾いづらいものの焦点は定まっており好みと評された。煙も安定感もTangiersの平均的な水準。',
  'tangiers:noir nectarine':
    'Al FakherのPeachを1.5〜2倍濃くしたような、丸みのある甘さのマッタリめなPeach系。ケミカルさは控えめで香りの輪郭はハッキリしている。hookah-reviews.comでは75点で「目新しさは無いが、そのぶん無難によく出来ている」と評された。火が強すぎると煙がドライで粗くなる。',
  'tangiers:noir new lemon lime':
    'TangiersのNew LimeとLemonを3対2で混ぜた構成で、レモンがライム特有のケミカルさだけを消し、キュッとした輪郭は残るライム系単体のような香り。hookah-reviews.comでは90点で、他社を含めてもライム系で一番との高評価。ただしタバコ的には重い。',
  'tangiers:noir new lime':
    'ライムリキュール的なケミカルさは少し残るものの、ライムの輪郭がハッキリ出たLime系。ベースの香りが邪魔をせず煙もスムーズだが、火加減を強めるとケミカルさが出やすい。hookah-reviews.comでは88点で「Lime系単体の中で最も良く出来ている」と評された。',
  'tangiers:noir papaya sorbet':
    'パパイアというより濃いめのGreen Apple系に、Melon系のような青臭さ・ウリ臭さが重なるサッパリした甘い香り。きめ細かくスッキリした煙で、高温にも比較的強く扱いやすい。hookah-reviews.comでは87点で「Tangiersの中では間違いなくアタリの部類」と評された。',
  'tangiers:noir passionfruit lemonade':
    '酸味とビターさが程よいクラシックなLemon系に、後味でラムネ菓子のようなお菓子っぽさが少し混じる。パッションフルーツらしさは分かりにくく、煙はTangiersの平均で可もなく不可もなし。hookah-reviews.comでは79点で「少し変わったLemon系単体」と評された。',
  'tangiers:noir peach iced tea':
    '中東系とアメリカ系の中間のようなマッタリ甘いピーチが主体で、後味にダージリンのような華やぎのある紅茶感がホンノリ混じる。紅茶がピーチのクドさを抑え、香りの持ちはやや長め。hookah-reviews.comでは77点で「Mixのバランスは地味に良い」と評された。',
  'tangiers:noir pineapple':
    '缶詰のパインとパイン飴の中間のようなマッタリした香りに、醗酵の進んだ土っぽいダークリーフのベースが強く乗る。煙自体は平均的で扱いやすいが、ベースがパイナップルの香りとぶつかる。hookah-reviews.comでは53点で「他社のPineapple系の方が間違いなく無難」と評された。',
  'tangiers:noir pink grapefruit':
    '厚みのあるビターさが特徴のGrapefruit系で、FumariのTangeloのコクにAl FakherのGrapefruitの酸味を足したような濃い口の香り。hookah-reviews.comでは75点で「サッパリ系好きの好みからは外れるが、Tangelo系の厚みが好きなら気に入る」と評された。タバコ感は重め。',
  'tangiers:noir pumpkin':
    '焼き色のついたパンプキンパイのフィリングのような、少しビターな香ばしさを伴うカボチャの香りに、強めのClove系が重なる。hookah-reviews.comでは78点で「他社より再現度が高く、ベースの香りとも調和して良く出来ている」と評された。やや弱めの火加減が向くが扱いは容易。',
  'tangiers:noir raspberry iced tea':
    '酸味のシッカリしたRaspberry系と、やや渋めに入れたダージリンのような紅茶系が半々のMix。両者が混ざって輪郭がぼやけ、hookah-reviews.comでは55点で「意識して吸わないと何の香りか分かりづらい」と評された。煙持ちと扱いやすさは良いが、Mixのバランスに難がある。',
  'tangiers:noir static starlight':
    '酸味のあるガッシリしたBlack Grape系に、ビターさのあるフローラル系が少し重なりマイルドな余韻を作る。序盤は火が強いと煙がイガイガしやすく、弱めの火加減で維持する必要がある。hookah-reviews.comでは72点で「どちらか1つあれば事足りる」とTangiersのRed Grapeと比較され評された。',
  'tangiers:noir strawberry':
    'イチゴジャムの後味のような、酸味を抑えたマッタリ甘いStrawberry系。中東系にありがちなヘタの青臭さがなく煙もスムーズで香りの持ちは長めだが、タバコ的な重さとベースの香りは残る。hookah-reviews.comでは71点で「Tangiersの中では割と楽しめる部類」と評された。',
  'tangiers:noir summer resort':
    'キュウリを思わせるウリ臭さの強いサッパリした甘い香りに、LemonとLimeのCitrus系が微かに混じる。ソリッドな吸いごたえで香りの持ちも長めだが、低めの火加減で維持する方が調子が良い。hookah-reviews.comでは77点で「キュウリを使った甘いカクテルと思えばキュウリらしさを感じる」と評された。',
  'tangiers:noir tropical punch':
    'ジェリービーンズや缶詰のチェリーを思わせる、酸味とツンとしたケミカルさの強いCherry系が主体で、Orange系はほとんど埋もれている。煙は平均的で焦げにくいがクセは強い。hookah-reviews.comでは60点で「あまり日本人受けはしないと思う」と評された。',
  'tangiers:noir welsh cream':
    'ベイリーズやアーモンドクリームのような、Vanilla系のマッタリした甘さと後味の香ばしさを持つCream系。煙はボリュームとウェットさに優れ、高温にも比較的強く扱いやすい。hookah-reviews.comでは86点で「Tangiersの中では間違いなくアタリの部類」と評された。',
  'tangiers:noir wintergreen':
    '湿布のような清涼感にVanilla系の丸い甘さが加わり、ルートビアと言われても納得の再現度。煙はスムーズでノド越しが良く、火加減も比較的適当で維持できる。hookah-reviews.comでは66点で「ルートビアが好きならかなり良い」と評された。',
  'tangiers:noir yunnan shaddok':
    '和ミカンのようなライトで穏やかなOrange系をベースに、吐き終わりへGrapefruit系に似た微かなビターさが乗るCitrus系。hookah-reviews.comでは83点で「サッパリしたフルーツ系として楽しめる、少し変わった仕上がり」と評された。酸味が控えめで高温にも比較的強い。',
  'tangiers:orange soda':
    'オレンジと和ミカンの中間のような、酸味とビターさを抑えた丸みのある甘さのOrange系で、商品名のソーダらしさは皆無。Citrus系としてはノドへの当たりが穏やかで香りの持ちも良い。hookah-reviews.comのNoir版レビューでは76点で「無難に良く出来ている」と評された。',
  'tangiers:papaya sorbet':
    'パパイアというより濃いめのGreen Apple系に、Melon系のような青臭さ・ウリ臭さが重なるサッパリした甘い香り。きめ細かくスッキリした煙で、高温にも比較的強く扱いやすい。hookah-reviews.comのNoir版レビューでは87点で「Tangiersの中では間違いなくアタリの部類」と評された。',
  'tangiers:pink grapefruit':
    '厚みのあるビターさが際立つグレープフルーツ系で、FumariのTangeloとAl Fakherのグレープフルーツを合わせたような濃い口。酸味と苦味ゆえ喉への当たりはあるが、高温でも焦げにくい。hookah-reviews.comでは75点で「サッパリ系好みには合わないが、香りだけなら気に入る人はいる」と評された。',
  'tangiers:pumpkin':
    '焼き色のついたパンプキンパイのフィリングを思わせる香ばしい甘さに、クローブ系のスパイスがはっきり重なる香り。皮の土臭さのようなベース香とも調和し、他社のパンプキン系より再現度が高い。hookah-reviews.comでは78点で「よく出来ている」と評された。',
  'tangiers:schnozzberry':
    'ブルーベリー系とメロン系がほぼ半々のミックスで、輪郭のはっきりした甘さに人工的なキレのあるウリ臭さがアクセントとして乗る。煙は安定していて扱いやすいが、駄菓子めいたケミカルさは好みが分かれる。hookah-reviews.comでは70点で「マズくはないが好きでもない」と評された。',
  'tangiers:sevilla orange':
    'ベルガモット、あるいは着香の強いアールグレイのような香りで、甘さ控えめに柑橘の皮のビターさが出た引き締まった味。ベース香が紅茶らしさを補い、高温にも耐えて扱いやすい。hookah-reviews.comでは88点で「よく出来ている、オススメ」と評された。',
  'tangiers:summer resort':
    'キュウリを思わせるウリ臭さの強いサッパリした甘さが主体で、吐き終わりにレモン系とライム系が微かに混じる。AzureのCool Cucumberに近いがやや甘めで、煙はTangiersの平均的な質。hookah-reviews.comでは77点で「濃いウリ臭さに新しさがあり、暑い日に良さそう」と評された。',
  'tangiers:watermelon':
    'スイカの中心部だけをくり抜いたようなマッタリ甘いアメリカ系のウォーターメロンで、ウリっぽい青臭さは控えめ。土っぽいベース香が目立つ一方、煙質と火加減の安定感は良好。hookah-reviews.comでは75点で「目新しさはない」と評された。',
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
