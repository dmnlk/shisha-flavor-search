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
  // Fumari — 日本語レビューブログ hookah-reviews.com (byダビデ) の各フレーバー記事を要約
  // (2026-09 時点)。記事は全て通常ラインのため、財務省公告名が Fumari Dark の銘柄では
  // 本文に「通常ライン版レビューでは」と出典ラインを明記している。
  // 表記ゆれは同一商品として同じ記事を共有: Blackberry = Black Berry、
  // Fumari (Apple Blend) = Fumari、Limoncello = Limonchello、
  // Red Gummi Bear = Red Gummy Bear、Tutti Fruitti = Tutti Frutti、
  // Mandarinzest = Mandarin Zest。
  // 記事が見つからなかった Apple Squared / Banana Custard / Caramel Kiss /
  // Cinnamon Latte / Dark Earl Grey / Earl Grey Brulee / Enlighten Mint /
  // Hola Peaches / Mandarin Mint / Orange Gummi Bear / Peach N Ice /
  // Peaches N Honey / Pink Gummi Bear / Raspberry Swirl / Razzberry Bliss / RGB /
  // Salep / Shaka Guava / Strawberry Jam / Summer Sorbetto / Watermelon Sugarush /
  // WGB は意図的に未記載。
  'fumari:aloha mango':
    'トロピカルフルーツらしい濃くマッタリした甘さのマンゴーに、ごく微かなクリーム系のテイストが混じり、マンゴラッシーを思わせる仕上がり。hookah-reviews.comでは82点で「良く出来ていると思った。好きな人は多いと思う」と評された。ウェットな煙との相性が良く、火の調節もしやすい。',
  'fumari:ambrosia':
    'マスクメロンの中心部のような、甘さではなく香りの濃さで表現したシックなメロン。hookah-reviews.comでは84点で「甘さではなく香りの濃さでメロンを表現しており、煙の質もMelon系ながら非常にスムーズ」と評された。ストレートボウルだと火の調節は難しめ。',
  'fumari:apple mint':
    'ややマッタリした甘いアップルに、Fumariにしては強めのキリッとした清涼感が重なる一本。hookah-reviews.comでは60点で「FumariのFakhfakhinaやGranny SmithやTriple Appleと比べると少し見劣りする」と評され、平凡な香りと辛口に評価された。煙はウェットでボリュームがある。',
  'fumari:blackberry':
    'ビターさや酸味はなく、ベリーの皮のような野趣味あるテイストが特徴の甘い香り。hookah-reviews.comでは77点で「スッとした軽い煙の吸い心地と香りの相性が良かったので、高得点をつけた」と評された。後味に少しクセがあり、香りの持ちはやや短め。',
  'fumari:blueberry muffin':
    'ブルーベリー7に小麦とバターとバニラの焼き菓子らしい香り3が重なり、確かにブルーベリーマフィンと分かる斬新な香り。hookah-reviews.comの通常ライン版レビューでは79点で「名前だけ聞くとゲテモノっぽいが、非常に美味しい。香りも煙も実に優秀」と評された。',
  'fumari:caribbean colada':
    'ココナッツ2対パイナップル1のピニャコラーダ系で、バニラ寄りのクリームやミルクのようなテイストが強く、カドのないマッタリした甘さ。hookah-reviews.comでは81点で「これは結構楽しめた」と評され、ウェットな煙と香りの相性の良さが評価された。',
  'fumari:cherry':
    '真っ黒に熟れたアメリカンチェリーの皮、あるいはシロップ漬けのダークチェリー缶詰のような、コクのあるシックな香り。hookah-reviews.comでは76点で「ケミカルなクセが無い割に、香りに良い特徴がありハッキリしている」と評された。香りを出すにはやや強めの火加減が要る。',
  'fumari:citrus mint':
    'オレンジ主体のシトラスに控えめなミントの清涼感を重ねた、全体にやや薄味で優しい作り。hookah-reviews.comでは50点で「このレベルのCitrus Mintは他社にもあるので、目新しさなどは無い」「過度に期待するとハズレるだろう」と辛口に評された。',
  'fumari:citrus tea':
    '華やかな紅茶8にレモン寄りのシトラス2で、ビターでフローラルなアールグレイ調の香り。hookah-reviews.comでは50点で「調節にさえ気を使えば、かなりアールグレイっぽい香りだと思った」と評されたが、Fumariのベースの香りとぶつかりやすく安定感には欠ける。',
  'fumari:dark blueberry muffin':
    'ブルーベリー7に小麦とバターとバニラの焼き菓子らしい香り3が重なり、確かにブルーベリーマフィンと分かる斬新な香り。hookah-reviews.comの通常ライン版レビューでは79点で「名前だけ聞くとゲテモノっぽいが、非常に美味しい。香りも煙も実に優秀」と評された。',
  'fumari:dark mint':
    'ほんのりした甘さに弱めのメンソール感でスペアミント香はなく、濃霧のように異様にウェットな煙の質が最大の特徴。hookah-reviews.comの通常ライン版レビューでは75点で「単体で吸いたいフレーバーではないが、Mix素材としての使い勝手は非常に良い」と評された。',
  'fumari:dark orange cream':
    '穏やかでソフトなオレンジを、バニラを思わせるソフトなクリームの香りが薄く覆う、一体感のあるミックスバランス。hookah-reviews.comの通常ライン版レビューでは76点で「ピーク時の香りは非常に美味しい」と評される一方、香りの持ちの短さが難点とされた。',
  'fumari:dark spiced chai':
    'マイルドなクリーム系6〜7にトゲのないシナモン4〜3で、砂糖多めのチャイあるいはシナモンキャラメルのような香り。hookah-reviews.comの通常ライン版レビューでは79点で「香りも煙も良い。甘いSpice系の香りが好きならば、さらに高得点がつくだろう」と評された。',
  'fumari:dark white peach':
    '果物というよりシーシャのピーチ然とした香りで、マッタリした甘さと厚みが調和した洗練された仕上がり。hookah-reviews.comの通常ライン版レビューでは86点で「定番の香りが非常な高水準でまとまっている」と評された。香りの持ちも長く、火の調節も容易。',
  'fumari:double apple':
    'リコリスの香りが混じるダブルアップルで、Nakhlaより果物のリンゴらしい甘さが強く、クセは控えめで吸いやすい。ボリュームのあるウェットな煙で、タバコ的には軽いが満足感のある吸いごたえがある。hookah-reviews.comでは70点で「煙にFumariの特徴が出ていて良い」と評された。',
  'fumari:fakhfakhina':
    '実物のリンゴに近いナチュラルで穏やかな甘さが特徴で、青リンゴ系でもリコリス入りのダブルアップル系でもない路線。ボリュームがありながらウェットでスムーズな煙。hookah-reviews.comでは79点で「Triple Appleと甲乙つけがたい優秀な出来」と評された。',
  'fumari:french vanilla':
    'バニラの粒を思わせる濃いめの甘い香りだが、StarBuzzのVanillaよりケミカルさが控えめで軽やか。火が強すぎるとタバコっぽさと煙のドライさが出るため火加減はやや難しく、香りの持ちは長め。hookah-reviews.comでは73点で「無難かつ優秀なまとまり」と評された。',
  'fumari:fumari apple blend':
    '青リンゴか早熟れの洋ナシを思わせる香りで、Triple Apple・Granny Smith・Blackberryを混ぜたような調和のある仕上がり。甘さは強めだがApple系のキレで締まる。hookah-reviews.comでは77点で「細かいことをゴチャゴチャ考えずに吸うと非常に美味しい」と評された。',
  'fumari:granny smith':
    '青リンゴ味の菓子のような香りにリコリスが加わり、吐くときにスッと抜けるキレがある。甘さは強いがスッキリまとまり、火加減やボウルの種類で香りの出方が変わる。hookah-reviews.comでは79点で「他社には見かけない、Apple系の香りへの新しいアプローチ」と評された。',
  'fumari:grape':
    '巨峰などの紫色のブドウを思わせる、穏やかな甘さとコクのBlack Grape系。ノドに残るクドさもAl Fakherのような酸味も無く、StarBuzzのBlack Grapeよりサッパリ軽めで火の調節も安定。hookah-reviews.comでは75点で「手堅い作り」と評された。',
  'fumari:guava':
    '水々しい果物を思わせるサッパリした甘い香りで、Guava系特有の鼻を抜けるテイストが他社より控えめで吸いやすい。煙はスムーズで香りの持ちも平均より長め。hookah-reviews.comでは73点で「Fumariらしくバランスなどの完成度は高い」と評された。',
  'fumari:island papaya':
    'ややマッタリしたシッカリめの甘さに、フルーツの表面のような青味が重なり、甘いのにどことなくサッパリした余韻。水々しくキメ細かい煙がしっかり出る。hookah-reviews.comでは77点で「Fumariらしいキメ細かく水々しい煙で、吸い心地が良かった」と評された。',
  'fumari:jasmine':
    'マイルドさと甘さが強いフローラルな香りで、辛さやビターさは無いが全体にマッタリしてややクドめ。煙はウェットでスムーズなものの、hookah-reviews.comでは55点と辛口で「途中からクドく感じて飽きが来た」と評された。ローズ系が好きな人向け。',
  'fumari:lemon':
    '他社より薄味な作りで、酸味やビターさが非常に控えめなフレッシュなレモンの果肉らしい香り。皮目のようなビターさが奥行きを与え、低刺激ながら吸いごたえのある煙。hookah-reviews.comでは78点で「香りと余韻のバランスや煙の質など優秀な部類」と評された。',
  'fumari:lemon loaf':
    'ソフトなレモンに、バター多めのシットリしたマフィンのような焼き菓子の香りが重なる、アイシングのかかったパウンドケーキ然とした一本。焼き菓子の香りが最後まで続き扱いやすい。hookah-reviews.comでは82点で「焼き菓子っぽい香りの出来が良く、それがハッキリと出る」と評された。',
  'fumari:lemon mint':
    'FumariのLemonの薄味ながら奥行きのあるレモンに、キリッとした強めの清涼感を重ねたミックス。煙はスムーズで、PhunnelとCoco Naraの組み合わせなら火の調節も容易。hookah-reviews.comでは76点で「FumariのLemonの出来も良かったが、これも出来が良い」と評された。',
  'fumari:limoncello':
    '酸味のようなテイストが強くビターさは控えめなレモンで、Citrus系らしいガッシリしたボディのある吸いごたえが特徴。煙のドライさは無く、強めの火加減でも崩れない安定感。hookah-reviews.comでは79点で「基本に忠実かつ良く出来ている」と評された。',
  'fumari:mandarin zest':
    'かすかにビターさのある、キレと爽やかさを備えたシーシャらしいオレンジの香り。Fumariらしいウェットで濃い煙が爽やかさを邪魔せず、強めの火加減でも崩れないが、30〜40分で香りが薄れ始める。hookah-reviews.comでは73点で「香りの持ちは悪いが香り自体は美味しい」と評された。',
  'fumari:mandarinzest':
    'かすかにビターさのある、キレと爽やかさを備えたシーシャらしいオレンジの香り。Fumariらしいウェットで濃い煙が爽やかさを邪魔せず、強めの火加減でも崩れないが、30〜40分で香りが薄れ始める。hookah-reviews.comでは73点で「香りの持ちは悪いが香り自体は美味しい」と評された。',
  'fumari:mimosa':
    'サッパリしたピーチ系の香りとFumariのオレンジを1対2ほどで合わせたような、甘めのフルーツミックス。ボリュームのあるスムーズな煙で香りの持ちも良く、調節も容易。hookah-reviews.comでは65点で「シンプルに吸えば普通に美味しいが、Fumariの他のフルーツ系と比べると少し霞む」と評された。',
  'fumari:mint':
    'ほんのりした甘さに弱めのメンソール感でスペアミント香はなく、濃霧のように異様にウェットな煙の質が最大の特徴。hookah-reviews.comの通常ライン版レビューでは75点で「単体で吸いたいフレーバーではないが、Mix素材としての使い勝手は非常に良い」と評された。',
  'fumari:mint chocolate chill':
    'ミルクの甘さを感じるクドさのないチョコレートに、Fumariとしては強めの清涼感を重ねたチョコミント。粉っぽさが無くザラつかない煙で、清涼感もチョコの香りも長く続く。hookah-reviews.comでは73点で「駄菓子っぽくないチョコレートの香りを求めるならオススメできる」と評された。',
  'fumari:mochaccino':
    '外国のキャンディに入ったコーヒークリームのような、クリーム系の甘さに焦げたビターさが混じる香り。ウェットな煙が苦味のザラつきを抑え、香りの持ちも長めで火の調節も容易。hookah-reviews.comでは65点で「欠点は無いが最近のCoffee系の典型でやや没個性的」と評された。',
  'fumari:mojito mojo':
    'ガムシロップ多めのモヒートのような香りで、アルコールを思わせるテイストが強く、余韻にライムの絞り汁らしい香りが残る。清涼感はFumariとしては強めで、煙は軽く扱いやすい。hookah-reviews.comでは74点で「他社には無いモヒートへのアプローチで実物の再現度も高い」と評された。',
  'fumari:nectarine':
    '桃を剥かずに嗅いだようなコクがあり、強い甘さに負けない濃い口でハッキリしたピーチの香り。ボリュームと密度のある煙が濃厚な甘さと噛み合い、強めの火加減でも崩れず安定感も良い。hookah-reviews.comでは84点で「他社のPeach系と比べてもかなり良く出来た部類」と評された。',
  'fumari:orange':
    'シトラスらしいシャープさを抑えた、トゲのないソフトで甘く穏やかなオレンジ。ウェットでボリュームのある煙は良いが香りとの相性は今ひとつで、持ちも短く早めにグリセリンっぽい甘さが出る。hookah-reviews.comでは60点で「Orange系の割に香りと煙をソフトにまとめすぎ」と評された。',
  'fumari:orange cream':
    '穏やかでソフトなオレンジを、バニラを思わせるソフトなクリームの香りが薄く覆う、一体感のあるミックスバランス。hookah-reviews.comの通常ライン版レビューでは76点で「ピーク時の香りは非常に美味しい」と評される一方、香りの持ちの短さが難点とされた。',
  'fumari:passion fruit':
    'トロピカルフルーツらしいマッタリした甘さにかすかな酸味と、マンゴー系に通じるワックスっぽさが微かに混じる香り。やや薄味ながら再現性は高く、香りの持ちも少し長め。hookah-reviews.comでは68点で「出来は良く、マッタリしたTropical Fruit系が好きならもっと高得点」と評された。',
  'fumari:plum':
    '爽やかさと水々しさが際立つ、非常にサッパリした仕上がりのピーチ系で、スモモやアンズらしく香りの焦点がハッキリしている。ウェットでボリュームのある煙が最後までシッカリ香る。hookah-reviews.comでは73点で「非常に軽くサッパリしたPeach系を探しているならオススメできる」と評された。',
  'fumari:prickly pear':
    'クドさのない甘い香りに、果物の青味とサワーアップル系のような水々しさが少し混じるサッパリした一本。煙の質はFumariの平均よりやや粗いが、持ちは少し長めで安定感は問題ない。hookah-reviews.comでは78点で「サッパリしていて美味しく、Strawberry系が好きなら試す価値はある」と評された。',
  'fumari:purple grape':
    'ホワイトグレープ系とブラックグレープ系が1対1ほどの、渋みと酸味が控えめで穏やかなシーシャらしいグレープミックス。ボウル次第で香りの出方が変わり、陶器のPhunnel系の方が特徴が出る。hookah-reviews.comでは73点で「商品名にある紫色のブドウとは言いにくい」と評された。',
  'fumari:raspberry':
    '酸味のあるフルーツらしいサッパリした甘い香りだが、他社のRaspberryと比べてかなり薄味で輪郭が掴みにくい。煙は厚くウェットで良いものの序盤の香りのノリが悪く、調節に手間がかかる。hookah-reviews.comでは40点で「ラズベリーっぽい香りが薄く、個人的にはイマイチ」と評された。',
  'fumari:red gummi bear':
    'チェリーのコクにラズベリーのような酸味を重ねた、クセのない穏やかな甘さの赤いフルーツミックス。グミらしいケミカルさは控えめで、きめ細かく軽い煙は45分ほど香りが持つが序盤は蒸らしが要る。hookah-reviews.comでは75点で「クセが無く吸いやすく割とオススメ」と評された。',
  'fumari:sour cherry':
    'ドッシリとしたシックな香りに少々の酸味が乗る、他社には珍しいチェリー系。ツンとしたケミカルな感じが控えめで、漠然としたフルーツ感がシックなコクを生む。hookah-reviews.comでは72点で「他社には珍しい面白い出来」と評され、ウェットな煙との相性も良く、火を強めても崩れにくいとされる。',
  'fumari:spiced chai':
    'マイルドなクリーム系6〜7にトゲのないシナモン4〜3で、砂糖多めのチャイあるいはシナモンキャラメルのような香り。hookah-reviews.comの通常ライン版レビューでは79点で「香りも煙も良い。甘いSpice系の香りが好きならば、さらに高得点がつくだろう」と評された。',
  'fumari:strawberry':
    'どことなくクリーミィな甘さのストロベリーで、いちごみるくのキャンディを思わせる優しい香り。青味やエグさは無いが、序盤はベースの香りが強いスロースターター。hookah-reviews.comでは70点で「群を抜いた出来ではないが、平均点はクリアしている」と評された。',
  'fumari:sweet mint':
    'ややマッタリした甘さが強めのスペアミント系で、清涼感はシャープで強め。少々のビターさとグリーンな香りがクドさを上手く抑えている。hookah-reviews.comでは77点で「良く出来たSpear Mint系」と評され、香りの持ちも平均より少し長い。',
  'fumari:tangelo':
    '穏やかでマッタリとした厚みのあるビターさが主役のグレープフルーツ系で、その陰に丸みのある甘いオレンジの香りが漂う。hookah-reviews.comでは80点で「マッタリしたビターさが非常に特徴的かつ美味」と評され、ウェットな煙の質との相性も良いとされる。',
  'fumari:triple apple':
    'リコリスの香りが無い、キレのある爽やかな甘さのアップル系。ダブルアップルの遠い延長線上にある力強さがあり、穏やかなFakhfakhinaとは対照的。hookah-reviews.comでは80点で「キレのある力強い香り」と評され、火の調節も容易とされる。',
  'fumari:tropical mango':
    '他社より少しアッサリした軽めのマンゴーで、シーシャらしい香りと実物っぽさが半々。強い甘さやワックスっぽさが少なく吸いやすい。hookah-reviews.comでは71点で、香りの出来は悪くないものの「香りのノリの悪さや持ちの悪さ」から点数は低めにつけられた。',
  'fumari:tropical punch':
    '酸味のある爽やかなオレンジが主役で、コクのあるチェリーがアクセントに乗るフルーツミックス系。マンゴーやココナッツの香りはしない。hookah-reviews.comでは78点で「最初からCalifornia Dream系と思って吸えば非常に美味しい」と評され、煙の質と香りの持ちも優秀。',
  'fumari:tutti fruitti':
    'バニラとクリームのお菓子っぽい可愛らしい甘さに、漠然としたフルーツ感が混じるバニラアイス系の香り。hookah-reviews.comでは71点で、香り自体はなかなかの完成度としつつ「火の調節の難が悔やまれる」と評された。強めの火加減で蒸らす工夫が要る。',
  'fumari:watermelon':
    'Nakhlaよりマッタリした甘さに皮っぽい香りが少々混じり、余韻にウリ科特有の青っぽさが強く出るスイカ。hookah-reviews.comでは73点で「Fumariにしては香りの輪郭がハッキリしていて分かりやすい」と評された。煙はやや粗めで火加減に気を使う。',
  'fumari:white grape':
    'クセのないスッキリした甘さの定番グレープで、Al FakherのGrapeに似ながら酸味のようなテイストが穏やかでソフト。hookah-reviews.comでは77点で「Grape系としては文句なく美味しい」と評され、Al Fakherよりずっと軽く香りの持ちも長いとされる。',
  'fumari:white gummi bear':
    'お菓子っぽい人工的なミックスフルーツの香りで、吐き終わりに残るグミの後味のようなケミカルさが特徴。StarBuzzより穏やかでクセは少ない。hookah-reviews.comでは73点で「クセのないお菓子っぽいミックスフルーツの香りをソフトに楽しみたいならオススメ」と評された。',
  'fumari:white peach':
    '果物というよりシーシャのピーチ然とした香りで、マッタリした甘さと厚みが調和した洗練された仕上がり。hookah-reviews.comの通常ライン版レビューでは86点で「定番の香りが非常な高水準でまとまっている」と評された。香りの持ちも長く、火の調節も容易。',
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
