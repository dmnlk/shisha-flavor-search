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

// SEBERO — 財務省公告に別名で登録されている同一商品向けの共有説明
const SEBERO_EZHEVIKA =
  '熟したブラックベリーの野性的な甘酸っぱさを再現。htreviewsでは評価数が少なく賛否が割れており、「ソロだと石鹸っぽさが出るのでミックス向き」という指摘が目立つ (リピート意向50%)。'
const SEBERO_BLACK_FEIJOA =
  'フェイジョアの果肉の甘酸っぱさを狙った一本。htreviewsでは「草っぽい甘さのフェイジョアでハーブ系ミックスに合う」という評と「フェイジョアに程遠い」という酷評が拮抗し、リピート意向33%と評価は厳しい。'
const SEBERO_BLACK_SOURNESS =
  'シベリア産を謳う酸っぱいクランベリー。htreviewsでは「クランベリーとは分かるが香りが弱く、土っぽさを感じる」という指摘が多く、4点評価が中心ながらリピート意向59%と評価は伸び切らない。'

// Azure — Black Line / Gold Line で着香が共通の銘柄向けの共有説明
const AZURE_ALASKAN_ICE =
  '甘さやビターさを排した純粋な清涼感だけのアイス系。hookah-reviews.comでは90点で「AFBMのPolar Freezeに近いクリアでシャープな冷たさ」と高く評価された。単体では単調だが3〜4g混ぜるだけで効くのでミックスの清涼剤として使いやすい。'
const AZURE_APPLE_CIDER =
  'シナモンやナツメグ、オールスパイスを効かせた青りんご系。hookah-reviews.comでは66点で「りんご2・青りんご1・シナモン1ほどの構成だが、余韻でシナモンの土っぽさが悪目立ちする」と辛口に評された。'
const AZURE_BARISTAS_CHOICE =
  'ビターさが前に立つストレートなコーヒー。hookah-reviews.comでは65点ながら「クラシックなコーヒー系と今風の中間で、適当に調節しても焦げたり崩れたりしにくい」と評価 (評者自身がコーヒー系を苦手と明記)。バニラ系やチョコ系との少量ミックス向き。'
const AZURE_BERMUDA_MINT =
  'Azure最強を謳うミント。hookah-reviews.comでは77点で「クリアでシャープな清涼感に控えめな甘さと微かなビター」と評され、清涼感の強さは同社Morocco Menthaより少し上、TFDのDurty Mintと同程度とされる。フルーツ系との相性が良い。'
const AZURE_BERRYMANIA =
  'ブルーベリー4・ストロベリー2・ラズベリー1ほどのベリーミックス。hookah-reviews.comでは79点で「濃いブルーベリーキャンディやジャムのような分かりやすい香り」と評価。htreviewsでも4点評価が中心で、火加減が適当でも崩れにくい。'
const AZURE_CACTUS_BLAST =
  '名前に反してサボテンではなく、パイナップル主体にマンゴーを重ねたトロピカルソーダ。hookah-reviews.comでは76点で「紙パックのフルーツオレのような香り」と評された。htreviewsでは賛否が分かれリピート意向は50%。'
const AZURE_CALIFORNIA_BLUE =
  'ブルーベリーにミントを合わせた鉄板ミックス。hookah-reviews.comでは76点で「Berrymaniaが濃いブルーベリーキャンディなら、こちらはブルーベリーの板ガムに少しの清涼感」と評され、清涼感はAl Fakherのミントの1/3ほどと穏やか。'
const AZURE_COCOMANIA =
  'ブルーベリー系にココナッツを少量重ねたミックス。hookah-reviews.comでは77点で「半透明のココナッツジュースと乳白色のココナッツミルクを半々にしたようなイメージ」と評され、ココナッツ系にありがちな辛みやゴム臭が無いのが利点。'
const AZURE_COLA =
  'コーラ飲料そのものの再現を狙った一本。hookah-reviews.comでは72点で「吐き終わりの余韻はコーラを飲んだ後の口中そのものだが、吸っている最中は輪郭がぼやけてコーララムネ寄り」と評価。htreviewsは母数こそ少ないが5点評価が付いている。'
const AZURE_COPACABANA =
  'リオデジャネイロのビーチ名を冠したスイカ×ミント。代理店は「フレッシュウォーターメロンミント」と紹介しており、日本では馴染みの薄い組み合わせだが海外では各社が作る定番構成。'
const AZURE_COSMOS =
  '公式はグレープフルーツにラズベリーを合わせたミックスとするが、hookah-reviews.comでは80点で「ラズベリーはほとんど分からず、厚みのあるビターさが特徴のグレープフルーツ単体と思った方が楽しめる」と評価。弱火でビター、強火で酸味が立つ。'
const AZURE_CUCUMELON =
  'メキシコなどで食べられる小さなウリ「キューカメロン」を模した変わり種。代理店は「Cool Cucumberからミントを抜いてスイカの甘みを足した感じ」と説明しており、青臭さが強いためウリ系好き向け。'
const AZURE_D_CHERRY =
  '赤黒く濃厚なダークチェリー。代理店によればTangiersのDark Cherryを手本に「使いやすく分かりやすいダークチェリーが他に無かった」ことから開発された銘柄で、チェリーパイのジャムのような濃さが特徴。'
const AZURE_DUBAI_APPLE =
  '玄人好みのダブルアップル。hookah-reviews.comでは77点で「粉コショウのような香りが主役でリコリスは控えめ」と評され、他社のダブルアップルとは大きく異なる。火加減で香りが変わりにくく扱いやすい一方、単体では飽きやすい。'
const AZURE_GRAPEFRUIT =
  '代理店がAzure本社に依頼して共同開発したグレープフルーツ。作りやすさと味持ちをテーマに設計されており、ファンネルでは爽やかに、エジプシャンボウルでは酸味が出やすいとされる。'
const AZURE_ICE_PEAR =
  'カリフォルニア産の西洋梨の甘みとジューシーさをアイスで引き締めた一本。代理店によれば梨7・アイス3ほどの構成であくまで梨が主役で、味持ちの良さが持ち味。バニラを足すとデザート系にもなる。'
const AZURE_LEMONGRASS =
  '酸味の控えめなライトなレモン系に、若草のようなクセの無いグリーンな香りを重ねたハーブ系。hookah-reviews.comでは79点で「レモングラスを知っていれば納得の再現度」と評価。やや弱めの火加減で維持しないと酸味に埋もれる。'
const AZURE_LIFES_PEACH =
  '缶ジュースのネクターを少し濃くしたような、甘さの強い桃。hookah-reviews.comでは77点で「実物の桃ではなくジュース寄りだが、輪郭がはっきりしてメリハリがある」と評価された。火の調節は難しくない。'
const AZURE_LIME =
  'カクテル用ライムシロップやリキュールを思わせるライム単体。hookah-reviews.comでは79点で「TFDのLimeやSBVのFresh Limeとよく似た、実物より皮を強調した香り」と評され、輪郭が明確でミックスでも主張が残る。'
const AZURE_LIME_COLA =
  'ライムとコーラを1本にまとめた銘柄。2023年にAzure工場で試作され、代理店曰く「黄金比率」を突き詰めて製品化が決まった経緯を持つ。人気の2種を混ぜる手間なく吸えるのが利点。'
const AZURE_LIMONCELLO =
  'イタリアのレモンリキュールを模した、シーシャでは珍しく酸味の立つレモン。hookah-reviews.comのGold Line評は81点で「クラシックなレモン系にアルコールを模した人工的なビターさが少し乗る」。火が強いと酸味が出過ぎるので弱めが無難。'
const AZURE_MANGO_CHEESECAKE =
  'マンゴーとクリームがほぼ半々のデザート系。hookah-reviews.comでは84点で「チーズ感はほとんど無く実質マンゴー×クリームだが、濃いめのマンゴーラッシーとして完成度が高い」と評価。火加減が適当でも崩れにくい。'
const AZURE_MEXICOLA =
  'メキシコの瓶コーラを模したスパイシー寄りのコーラ。hookah-reviews.comでは79点で「実物のコーラとコーララムネの中間で、シーシャのコーラ系としては珍しく再現度が高い」と評価。シナモン感は中盤でピークアウトする。'
const AZURE_PAPAYA =
  '熟したパパイヤの果汁感を主役にしたトロピカル系。代理店は「一番近いのはTangiersのPapaya Sorbet」と表現し、Royal MangoやQueen Of Fruits、Passion Fruitが好きな人向けと位置づけている。'
const AZURE_PASSION_FRUIT =
  '甘酸っぱさが軽やかな常夏系パッションフルーツ。代理店は単体でも吸える上にマンゴー・グアバ・パインなど何と混ぜても喧嘩しない使いやすさを推しており、神津島の特産に着想を得てAzureへ製造を依頼した経緯がある。'
const AZURE_PINKY =
  'ピンクグレープフルーツにストロベリー、少量のラズベリーを重ねたミックス。代理店によればAzure代表がロシアでMustHaveのPinkmanを吸って気に入り、それを手本に作らせたAzure版ピンクマン。'
const AZURE_POMEGRANATE =
  'ザクロの再現度が高い一本。hookah-reviews.comでは74点で「甘さの後ろに実物特有の土臭さがあり、MustHaveのRed Bombと双璧」と評価された。陶器のファンネルだと土臭さが強く出る。'
const AZURE_QUEEN_OF_FRUITS =
  '代理店の11周年記念フレーバーで、テーマはマンゴスチン。倒産したHookahHookah社のMangosteenを約1年かけてAzure工場で復刻したもので、トロピカルフルーツの甘さと透明感を併せ持つ。'
const AZURE_RASPBERRY_VANILLA =
  '同社Royal Raspberry7・Vanilla Bean3ほどのバランスで作られた濃厚なラズベリー。代理店は「グリコのパナップにそっくり」と表現しており、売れ行きに苦戦したラズベリーと品切れ続きのバニラを掛け合わせた企画と説明している。'
const AZURE_SOLANA_BEACH =
  'カリフォルニアのビーチ名を冠したメロン系ミックス。代理店によればかき氷のメロンシロップを軸にした甘い構成で、Azure代表がTangiersのForeplay on the Beachを念頭に作ったとされる。'
const AZURE_SOUR =
  'ハリボーのサワーグミのザラメを舐めたような、柑橘系の酸味を前面に出した一本。Azure代表企画の銘柄で、代理店はエジプシャンボウルで作るとより酸味が出ること、フルーツ系に30〜40%足す使い方を勧めている。'
const AZURE_STRAWBERRY_GUAVA =
  'ストロベリー3・グアバ1ほどのミックス。hookah-reviews.comでは68点で「イチゴのヘタのような青臭さが強いクラシック系ストロベリーが主体で、グアバは分かりにくい」と評され、htreviewsでも評価は低調。'
const AZURE_STRONG_LYCHEE =
  'どんな作り方でも濃厚に出るよう2024年に調整されたライチ。シリコンボウルなどで薄く感じる人がいたことを受けて香りを強めた改良版で、代理店の看板であるライチ系の中ではミックス用途に重宝される。'
const AZURE_WATERMELON =
  '甘くさっぱりとしたスイカ。公式は「スイカバーのような瑞々しい甘さ」と表現しており、夏向けの素直なフルーツ系として位置づけられている。'
const AZURE_CINNAMON_COOKIE =
  'シナモン入りのバターキャンディのような焼き菓子系。hookah-reviews.comでは79点で「主役はヴェルタース・オリジナル系のバターキャンディ香で、そこにシナモンが少々」と評価。バターは強火、シナモンは弱火で出るため火の調節が難しい。'

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

  // Azure — hookah-reviews.com (byダビデ) / htreviews.org / 日本総代理店 tokyoshisha.com /
  // ばんびえん (vangviengshisha.com) の情報を要約 (2026-09 時点)。
  // Black Line = カリフォルニア産ダークリーフ (重め)、Gold Line = ウォッシュド (軽め) で、
  // 同名フレーバーは着香が共通。hookah-reviews.com は原則 Black Line 版のみをレビューして
  // いるため、Gold 側では点数の出典ラインを本文に明記している。
  // 公開情報が見つからなかった Black Berry / Cherry Coke / Green Apple / MXN Cola /
  // Whisky / White Chai / White Jasmine Chai は意図的に未記載。
  'azure:hookah tobacco black line alaskan ice': AZURE_ALASKAN_ICE,
  'azure:hookah tobacco black line apple cider': AZURE_APPLE_CIDER,
  'azure:hookah tobacco black line barista s choice': AZURE_BARISTAS_CHOICE,
  'azure:hookah tobacco black line bermuda mint': AZURE_BERMUDA_MINT,
  'azure:hookah tobacco black line berrymania': AZURE_BERRYMANIA,
  'azure:hookah tobacco black line blueberry':
    'ダークリーフらしい吸いごたえのあるブルーベリージャム系。hookah-reviews.comでは71点で「香りはややサッパリめだが甘さは強めという変わったブルーベリーで、ツンとしたキレが強く輪郭がはっきりしている」と評され、ミックスでも主張が残る。',
  'azure:hookah tobacco black line cactus blast': AZURE_CACTUS_BLAST,
  'azure:hookah tobacco black line california blue': AZURE_CALIFORNIA_BLUE,
  'azure:hookah tobacco black line cocomania': AZURE_COCOMANIA,
  'azure:hookah tobacco black line cola': AZURE_COLA,
  'azure:hookah tobacco black line copacabana': AZURE_COPACABANA,
  'azure:hookah tobacco black line cosmos': AZURE_COSMOS,
  'azure:hookah tobacco black line cucumelon': AZURE_CUCUMELON,
  'azure:hookah tobacco black line d cherry': AZURE_D_CHERRY,
  'azure:hookah tobacco black line down under':
    'キウイ5・ブルーベリー3・アイス2ほどのミックス。Azureのオーストラリア法人が現地限定で開発した銘柄で、現地でAl Fakherのキウイ×ブルーベリー×ミントの組み合わせが人気だったことから製品化された。代理店は飽きの来ない味と評価している。',
  'azure:hookah tobacco black line dubai apple': AZURE_DUBAI_APPLE,
  'azure:hookah tobacco black line grapefruit': AZURE_GRAPEFRUIT,
  'azure:hookah tobacco black line green tea':
    '日本限定のグリーンティーをダークリーフで仕上げた濃厚版。代理店は「Gold Lineより渋く深く重い、苦味手前のくどいぐらい濃厚な仕上がり」「京都の抹茶のよう」と表現しており、味が濃く寿命が長いためミックスのベースにも向く。',
  'azure:hookah tobacco black line grow a pear':
    '甘みと酸味の均衡した洋梨。hookah-reviews.comでは82点で「熟していない固めの洋ナシ、あるいはシンプルな青りんご系」と評され、弱めの火加減で維持すると洋梨らしさが出る。ダークリーフのBlack LineはGold Lineより果実感が強いとされる。',
  'azure:hookah tobacco black line guavi':
    'グアバ50・キウイ30・ライム20のミックス。グアバの濃厚な甘み、キウイの刺すような酸味、ライムのほろ苦い酸味が時間差で来る構成で、同じ代理店が考案したDown Underと方向性が近い。',
  'azure:hookah tobacco black line ice lime':
    '凍らせたライムの鋭い酸味と強い冷感を組み合わせたアイス系。アメリカで人気化して2026年3月に日本へ入ってきた新しい銘柄で、公開されている情報は代理店の告知にとどまる。',
  'azure:hookah tobacco black line ice pear': AZURE_ICE_PEAR,
  'azure:hookah tobacco black line island city blend':
    'ドラゴンフルーツにマンゴーやパインを重ねたトロピカルミックス。hookah-reviews.comでは75点で「実質はややマッタリしたパイナップル系」と評された。Black Lineの中では比較的軽く、ダークリーフ入門にも向く。',
  'azure:hookah tobacco black line jasmine':
    'ジャスミン茶の湯気をそのまま煙にしたような一本。代理店によれば倒産したGIXOM社のジャスミンを復刻した銘柄で、甘さ控えめで茶葉の渋みがベースにある。グリーンティーとの50/50ミックスが定番。',
  'azure:hookah tobacco black line jungle juice':
    '完熟マンゴーの甘みとパイナップルのジューシーさに、ガムミント系を効かせて後味を引き締めたトロピカルミックス。代理店は甘いのに吸い疲れしない点を推しており、少し強めの火加減でマンゴーの甘さを引き出すことを勧めている。',
  'azure:hookah tobacco black line kokutou':
    '日本限定フレーバー第2弾の黒糖 (第1弾はグリーンティー)。2022年10月にAzure工場で代理店とAzure代表・調合師が試作して生まれた共同開発品で、黒糖を70〜80%のベースにして緑茶やバニラ、紅茶系と混ぜる使い方が公式に推奨されている。',
  'azure:hookah tobacco black line lemongrass': AZURE_LEMONGRASS,
  'azure:hookah tobacco black line life s peach': AZURE_LIFES_PEACH,
  'azure:hookah tobacco black line lime': AZURE_LIME,
  'azure:hookah tobacco black line lime cola': AZURE_LIME_COLA,
  'azure:hookah tobacco black line limoncello': AZURE_LIMONCELLO,
  'azure:hookah tobacco black line lychee':
    'Gold Lineのライチの透明感とStrong Lycheeの甘さに、ダークリーフの重さを足した2024年の派生版。代理店はAzureのライチ3種の中でもっとも煙が多く強く出やすい玄人向けと位置づけている。',
  'azure:hookah tobacco black line mango cheesecake': AZURE_MANGO_CHEESECAKE,
  'azure:hookah tobacco black line mangosteen':
    '財務省公告にMangosteenとして登録された銘柄。代理店ブログによれば米国側で名称が変わる可能性があるとされ、最終的に日本ではマンゴスチンをテーマにしたQueen Of Fruitsの名で発売された経緯がある。',
  'azure:hookah tobacco black line mexicola': AZURE_MEXICOLA,
  'azure:hookah tobacco black line moroccan tea':
    '紅茶3・レモン2・ミント1ほどのシトラスミントティー。hookah-reviews.comでは78点で「他社より紅茶系の香りが濃いめで分かりやすく、微かな清涼感が全体をサッパリさせている」と評価された。火が強いとレモンの酸味に紅茶が埋もれる。',
  'azure:hookah tobacco black line new grape mint':
    'カリフォルニアのぶどう産地にこだわって作られたグレープミント。代理店は「爽やかな甘さで吸いやすく、強すぎないミントで水々しさを表現している」と評し、サンプルから改良を重ねた最終版で取扱いを決めたと述べている。',
  'azure:hookah tobacco black line orange crush':
    '2023年にAzure工場で「シンプルなフルーツの決定版を」という話から生まれたオレンジ。代理店によればBlack Lineはホテルの朝食にある100%フレッシュジュースのような味わいで、Gold Lineとは印象がかなり異なるという。',
  'azure:hookah tobacco black line papaya': AZURE_PAPAYA,
  'azure:hookah tobacco black line passion fruit': AZURE_PASSION_FRUIT,
  'azure:hookah tobacco black line pineapple':
    '本物のパイナップルのように頬や顎に響く酸味まで再現したパイン単体。代理店はダークリーフのパインならこれと評価する一方、本品は後継のPineapple Expressに生まれ変わって廃盤になったとしている。',
  'azure:hookah tobacco black line pineapple express':
    '2023年にAzure工場で作られたパイナップルの決定版。同社の名作ライチのような透明感のある水々しいパインで、Black Line Pineappleを下敷きに改良された経緯を代理店が明かしている。',
  'azure:hookah tobacco black line pinky': AZURE_PINKY,
  'azure:hookah tobacco black line pomegranate': AZURE_POMEGRANATE,
  'azure:hookah tobacco black line queen of fruits': AZURE_QUEEN_OF_FRUITS,
  'azure:hookah tobacco black line raspberry vanilla': AZURE_RASPBERRY_VANILLA,
  'azure:hookah tobacco black line royal citrus':
    'レモン6・グレープフルーツ4ほどのシトラスミックス。hookah-reviews.comでは78点で「吐き終わりの厚いビターさが特徴だが、レモンとの混合で主張は控えめ」と評価。酸味が強く出るので序盤はやや弱めの火加減が良い。',
  'azure:hookah tobacco black line royal mango':
    '完熟マンゴーを大胆に打ち出した一本。hookah-reviews.comのGold Line評は83点で「ワックス様のツンとした香りが控えめで、フィリピン産より国産マンゴー寄りの再現度」と高評価。Black Lineはダークリーフのぶん重さが乗る。',
  'azure:hookah tobacco black line royal orange':
    'Azureのオレンジ。代理店は「Al Fakher以来11年ぶりにハマったオレンジ」と評し、Black Lineはダークリーフながら重さを感じるのは最初の30分ほどで以降は軽さが続くため、ダークリーフ入門にも向くとしている。',
  'azure:hookah tobacco black line royal raspberry':
    'ややサッパリめのラズベリー。hookah-reviews.comでは76点で「少し酸っぱいラズベリーキャンディに、ストロベリー的な丸い甘さと少しの青臭さが混じる」と評価。htreviewsでもリピート意向100%。火が強いと酸味で輪郭がぼやける。',
  'azure:hookah tobacco black line solana beach': AZURE_SOLANA_BEACH,
  'azure:hookah tobacco black line sour': AZURE_SOUR,
  'azure:hookah tobacco black line strawberry guava': AZURE_STRAWBERRY_GUAVA,
  'azure:hookah tobacco black line strong lychee': AZURE_STRONG_LYCHEE,
  'azure:hookah tobacco black line vanilla bean':
    '「単体でも吸える短命ではないバニラ」をコンセプトに代理店がAzureへ依頼して作らせた特注品。バニラともミルクともココナッツともつかない甘さが特徴で、短時間で味が飛びやすい他社のバニラの弱点を補うことを狙っている。',
  'azure:hookah tobacco black line watermelon': AZURE_WATERMELON,
  'azure:hookah tobacco gold line alaskan ice': AZURE_ALASKAN_ICE,
  'azure:hookah tobacco gold line apple cider': AZURE_APPLE_CIDER,
  'azure:hookah tobacco gold line barista s choice': AZURE_BARISTAS_CHOICE,
  'azure:hookah tobacco gold line bermuda mint': AZURE_BERMUDA_MINT,
  'azure:hookah tobacco gold line berrymania': AZURE_BERRYMANIA,
  'azure:hookah tobacco gold line blue mist':
    'ブルーベリーの甘酸っぱさにミントの清涼感を重ねた定番ミックス。Azure Gold Lineの人気銘柄。',
  'azure:hookah tobacco gold line blueberry muffin':
    '小麦とバターを焼いたふっくらした甘さに、ジャム寄りのブルーベリーを重ねた焼き菓子系。hookah-reviews.comのBlack Line評は84点だが「弱火維持とフンワリ詰めが必須で安定感は平均以下」とされ、酸味が出たら火が強すぎる合図。',
  'azure:hookah tobacco gold line cactus blast': AZURE_CACTUS_BLAST,
  'azure:hookah tobacco gold line california blue': AZURE_CALIFORNIA_BLUE,
  'azure:hookah tobacco gold line candy':
    'スキットルズを何粒かまとめて噛んだような、レモンとオレンジを軸にしたキャンディ系。hookah-reviews.comでは67点で「ケミカルだが丸みのあるお菓子っぽい甘さ」と評された。代理店も着色料の暴力と評するほど分かりやすい駄菓子系。',
  'azure:hookah tobacco gold line carolina peach':
    'ピーチ味のタブレット菓子を何粒も噛んだような、人工的で分かりやすい桃。hookah-reviews.comのBlack Line評は70点で「マッタリした甘さが強く輪郭がはっきりしている」。代理店はアールグレイ系と混ぜてピーチティーにする使い方を勧めている。',
  'azure:hookah tobacco gold line chai masala':
    'ターメリックやナツメグ、クローブ、カルダモンを重ねた本格派のマサラチャイ。hookah-reviews.comのBlack Line評は50点で「そこそこクセが強い」とされる一方、実物のマサラチャイとしての再現度は高いと評価が分かれる癖の強い銘柄。',
  'azure:hookah tobacco gold line cherry muffin':
    '熟したチェリーにマフィンの焼き菓子香を重ねたデザート系。hookah-reviews.comのBlack Line評は78点で「酸味の無いモワッとした甘さのチェリーに、後味で小麦とバターの焼き菓子香が来る」。弱めの火加減で焼き菓子感がはっきり出る。',
  'azure:hookah tobacco gold line chocolate cake':
    'ビターチョコに寄せたチョコレート系。hookah-reviews.comでは76点で「ウォッシュドのチョコ系としては珍しく再現度が高く、ココアシガレット的な粉っぽさが非常に少ない」と評価。名前に反して焼き菓子の香りは入っていない。',
  'azure:hookah tobacco gold line chocolate mint':
    'コンビニのチョコミント乳飲料のような一本。hookah-reviews.comのBlack Line評は71点で「チョコ部分はクラシックだがダークチョコのビターさは無く、清涼感もマットで穏やか」とされ、良くも悪くも基本に忠実で目新しさは薄いという評価。',
  'azure:hookah tobacco gold line cinamon cookie': AZURE_CINNAMON_COOKIE,
  'azure:hookah tobacco gold line cinnamon cookie': AZURE_CINNAMON_COOKIE,
  'azure:hookah tobacco gold line cinnamon cookies': AZURE_CINNAMON_COOKIE,
  'azure:hookah tobacco gold line cocomania': AZURE_COCOMANIA,
  'azure:hookah tobacco gold line cola': AZURE_COLA,
  'azure:hookah tobacco gold line cool cucumber':
    'よく冷えたきゅうりに少し砂糖をかけてかじったような一本。hookah-reviews.comのBlack Line評は77点で「サッパリした甘さと強めのウリ臭さに微かな清涼感」。陶器のファンネルで作ると甘さがすっきり出て名前どおりの涼しさになる。',
  'azure:hookah tobacco gold line copacabana': AZURE_COPACABANA,
  'azure:hookah tobacco gold line cosmos': AZURE_COSMOS,
  'azure:hookah tobacco gold line cucumelon': AZURE_CUCUMELON,
  'azure:hookah tobacco gold line d cherry': AZURE_D_CHERRY,
  'azure:hookah tobacco gold line dubai apple': AZURE_DUBAI_APPLE,
  'azure:hookah tobacco gold line fun at the beach':
    'マンゴー3・パイナップル2・ココナッツ3ほどのトロピカルミックス。hookah-reviews.comでは76点で「ワックス感のあるマンゴーとクセの無いココナッツが前面で、パイナップルは押され気味」と評された。ココナッツのぶん煙はウェット寄り。',
  'azure:hookah tobacco gold line grapefruit': AZURE_GRAPEFRUIT,
  'azure:hookah tobacco gold line green tea':
    '日本限定フレーバー第1弾のグリーンティー。2020年に代理店がAzureへ製造を依頼して生まれた銘柄で、スターバックスの抹茶フラペチーノをモデルに再現したもの。黒糖やバニラビーン、ジャスミンとのミックスが定番。',
  'azure:hookah tobacco gold line grow a pear':
    'ラフランスのジャムのような甘さに、ほのかな酸味を添えた洋梨。hookah-reviews.comのBlack Line評は82点で「熟していない固めの洋ナシ、あるいはシンプルな青りんご系」とされ、弱めの火加減で維持すると洋梨らしさが出る。',
  'azure:hookah tobacco gold line ice pear': AZURE_ICE_PEAR,
  'azure:hookah tobacco gold line lemon muffin':
    '柑橘のレモンにマフィンの焼き菓子香を合わせた一本。hookah-reviews.comのBlack Line評は79点で「レモンが主体で吐き終わりに小麦とバターの焼き菓子香」。弱めの火加減が必須で、強いと酸味が出過ぎて崩れる。',
  'azure:hookah tobacco gold line lemongrass': AZURE_LEMONGRASS,
  'azure:hookah tobacco gold line life s peach': AZURE_LIFES_PEACH,
  'azure:hookah tobacco gold line lime': AZURE_LIME,
  'azure:hookah tobacco gold line lime cola': AZURE_LIME_COLA,
  'azure:hookah tobacco gold line limoncello': AZURE_LIMONCELLO,
  'azure:hookah tobacco gold line lychee':
    'Azureを世界的に知らしめた看板のライチ。hookah-reviews.comでは87点で「再現度が高く、他社のライチにありがちな渋みやタバコ臭が無い」と同サイトのライチ系で最高評価。やや弱めの火加減で水々しさが出る。陶器ボウル推奨。',
  'azure:hookah tobacco gold line mango cheesecake': AZURE_MANGO_CHEESECAKE,
  'azure:hookah tobacco gold line matcha mint':
    '急須で濃いめに入れた緑茶のような、甘さのほとんど無い抹茶系にマットな清涼感を重ねた一本。hookah-reviews.comのBlack Line評は79点だが「火加減で香りの出方が大きく変わり正解が分かりにくいのが最大の癖」と指摘されている。',
  'azure:hookah tobacco gold line melon green tea':
    'メロンとグリーンティーという緑つながりのミックス。代理店は「実際に混ぜると不味いのに煙にすると意外に合う」「境目が無く無理なく調和している」と評しており、メロン部分はStarBuzzのSafari Melon Dewを濃くしたような風味とされる。',
  'azure:hookah tobacco gold line melonmania':
    'かき氷のメロンシロップを思わせる駄菓子っぽいメロン。hookah-reviews.comのBlack Line評は65点で「ケミカルさにカドがあり長時間はクドい」、htreviewsでも2〜3点評価が中心と辛口。一方でメロン系にしては火の調節が安定している。',
  'azure:hookah tobacco gold line mexicola': AZURE_MEXICOLA,
  'azure:hookah tobacco gold line napa grape':
    '他社に珍しいサッパリした白ぶどう系。hookah-reviews.comのBlack Line評は77点で「Al Fakherのグレープを下敷きにした多くのグレープ系と違い、実物のマスカットに寄せた努力が見える」。輪郭はボンヤリ気味でミックスでは押し負けやすい。',
  'azure:hookah tobacco gold line orange crush':
    '2023年にAzure工場で「シンプルなフルーツの決定版を」という話から生まれたオレンジ。代理店によればGold Lineは瓶のハイシーオレンジのような透明感のある爽やかさで、Black Lineとは味わいがはっきり異なるという。',
  'azure:hookah tobacco gold line orange my guava':
    'マッタリした甘さの強いオレンジに、青臭さの控えめなグアバを重ねたミックス。hookah-reviews.comのBlack Line評は66点で「名前から想像するサッパリ感より甘くマッタリで、グアバがストロベリーのように感じられることもある」。',
  'azure:hookah tobacco gold line papaya': AZURE_PAPAYA,
  'azure:hookah tobacco gold line passion fruit': AZURE_PASSION_FRUIT,
  'azure:hookah tobacco gold line pep cream':
    'ペパーミントにバニラクリームを重ねたクリームミント。hookah-reviews.comのBlack Line評は78点で「典型的なクリーム系だがマッタリした甘さは抑えめで、Al FakherのCream with Mintよりスッキリして万人受けする」。ミックスにも使いやすい。',
  'azure:hookah tobacco gold line pina colada':
    'パイナップルとココナッツが半々のピニャコラーダ。hookah-reviews.comでは77点で「パイン飴的な駄菓子っぽさはあるが濃縮還元のパインジュースとして納得の香り、ココナッツはツンとしたクセが無い」と評価。パイン系としては安定感が高い。',
  'azure:hookah tobacco gold line pinky': AZURE_PINKY,
  'azure:hookah tobacco gold line pomegranate': AZURE_POMEGRANATE,
  'azure:hookah tobacco gold line queen of fruits': AZURE_QUEEN_OF_FRUITS,
  'azure:hookah tobacco gold line raspberry vanilla': AZURE_RASPBERRY_VANILLA,
  'azure:hookah tobacco gold line rio mint':
    'やや強めだが穏やかでマットな清涼感のシンプルなミント。hookah-reviews.comのBlack Line評は77点で「Al Fakherのミントから後味の渋みとグリーンな香りを抜き、清涼感を少し強めた感じ」。代理店は単品で吸いたい玄人向けと位置づけている。',
  'azure:hookah tobacco gold line root beer':
    'バニラとシナモンの甘いスパイスミックスに、ルートビア特有の湿布のような香りを乗せた一本。hookah-reviews.comのBlack Line評は65点だが「StarBuzz Vintageのものより湿布感が弱くクセ控えめで、無難にまとまっている」と評されている。',
  'azure:hookah tobacco gold line route 66':
    '公式はパッションフルーツとメロンにクーリングミントを重ねたミックスとするが、hookah-reviews.comのBlack Line評は77点で「体感はメロン3・スイカ2・スペアミント1ほどで、パッションフルーツは分かりにくい」。ウリ臭さとミントでキレは良い。',
  'azure:hookah tobacco gold line royal mango':
    '人工的でなくフレッシュな甘さのマンゴー。hookah-reviews.comでは83点で「ワックス様のツンとした香りが控えめで、フィリピン産より国産マンゴー寄りの再現度」と高評価。ただし火が強いとワックス感が出過ぎるため見極めはややシビア。',
  'azure:hookah tobacco gold line royal queen':
    'ベルガモットの香りにリアリティのあるアールグレイ系。hookah-reviews.comのBlack Line評は84点で、LavooのRussian Teaよりベルガモットが控えめで穏やか、TFDやStarBuzz Serpentの紅茶系より甘さが控えめとされる。',
  'azure:hookah tobacco gold line royal raspberry':
    '際立った甘さの中にほのかな酸味を感じるラズベリー。hookah-reviews.comのBlack Line評は76点で「少し酸っぱいラズベリーキャンディに丸い甘さと少しの青臭さ」とされる。Gold Lineは同名のBlack Lineより軽く上品な出方になる。',
  'azure:hookah tobacco gold line solana beach': AZURE_SOLANA_BEACH,
  'azure:hookah tobacco gold line sour': AZURE_SOUR,
  'azure:hookah tobacco gold line spiced berry':
    'ラズベリー6・シナモン3・八角1ほどの構成で、余韻に微かなアニスの香りが残るスパイスドベリー。hookah-reviews.comのBlack Line評は79点で「SBVのSpice Me Redと同構造だがクローブでなくシナモンなので穏やかで丸い」と評価。',
  'azure:hookah tobacco gold line strawberry guava': AZURE_STRAWBERRY_GUAVA,
  'azure:hookah tobacco gold line strawberry passion':
    'ストロベリー3〜4・パッションフルーツ1ほどのミックス。hookah-reviews.comのBlack Line評は73点で「実物のイチゴより安いイチゴジャム寄りで、パッションは押され気味ながら甘さにコクを与えている」。ミックス用途に向く。',
  'azure:hookah tobacco gold line strong lychee': AZURE_STRONG_LYCHEE,
  'azure:hookah tobacco gold line tomahawk':
    'レモン3・ライム2・ミント2ほどのソフトなシトラスミックス。hookah-reviews.comでは75点で「酸味やビターさが非常に控えめで軽やか、強めの火加減でも酸味が出過ぎず柑橘系としては扱いやすい」と評された王道の構成。',
  'azure:hookah tobacco gold line tropical citrus':
    'メロン5・レモン2ほどのミックス。hookah-reviews.comでは82点で「クセの無いメロンに、クラシックで酸味の強いレモンがアクセントとして効いて甘さを引き締めている」と高評価。名前に反してマンゴーやココナッツの香りはしない。',
  'azure:hookah tobacco gold line tropical paradise':
    'パイナップルを軸にココナッツを重ねたトロピカルミックス。hookah-reviews.comでは76点で「パイン主体のサッパリしたフルーツミックスをマッタリしたココナッツが覆う」と評された。ミルクやバニラを足すとピニャコラーダ寄りになる。',
  'azure:hookah tobacco gold line twisted teabag':
    '酸味とビターさの強いクラシックなレモンに、甘めの紅茶を少し重ねたレモンティー系。hookah-reviews.comでは70点で「火が強いとレモンの酸味が勝って紅茶がほぼ消えるため、やや弱めの火加減で維持するのが無難」と指摘されている。',
  'azure:hookah tobacco gold line viva la horchata':
    '米とシナモンのメキシコの飲料オルチャータを再現した一本。hookah-reviews.comのBlack Line評は70点で「ローストナッツ的な香ばしさのあるクリーム系にシナモンと土臭さが少々、チャイ系なのか香ばしいクリーム系なのかどっちつかず」。',
  'azure:hookah tobacco gold line watermelon': AZURE_WATERMELON,
  'azure:hookah tobacco gold line white gummi bear':
    'パイナップル系を軸にしたフルーツミックスに、煙を吐き終える際にグミの後味のような人工的な甘い香りが鼻を抜ける。hookah-reviews.comでは77点で「FumariのWhite Gummi Bearに近く、主な違いは煙の質」と評価。適当な火加減でも特徴が出る。',
  'azure:hookah tobacco gold line winter berries':
    'ミント2〜3にラズベリー1ほどを重ねたサッパリ系。hookah-reviews.comでは69点で「透明感のあるミントが主体で、背後に酸味と渋みの控えめなラズベリー」と評されたが、王道すぎて目新しさに欠けるとも指摘されている。',
  'azure:hookah tobacco gold line winter lemon':
    '酸味やビターさを抑え、ソフトさに特化した軽やかなレモンミント。hookah-reviews.comでは77点で「FumariのLemonやLemon Mintに近い作り」と評価。火が強いと少し酸味が出る程度で、かなり適当に調節しても崩れない安定感がある。',
  'azure:hookah tobacco gold line winter peach':
    'フローラル2・アプリコット1・ミント1ほどの構成で、名前ほどピーチらしくない変化球。hookah-reviews.comでは79点で「Tangiersのフローラル系に似た、少し渋みのあるフワッとした甘さ」と評され、ウォッシュドの軽さで楽しめる点が評価されている。',
  'azure:hookah tobacco gold line winter rose':
    'シトラス6・香草系4ほどの構成で、他社のローズ系には珍しい仕上がり。hookah-reviews.comでは81点で「レモンとライムを半々にしたようなシトラス感に、クセの無いフレッシュハーブのような香りが乗る」と評価。火は気持ち弱めが良い。',
  'azure:lemon sage gold line':
    'フレッシュなレモンにセージの土のようなハーブ感を合わせた変わり種。代理店はレモンセージというハーブそのものの香りだとし、Azureのフレーバーの中でも再現度と完成度が高い一本と位置づけている。',

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
  // SEBERO — htreviews.org のレビューを要約 (2026-09 時点)。hookah-reviews.com には
  // Sebero の記事が無いため htreviews のみを出典としている。財務省公告の銘柄名と
  // htreviews のライン表記は必ずしも一致しない (例: 「Classic Coco Like」「Classic Fruit
  // Yogurt」は htreviews では Arctic Mix ライン、「Waffle」「Bilberry」等の無印は Classic)
  // ため、説明ではライン名や生産状況を断定していない。
  // 同一商品を指す別登録名は同じ説明を共有する:
  //   Berry Black / Classic Blackberry = Ежевика、Black Feiberry / Black Feijoa = Feiberry、
  //   Black Sourness / Black Sour Cranberry = Sourness (Клюква)。
  'sebero:apricot':
    '甘くベルベットのような口当たりに軽い酸味を添えたアプリコット。htreviewsでは「ケミカル感のない自然な杏」「砂糖控えめのコンポートや自家製ジャムのよう」と評され、リピート意向100%の堅実な評価。ミックスの甘み補強に使う声が多い。',
  'sebero:arctic':
    '香りを持たず冷涼感だけを足すクールブースター。htreviewsでは「余計な匂いがなく純粋に冷える」との評が大半で (評価71件・リピート意向85%)、効きが強いため入れ過ぎ注意という指摘が定番。',
  'sebero:arctic mix caramel glass':
    'カラメルをかけたワッフルコーンのアイスを謳うデザート系。htreviewsでは「香りは良いが吸うとアイスもワッフルも出ず、薄いカラメルと冷涼感だけが残る」という辛口が優勢で評価は伸びない (3点評価44%・リピート意向55%)。',
  'sebero:arctic mix peanut latte':
    'カラメルトッピングとピーナッツを効かせたアイスラテ。htreviewsでは4点評価が過半を占める安定した人気で (リピート意向81%)、ナッツの香ばしさが主役でコーヒーとカラメルは控えめという指摘が多い。低温でゆっくり熱を入れる運用が推奨される。',
  'sebero:banana':
    'ストレートなバナナ。htreviewsでは評価数が少なく、「甘く煙量のあるバナナ」という声と「青いバナナで物足りない」という声に分かれる (3点評価43%)。ミックスでは他の香りに埋もれやすいという指摘がある。',
  'sebero:banana chocolate':
    'バナナにチョコレートを重ねたデザート系。htreviewsでは「軽いミルクチョコにバナナがほのかに乗る」という評が中心だが、全体に香りが薄いという指摘が多く評価は割れる (リピート意向50%)。',
  'sebero:banana strawberry':
    'バナナとイチゴを合わせた、Love isのガムを思わせる甘いミックス。htreviewsでは「説明どおりガムそのもの」と再現度は認められる一方、甘さが強すぎるという声も多く評価は割れる (リピート意向60%)。',
  'sebero:barberry':
    'ロシアで定番のバーバリス (メギ) キャンディを再現。htreviewsでは「甘さから15分ほどで酸味が立つ本物のバーバリス飴」と再現度が好評 (リピート意向71%)。香りが主張しすぎず、ミックス素材としても使いやすいとされる。',
  'sebero:berry black': SEBERO_EZHEVIKA,
  'sebero:bilberry':
    'みずみずしく甘いブルーベリー (ビルベリー)。htreviewsではリピート意向94%と安定した支持で、「ヨーグルト的な甘さのある素直なベリー」と評される。香りが強く、入れ過ぎると他を消すためミックスでは少量が推奨される。',
  'sebero:black amarena cherry':
    'イタリアのアマレーナチェリーを思わせる、酸味と渋みのある濃いチェリー。htreviewsでは「果汁というより濃厚なコンポートやチェリーリキュール」と評され、リピート意向89%と好評。ソロはやや重いという声もある。',
  'sebero:black apple juice':
    '搾りたてのリンゴジュースを謳うベース向けフレーバー。htreviewsでは「果肉感がなく皮だけのような薄いリンゴ」という酷評が優勢で、リピート意向27%と低調な銘柄。',
  'sebero:black barberry':
    'バーバリス飴に軽い渋みと酸味を効かせた一本。htreviewsでは評価数が少ないながら「香りが弱く乾いた印象」という辛口が中心 (3点評価71%・リピート意向50%)。',
  'sebero:black bilberry':
    '摘みたてのビルベリーの、やや渋みのある味わい。htreviewsでは「石鹸っぽさのない素直なベリー」という声と「花のようなケミカル感がある」という声に分かれる (リピート意向50%)。',
  'sebero:black blueberry':
    '甘く香り高いブルーベリー (голубика) に軽い酸味を添えた一本。htreviewsでは「甘さを強く振ってあり実物より濃い」との指摘が多く、ソロよりミックス向きという評が中心 (リピート意向43%)。',
  'sebero:black bubble gum':
    '00年代のフルーツガムをイメージしたノスタルジックなバブルガム。htreviewsでは「香りが弱く葉の風味が前に出る」という指摘が多く評価は伸びない (3点評価50%・リピート意向57%)。',
  'sebero:black cactus':
    'サボテンの果肉にイチゴ・マンゴー・キウイのニュアンスを重ねた一本。htreviewsではリピート意向82%と数字は悪くないが、「ソロでは単調で石鹸っぽく、ミックス前提」というレビューが目立つ。',
  'sebero:black cola':
    'よく知られた炭酸飲料をなぞった、甘さのはっきりしたコーラ。htreviewsでは「派手さはないが最後まで安定して吸える無難なコーラ」との評が中心で (リピート意向70%)、ミックス素材として推す声が多い。',
  'sebero:black cookie monster':
    'ココナッツを散らしたクッキーを謳うデザート系。htreviewsでは「ソロだと乾いたクッキーで物足りない」という指摘が多くリピート意向38%と低調。ミルク系を合わせると化けるという使い方が紹介されている。',
  'sebero:black feiberry': SEBERO_BLACK_FEIJOA,
  'sebero:black feijoa': SEBERO_BLACK_FEIJOA,
  'sebero:black garnet':
    '搾りたてのザクロジュースを謳う濃い果実系。htreviewsでは「ザクロというより酸味と渋みにアルコール様のニュアンスが乗る独特の味」という指摘が多く、ソロよりミックス向きとされる (リピート意向33%)。',
  'sebero:black grape':
    '濃い色のブドウの甘さと香りをまとめたグレープ。htreviewsでは「缶の香りは良いが吸うと石鹸っぽさやレーズン様の癖が出る」という低評価が多く、リピート意向33%と賛否の激しい銘柄。',
  'sebero:black grapefruit':
    'グレープフルーツのフレッシュジュースの、ほろ苦さを含む香り。htreviewsではリピート意向88%と評価が高く、「酸味と苦みのバランスが良くミックスで映える」という声が中心。香りが強いため入れ過ぎ注意という指摘もある。',
  'sebero:black green pear':
    '青梨にレモネードのニュアンスを重ねた一本。htreviewsでは評価数が少なく、「ドゥシェス (梨のソーダ飴) そのものだが15分ほどで香りが弱くなる」という評が共通している。',
  'sebero:black herbal currant':
    '黒スグリの甘さにルバーブの青い爽やかさを合わせた変化球。htreviewsではSebero Black屈指の高評価で (リピート意向87%)、「葉ごと摘んだスグリのような香り」と再現度が支持される。香りが強くミックスでは主役になりやすい。',
  'sebero:black kiwi':
    '熟したキウイの果肉のやわらかい甘さ。htreviewsでは「草っぽさと軽い甘さが中心で主張は控えめ」という評が多く、ソロでは香りが飛びやすいという指摘がある (リピート意向64%)。',
  'sebero:black lemon bomb':
    'シチリアレモンの果肉とすりおろした皮をイメージした強い酸味のレモン。htreviewsでは「ミックスに酸味を足す用途で優秀」と好評で4点評価が8割 (リピート意向86%)。喉に来やすいという指摘もある。',
  'sebero:black lemon candy':
    'サトウキビの甘さを添えたレモンキャンディ系。htreviewsでは評価数が少なく、「苦みのない飴らしいレモン」という好評と「石鹸っぽさが出る」という酷評が並ぶ。',
  'sebero:black lemon waffle':
    'レモンクリームを挟んだバニラワッフル。htreviewsでは「レモンは良いがワッフルが遠い」「皮の苦みが出る」といった指摘が多く評価が割れる銘柄 (リピート意向43%)。',
  'sebero:black limonchello':
    'レモンの果肉とシロップで組み立てたリモンチェッロ。htreviewsではリピート意向90%と安定した人気で、「軽いラインのリモンチェッロと同じ味でボディだけ強い」という評が定番。',
  'sebero:black mango yogurt':
    'トロピカルなマンゴーをヨーグルトのクリーミーさで包んだミックス。htreviewsではSebero Blackで最も評価数の多い人気銘柄 (評価79件・リピート意向81%)。マンゴーが前に出てヨーグルトは背景という指摘が多く、香りが強いためミックスでは主役になる。',
  'sebero:black mellow mango':
    '熟したマンゴーの甘さを前面に出した一本。htreviewsでは評価数が少なく、「甘さは出るが青い草っぽさが残る」という指摘が中心。同ラインのMango Yogurtと比べられることが多い銘柄。',
  'sebero:black mint':
    'ペパーミントそのものの味。htreviewsでは評価数こそ少ないが全員がリピート意向を示しており、「主張しすぎず他の香りを消さないミックス向きのミント」と好評。入れ過ぎると苦みが出るとされる。',
  'sebero:black nitro':
    'タバコの風味そのものを香りにした、強さを足すためのノンアロマ系ブースター。htreviewsでは「ライ麦パンやカカオ、ナッツを思わせる風味でニコチン感が強い」と評され、ミックスの強度調整用という位置づけ (リピート意向57%)。',
  'sebero:black prunes':
    '燻香とナッツのニュアンスを持つ濃厚なプルーン。htreviewsでは「手に入れやすいプルーンの代表格」として支持され (リピート意向71%)、ソロでもミックスでも使えるという声が多い。',
  'sebero:black raspberry':
    '摘みたてのラズベリーに軽い酸味を添えた一本。htreviewsでは「素直だが単純で物足りない」という評が中心で、ロットによる苦みや喉への刺激を指摘する声もある (リピート意向57%)。',
  'sebero:black root beer':
    'スパイスとクリーミーさを併せ持つアメリカのルートビア。htreviewsではSebero Black屈指の高評価で (5点評価41%・リピート意向88%)、「香りの密度はやや軽いが完成度は高い」と評される。',
  'sebero:black snickers':
    'チョコレート・ピーナッツ・ヌガーでスニッカーズを狙ったデザート系。htreviewsでは「ナッツとチョコは出るがスニッカーズには届かない」という評が多く、評価は中位に落ち着く (評価42件・リピート意向57%)。',
  'sebero:black sour cranberry': SEBERO_BLACK_SOURNESS,
  'sebero:black sourness': SEBERO_BLACK_SOURNESS,
  'sebero:black strawberry':
    '甘く香りの高い露地イチゴ。htreviewsでは「香料感が強く、軽いラインのイチゴに比べると分が悪い」という評が目立ち、リピート意向44%と評価は割れる。',
  'sebero:black strawberry banana':
    'イチゴとバナナを合わせた定番ミックス。htreviewsでは「バナナ寄りで甘さが強く、まとまりに欠ける」という辛口が多く評価は割れる (リピート意向50%)。',
  'sebero:black strawberry guava':
    'イチゴとグアバに青い草のニュアンスを効かせたミックス。htreviewsでは「グアバが主役でイチゴは控えめ」という指摘が多く賛否が分かれるが、鋭い柑橘を和らげるミックス素材としては好評 (リピート意向50%)。',
  'sebero:black top':
    'イチゴと茹でトウモロコシに清涼感を合わせたSeberoの看板ミックスを強めの葉で再構成した一本。htreviewsでは「トウモロコシのクリーミーさが立つ」と支持する声と「単調」という声が拮抗する (3点評価46%・リピート意向50%)。',
  'sebero:black watermelon':
    'スイカとハネデューメロンを合わせた夏向けのミックス。htreviewsでは「メロンが優勢でケミカル感が出る」という指摘が多く、リピート意向43%と評価は低め。',
  'sebero:black western':
    'シガーリーフの渋みとスパイスを主役にしたノンアロマ系の一本。htreviewsでは評価数は少ないものの「理想的なノンアロマ」「木肌や乾いた果実を思わせる」と好意的な評が並ぶ (リピート意向75%)。',
  'sebero:black wild berries':
    '森のベリーを詰め込んだ甘酸っぱいミックス。htreviewsでは「迷ったときの無難な一本」として安定した高評価で (4点評価62%・リピート意向87%)、スグリ寄りの渋みが感じられるという声が多い。',
  'sebero:bubble gum':
    'シナモンをほのかに効かせた甘いバブルガム。htreviewsでは「派手さはないが素直なガムでミックスの土台に良い」との評が中心 (評価40件・リピート意向64%)。ソロでは飽きが来やすいという指摘もある。',
  'sebero:chocolate':
    'ストレートなチョコレート。htreviewsでは「ダーク寄りの素直なチョコ」と4点評価が過半を占めるが、終盤に葉の風味が出るという指摘もある。ミックスで真価を発揮するという声が多い。',
  'sebero:citrus fizz':
    'ブラッドオレンジのレモネードにベルガモットの渋みと香りを重ねた一本。htreviewsではリピート意向92%と好評で「紅茶系が好きな人向け」という評が多い。吸い始めはベルガモット、後半にオレンジが出るという声が目立つ。',
  'sebero:classic blackberry': SEBERO_EZHEVIKA,
  'sebero:classic cactus':
    'サボテンをテーマにした草っぽい甘さのフレーバー。htreviewsでは評価数が少なく「渋みと石鹸っぽさが出る」「香りが過剰」という辛口が中心で、ソロよりミックス向きとされる。',
  'sebero:classic coco like':
    'ミルクチョコレートにココナッツのプラリネを合わせ、軽い清涼感を添えたデザート系。htreviewsでは「バウンティに近い」と好評で (4点評価58%・リピート意向78%)、チョコが主役でココナッツは後味に出るという評が多い。',
  'sebero:classic coffee':
    'エスプレッソを謳うコーヒー。htreviewsでは「苦みや酸味のない砂糖入りコーヒー」と評され、ミルクや練乳と合わせてアイスコーヒー風にする使い方が定番 (リピート意向83%)。',
  'sebero:classic fruit yogurt':
    'マンゴーの甘さとラズベリーの酸味をヨーグルトのクリーミーさでまとめた一本。htreviewsでは「マンゴーが優勢でヨーグルトは背景」という指摘が多く、香りが穏やかで主張が弱いという評が中心 (リピート意向63%)。',
  'sebero:classic halloween pumpkin':
    '熟したカボチャの果肉を再現した季節限定系。htreviewsでは「甘く柔らかい本物のカボチャ」という絶賛と「実際はメロンに近い」という指摘が拮抗する賛否両論の銘柄 (リピート意向57%)。',
  'sebero:classic milk':
    '加糖練乳を思わせる甘いミルク。htreviewsでは評価93件・リピート意向91%とSebero屈指の人気で、ミックスに甘さとまろやかさを足す定番素材とされる。入れ過ぎると甘くなりすぎるという注意が多い。',
  'sebero:classic papaya':
    '南国の果肉の甘さを持つパパイヤ。htreviewsではリピート意向96%と非常に高く、「トロピカル系ミックスで映える」と支持される。ソロではガム的な甘さに感じるという声もある。',
  'sebero:classic passion fruit':
    '軽い酸味を持つジューシーなパッションフルーツ。htreviewsでは4点以上が全てを占め全員がリピート意向を示しており、「ミックスでも埋もれない明快なマラクヤ」と評価が安定している。他社より甘め寄りという指摘がある。',
  'sebero:classic tiramisu':
    'ビスキュイ・リキュール・コーヒー・カカオをバニラでまとめたティラミス。htreviewsでは「エスプレッソの苦みとマスカルポーネのクリーミーさが両方出る」と好評 (リピート意向85%)。',
  'sebero:classic tropic rose':
    'トロピカルフルーツにバラの花びらを重ねたフローラル系。htreviewsでは「花屋にいるような香り」と評価する声と「香水のようで重い」という声に分かれる (リピート意向71%)。バラが主役で後半に木のニュアンスが出るとされる。',
  'sebero:feijoa':
    'コーカサスの熟したフェイジョアの甘酸っぱさ。htreviewsでは「試した中で最高のフェイジョア」という絶賛が並ぶ高評価銘柄で (5点評価64%・リピート意向100%)、ジャムのような濃さと草っぽさのバランスが支持される。',
  'sebero:garnet cherry':
    'チェリーとザクロを合わせた甘酸っぱい一本。htreviewsでは評価55件・リピート意向90%と人気が高く、「チェリージュースの甘さにザクロの渋みが程よく乗る」とバランスの良さが評価される。',
  'sebero:grapes':
    'イザベラ種のブドウの甘さと香りをまとめたグレープ。htreviewsでは「軽いラインでは最良のブドウ」という支持がある一方、「濃さが足りない」という声もあり評価は分かれる (リピート意向80%)。',
  'sebero:kivi fresh':
    'キウイのフレッシュジュースを思わせる甘酸っぱい一本。htreviewsでは「草っぽい緑の風味がミックスに映える」と好評 (リピート意向83%)。熱に弱く、温度を上げすぎると苦みが出るという指摘が多い。',
  'sebero:limoncello':
    'ほどよい酸味の柑橘をまとめたリモンチェッロ。htreviewsでは評価93件・リピート意向98%とSeberoでも屈指の評価で、「アルコール感はほぼなく自然なレモン」と支持される。香りの持続は30分ほどという指摘がある。',
  'sebero:lychee':
    'ライチの素直な甘さ。htreviewsでは「ケミカル感が少なく、ミックスで他を邪魔しないライチ」として評価が高い (リピート意向100%)。ほのかな花のニュアンスがあるとされる。',
  'sebero:mango':
    'ストレートなマンゴー。htreviewsでは「青くて草っぽく、甘みが足りない」という指摘が多くリピート意向33%と評価は厳しい。蜂蜜など甘い香りと合わせて補正する使い方が紹介されている。',
  'sebero:mint':
    'ストレートなミント。htreviewsでは評価数がごく少なく、「刺激が強すぎない穏やかなミント」という評と「後半は草っぽさだけが残る」という評が並ぶ。',
  'sebero:orange':
    '素直なオレンジ。htreviewsでは「マーマレード的な甘さの飴っぽいオレンジ」との評が中心で、果肉感の薄さを指摘する声が多い (3点評価50%)。ソロよりミックス向きとされる。',
  'sebero:orange chocolate':
    'オレンジとチョコレートを合わせたデザート系。htreviewsでは「チョコが背景に回り柑橘を潰さない」とバランスが評価される一方、甘さが強いという声もある (リピート意向57%)。',
  'sebero:pineapple':
    'ストレートなパイナップル。htreviewsでは「酸味だけが立ってパイナップルらしさが消える」という酷評が優勢で、1点評価41%・リピート意向17%と厳しい評価が並ぶ銘柄。',
  'sebero:raspberries':
    '夏の熟したラズベリーに軽い酸味を添えた一本。htreviewsでは「ケミカル感のない上質なラズベリー」として高評価で (リピート意向93%)、あらゆるミックスに入れやすい定番素材とされる。',
  'sebero:strawberry':
    'Seberoを代表するイチゴ。htreviewsでは評価103件・リピート意向91%と看板級の人気で、「軽いラインでは最高のイチゴ」「甘すぎず自然」という絶賛が並ぶ。ミックスの甘さ補強にも定番。',
  'sebero:thai':
    'ラムベースのカクテル「マイタイ」をイメージした甘酸っぱいトロピカル系。htreviewsでは「カクテルというより濃いエキゾチックフルーツ」という評が多く、香りの持続の良さが支持される (リピート意向100%)。',
  'sebero:vanilla':
    '濃厚で香りの立つバニラ。htreviewsでは評価105件・5点評価43%とSebero Classicの人気銘柄で、「ケミカル感のないミックスの土台」として支持される。10〜15分で香りが弱まるという指摘もある。',
  'sebero:waffle':
    '焼きたてのワッフルを思わせるデザート系。htreviewsでは「乾いておらずクリーミーで甘さも程よい」と好評 (評価57件・リピート意向80%)。チョコやミルク系と合わせる使い方が定番。',
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
  // StarBuzz — 日本語レビューブログ hookah-reviews.com (byダビデ) の各フレーバー記事を要約
  // (2026-09 時点)。Original / Bold / Vintage / ACID の 4 ライン。財務省公告名の表記ゆれは
  // 同一記事を共有する (Blue Sufer = Blue Surfer、Grapefruits = Grapefruit、
  // Marlett = Marlette、Vintage Timisue = Vintage Tiramisu)。
  // 公告名に Bold が付かない Pink Lady は Bold 版の記事しか無いため、本文で出典ラインを明記。
  // 記事が見つからなかった Bold French Buzz / Bold Apple Mist / Vintage Cheers /
  // Vintage P Spice / Vintage Tart Choco と、ライン (Original / Bold) を特定できなかった
  // Mint Colossus / Peach Queen / Queen of Sex は意図的に未記載。
  'starbuzz:acid blue':
    '序盤はBlue Mistに似た清涼感とフルーティな香りで、10〜15分ほど経つとスモーキーでマイルドな甘さが主体になるマッタリ系。煙はきめ細かくスムーズ。hookah-reviews.comでは45点で「味の完成度はBlue Mistの方が上」と評された。',
  'starbuzz:acid gold':
    'チョコレートとオレンジがほぼ半々で、オレンジの爽やかさがチョコの粉っぽさと甘さを引き締める。細かく濃密な煙が大量に出て、最後までバランスが崩れない。hookah-reviews.comでは85点で「Acidラインで一番のヒット、欠点らしい欠点がない」と評された。',
  'starbuzz:acid purple':
    'ピーチをメインにグレープを重ねたような、まったりと濃いめの甘い香り。煙はStarBuzzにしてはドライでノドに障り、時間とともに味が濃くなっていく。hookah-reviews.comでは45点で「濃い甘さが好きな人向けだが長く吸うのはキツい」と評された。',
  'starbuzz:acid red':
    '何の味か判別しがたいほど極端にケミカルな甘い香りで、複数のエナジードリンクを混ぜたような強烈さ。煙の量と質自体は悪くないが、味のインパクトに全て持っていかれる。hookah-reviews.comでは2点で「二度と買わない」と酷評された。',
  'starbuzz:apple americano':
    'リコリスがごく控えめに香るApple系で、序盤はキレのあるサッパリした甘さ、中盤からややケミカルなマッタリした甘さが出る。煙はボリュームがあり火の調節も簡単。hookah-reviews.comでは72点で「目新しさはないが配合のバランスは良い」と評された。',
  'starbuzz:apple cinnamon':
    'まったりした甘めのアップル7に、ソフトなシナモン3ほどのバランス。シナモン入りながらノドへの当たりが柔らかく、きめ細かく濃い煙で吸い心地が良い。hookah-reviews.comでは60点で「香りも煙の質も平均点以上、あとは好みの問題」と評された。',
  'starbuzz:apple martini':
    '軽い甘さのサッパリしたグリーンアップルに、薬草やアルコールを思わせる香りが半々ほど混じる。薄味でクセは強くないが、火加減で香りが崩れやすい。hookah-reviews.comでは50点で「マズくはないが、まずはSour Apple系から当たりを探す方が無難」と評された。',
  'starbuzz:apricot':
    '酸味のないアンズらしい果物の香りと、濃すぎず薄すぎない優しい甘さ。水々しくノド越しの良い煙が特徴で、特別気を使わなくても崩れない安定感がある。hookah-reviews.comでは75点で「甘さと吸い心地のバランスが絶妙」と評された。',
  'starbuzz:arabian coffee':
    'スパイスがほんのり効いた、甘さ控えめでビターなコーヒー系。アラビックコーヒーとしての再現度には疑問が残るが、クセがなく煙は他社のコーヒー系より優秀。hookah-reviews.comでは55点で「Coffee系としての出来は良い」と評された。',
  'starbuzz:banana':
    'バナナオレのようなお菓子っぽい甘い香りに、まろやかな渋みが少し混じる。煙はStarBuzzにしてはややドライでノドに障り、味の持ちは長いが出来は平凡。hookah-reviews.comでは40点で「不味くも美味しくもなく、味自体は非常に平凡」と評された。',
  'starbuzz:blackberry':
    '酸味はなく、深みとコクのあるベリーの香りにクドすぎない甘さを合わせたやや濃口のベリー系。ウェットでボリュームのある煙だが、StarBuzzにしては焦げやすい。hookah-reviews.comでは70点で「しっかりベリー系の香りがする点が評価できる」と評された。',
  'starbuzz:blackgrape':
    '巨峰の皮を思わせるコクと、奥行きのあるマッタリした甘さが両立した濃いめのグレープ。煙はスムーズだが、火が強すぎるとコクが出すぎるため弱めの火加減が要る。hookah-reviews.comでは75点で「Black Grape系の中では欠点が少ない」と評された。',
  'starbuzz:blue mist':
    '濃口でまったりしたブルーベリーの香りに、ミント系ともIce系とも違う独特の清涼感を重ねたStarBuzzの看板商品。吸い心地は軽やかだが、火が強すぎるとMist感が損なわれ調節に難がある。hookah-reviews.comでは76点で「クセがなく万人受けする香り」と評された。',
  'starbuzz:blue sufer':
    'お菓子っぽさのあるパイナップルを主役に、ほんのりした清涼感とブルーベリーを重ねたMist系。Blue Mistよりサッパリした仕上がりで、焦げにくく香りの持ちも長い。hookah-reviews.comでは77点で「Blue Mistの甘さが強いと感じる人に強くオススメ」と評された。',
  'starbuzz:blue surfer':
    'お菓子っぽさのあるパイナップルを主役に、ほんのりした清涼感とブルーベリーを重ねたMist系。Blue Mistよりサッパリした仕上がりで、焦げにくく香りの持ちも長い。hookah-reviews.comでは77点で「Blue Mistの甘さが強いと感じる人に強くオススメ」と評された。',
  'starbuzz:blueberry':
    'ブルーベリーの皮ごと食べたようなみずみずしい甘さで、Al FakherやNakhla Mizoのブルーベリーに見られるツンとした酸味はなくマイルド。hookah-reviews.comでは75点で「甘過ぎず濃すぎないのに香りがハッキリしていて良かった」と評された。弱めの火加減の方が持ち味が出る。',
  'starbuzz:blueberry grape':
    'メインはブルーベリーで、時間が経つとブラックグレープらしい味わいが出てくる濃口の甘さ。hookah-reviews.comでは45点で「まずまず美味しい部類だが、ノドへの当たりが気になる」と評され、ベリー系に優秀なものが多いStarBuzzとしては微妙という辛口。20〜30分で香りが変化する。',
  'starbuzz:bold apple doppio':
    'リコリスのキレとマッタリした甘さを併せ持つダブルアップルで、NakhlaのDouble Appleよりキレが控えめで丸みのある甘さが強い。hookah-reviews.comでは71点で「変なクセやケミカルさは無い」と評される一方、中盤からキレが薄れ甘さ主体になる点が減点された。',
  'starbuzz:bold asian persuasion':
    '巨峰の皮のようなコクのあるブラックグレープに、薄っすらとした緑茶の香りが重なる薄味でボンヤリした構成。hookah-reviews.comでは77点で「緑茶っぽい香りはかなり良く出来ている」と評された。煙はウェットできめ細かく、やや弱めの火加減で持ち味が出る。',
  'starbuzz:bold black mint':
    'リコリスだとハッキリ分かる濃いめの甘い香りに、Nakhla Mizoのミントに匹敵する強い清涼感が重なる。hookah-reviews.comでは77点で「Mixのバランスが非常に良く、シンプルながら完成度はなかなか高い」と評された。火の調節は容易で、重くないのに吸いごたえがある。',
  'starbuzz:bold black peach mist':
    '人工的なホワイトピーチ系の香りが7割、ブラックベリー系の穏やかな甘さが3割で、そこにMist系のソフトな清涼感が乗るサッパリした仕上がり。hookah-reviews.comでは78点で「香りのバランスが絶妙で良くまとまっている」と評された。清涼感が出やすいストレートボウル向き。',
  'starbuzz:bold brownie':
    'チョコレート系とコーヒー系が半々のミックスで、焦げたカラメルのようなビターさを持つコーヒー寄りの香り。hookah-reviews.comでは60点で「正直あんまりブラウニーっぽく無い」と辛口に評された。煙はドライさがなく吸いやすく、甘めのコーヒー系として割り切るなら悪くない。',
  'starbuzz:bold code blue':
    'Blue Mistらしいマッタリしたブルーベリーとシットリした弱めの清涼感に、吐き終わりからチョコレートの甘い余韻が続く。hookah-reviews.comでは78点で「意外さのあるMixながら、全体の調和がとれている」と評された。火が強すぎると清涼感が損なわれるので調節が要る。',
  'starbuzz:bold cosmo power':
    'ホワイトピーチとホワイトグレープと思われるフルーツの香りが主体で、ジャスミンに近いフローラルな香りとほのかな清涼感が重なる。hookah-reviews.comでは66点で「強めのフローラルな香りを期待するとハズレるが、それなりに美味しい」と評された。ボウルで香りの出方が変わる。',
  'starbuzz:bold dibs on ashley':
    'バブルガムやゼリービーンズのような人工的なお菓子系の甘さが主体で、吐き終わりにレモン系のかすかな香りが混じる。hookah-reviews.comでは57点で「マズくはないが、美味しくもない」と評され、何の香りか判然としないイメージ先行型という辛口。煙の質と安定感は良い。',
  'starbuzz:bold french orange':
    '動物性クリームのようなコクのあるマッタリした香りが7割、ビターなオレンジが3割で、オレンジがアクセントになり飽きにくい。hookah-reviews.comでは75点で「Mixのバランスが良い」と評された。香りの持ちは長く、最後まで一定してガッシリ香る。',
  'starbuzz:bold geisha':
    '甘さの強いホワイトピーチ系が主役で、StarBuzzらしいストレートでガッシリ濃い香りに軽い清涼感が乗る。hookah-reviews.comでは81点で「ケミカルさと甘さは強いが、エグさやクセは無い」と高く評された。甘さが立ちすぎないPhunnel向きで、ミントとの相性も良い。',
  'starbuzz:bold golden grape':
    'Al Fakherのグレープから酸味を抜いて薄めたような、非常にアッサリと軽やかなホワイトグレープ。hookah-reviews.comでは79点で「White Grape系の中では間違いなくアタリの部類」と評された。ウェットで吸いごたえのある煙で、軽やかさが出るPhunnelが推奨されている。',
  'starbuzz:bold grape freeze':
    'Nakhla MizoとAl Fakherのグレープの中間のようなサッパリしたホワイトグレープに、弱めのアイス系のヒンヤリしたテイストが重なる。hookah-reviews.comでは75点で「無難かつ高水準にまとまっている」と評された。火が強いと甘さが立ち清涼感が損なわれる。',
  'starbuzz:bold grapefruit mint':
    'スウィーティーのような淡いグレープフルーツの香りで、かすかなビターさとスペアミント寄りの清涼感が爽やかさを引き立てる。hookah-reviews.comでは78点で「サッパリしたCitrus系の中では、間違いなくアタリの部類」と評された。火が強いと煙が粗くなるため調節が少し必要。',
  'starbuzz:bold green savior':
    '白檀のようなウッド系の香りが主軸で、そこにアッサリしたレモンと弱めの清涼感、控えめな甘さが重なる。薬っぽいクセは強いものの煙の質と吸い心地はスッキリし、火の調節も容易で安定感がある。hookah-reviews.comでは65点で「クセが強いので吸う人を選ぶ」と評された。',
  'starbuzz:bold irish kiss':
    'ピーチ味のタブレット菓子のような、やや人工的で分かりやすい甘いピーチに、序盤は強めのミントの清涼感が乗る王道ミックス。ケミカルなクセは無く吸いやすいが、清涼感は中盤で薄れる。hookah-reviews.comでは72点で「王道のMixが無難に良く出来ている」と評された。',
  'starbuzz:bold irish peach':
    'キレのある爽やかなピーチが2に対し、ココナッツ系に似たマッタリした甘さが1ほど混じり、吐き出す際に甘さが鼻を抜ける。香りの持ちは長いが、ケミカルさが強くピーチの爽やかさを甘さが邪魔するとの指摘も。hookah-reviews.comでは50点で他社のピーチ系に見劣りすると評された。',
  'starbuzz:bold jack the ripper':
    '近ごろ珍しいブラックグレープ系で、クドくないマッタリした甘さと奥行きのある紫ブドウの香りが特徴。公式が謳うスパイス感はほぼ無く、煙の質・香りの持ち・安定感ともソツがない。hookah-reviews.comでは78点で、入手しやすいブラックグレープ系の有力な選択肢と評された。',
  'starbuzz:bold lady in red':
    'マッタリしたチェリーと、トゲの無い穏やかなシナモンが半々のミックスで、吐いた後の余韻に濃いチェリーが残るシックな甘さ。ノドへの刺激は少なく、香りの持ちや火加減の扱いやすさも良好。hookah-reviews.comでは70点で「全体のまとまりはなかなか良い」と評された。',
  'starbuzz:bold margarita freeze':
    'ライムを思わせるシトラスの香りに純粋な清涼感と、酒の口当たりを模したケミカルなビターさが加わりスッキリ仕上がる。序盤は美味だが中盤以降はビニルっぽい後味が出て、独特の重さも残る。hookah-reviews.comでは60点で、後味のクセが惜しいと評された。',
  'starbuzz:bold mighty freeze':
    'ビターさや酸味の無い透明感のあるレモンに、やや強めの清涼感を合わせたクリアなレモンミント。ノドに障りやすいシトラス系ながら煙は非常にスムーズで、火の調節も容易。hookah-reviews.comでは78点で「レモンミントとしての完成度はかなり高い」と評された。',
  'starbuzz:bold mint colossus':
    'イチヤクソウ由来のわずかに湿布っぽい甘さと、他社より弱めで非常にソフトな清涼感を持つミント。香りは穏やかでクセも少ないが、煙がドライでノドに障り、香りと清涼感が早めに薄れて火加減も面倒。hookah-reviews.comでは50点で、中途半端という辛口評価。',
  'starbuzz:bold peach ice tea':
    '今どきの白桃系に近いピーチの香りに、吐き終わりで微かなフローラルさとビターさのある紅茶が重なりスッキリまとまる。ケミカルさは控えめで、きめ細かい煙と扱いやすさも評価が高い。hookah-reviews.comでは77点で、絶妙なミックスバランスと評された。',
  'starbuzz:bold peach mist':
    'サッパリしたホワイトピーチ系の甘い果実感に、Mistラインらしい穏やかな清涼感を合わせた分かりやすい一本。吸い心地は良く安定感もあるが、余韻がややケミカルでクセが残る。hookah-reviews.comでは69点で、今どきの白桃系として及第点と評された。',
  'starbuzz:bold peach queen':
    'ハッキリした濃い口のピーチに、アールグレイのような紅茶っぽいビターさがわずかに重なるピーチティー。香りの持ちと煙のボリュームは良いが、吐き終わりから余韻が非常にケミカルでクセが強い。hookah-reviews.comでは50点で、吸う人を選ぶと評された。',
  'starbuzz:bold pineapple freeze':
    '生のパイナップルと缶詰の中間ほどの輪郭のはっきりした香りに、吐くとき少しヒンヤリする程度の控えめな清涼感。駄菓子っぽさが抑えられ、煙もスムーズで火加減は適当でも崩れにくい。hookah-reviews.comでは78点で「地味に良く出来ている」と評された。',
  'starbuzz:bold purple savior':
    'ファンタグレープのような分かりやすいブドウの香りに、炭酸の爽快感を模した弱い清涼感を合わせたやや薄味な仕上がり。吸い心地はスムーズだが、スパイシーでケミカルなクセが狙いを外している。hookah-reviews.comでは55点で、定番のグレープ系としては非力と評された。',
  'starbuzz:bold queen of sex':
    '酸味を伴うマッタリしたライムが主体で、微かにトロピカルフルーツとココナッツの甘さが混じるボディのあるシトラス系。ケミカルさは強めだが香りの持ちが良く、輪郭が明快でミックスにも使いやすい。hookah-reviews.comでは74点で、出来は悪くないと評された。',
  'starbuzz:bold simply mango':
    'ガッシリと濃いマンゴーで、吐いた後の余韻は実物に近い果実感。ワックスっぽさはそれなりだがケミカルなクセは少なく、煙の質はスムーズかつボディがあり、火の調節も簡単。hookah-reviews.comでは76点で、濃いめのマンゴー系の良作と評された。',
  'starbuzz:bold simply mint':
    '清涼感とかすかな甘さだけで構成されたミニマルなミントで、Al FakherのMintと同程度かやや強い清涼感ながら喉には障らない。hookah-reviews.comでは70点で「純粋な清涼感のみというStarBuzzらしい突き抜け方だが、持ちが少し悪い」と評された。',
  'starbuzz:bold spiced chai':
    '少し焦がしたキャラメルのようなビターさとローストナッツの香ばしさを持つCream系で、ミルクキャラメルやベイリーズを思わせる。スパイス感は控えめ。hookah-reviews.comでは83点で「珍しい香りが高水準にまとまっている」と評され、煙の質や香りの持ち、高温への強さも良好。',
  'starbuzz:bold tropicool':
    '駄菓子のパイン飴を思わせるハッキリしたパインの香りに、ヒンヤリした清涼感が重なる。クドさやクセはなくスッキリ吸える。hookah-reviews.comでは77点で「出来は悪くない」と評され、火の調節も容易。パインを出すならPhunnel推奨とされる。',
  'starbuzz:bold watermelon freeze':
    '皮の香りが少ないマッタリ甘めのスイカに、ミント感のない純粋な清涼感を重ねたIce系。序盤はサッパリだが中盤から清涼感が薄れる。hookah-reviews.comでは70点で「清涼感の持ちが残念」と評され、煙の質や火の扱いやすさは良好とされた。',
  'starbuzz:bold white bear':
    'FumariのWhite Gummi Bearを意識した一本で、濃縮還元のパイナップルジュースのようなPineapple系が主体。グミっぽさは控えめ。hookah-reviews.comでは77点で「グミを期待すると外れるが、Pineapple系と割り切れば普通に良く出来ている」と評された。',
  'starbuzz:bold white chai':
    'Cream系の柔らかな甘さと微かなスパイス感はあるものの、紅茶らしさは乏しくWhite Peachのようなピーチの香りが全面に出る。hookah-reviews.comでは60点で「不味くはないがチャイを期待するとハズレる」という辛口評価。煙はシルキーで吸い心地は良い。',
  'starbuzz:bold white mint':
    '清涼感の強いキリッとしたスペアミントに、湿布のようなイチヤクソウの甘い香りが微かに混じる。時間とともに甘さが強くなる。hookah-reviews.comでは68点で「清涼感のピークがもっと続いて欲しかった」と評されたが、喉への負担の少なさは好評。',
  'starbuzz:bubble gum':
    'フルーツガムというより、輪郭のボヤけたケミカルなお菓子の甘さが主体で、StarBuzzのCandyに近い漠然とした甘さが目立つ。hookah-reviews.comでは40点で「バブルガムらしい香りが早々に薄れるのが致命的」と辛口に評された。',
  'starbuzz:candy':
    '砂糖と僅かな香料だけの昔ながらの飴玉のような、漠然と甘いだけのシンプルな味でクセは皆無。味の持ちは非常に長い。hookah-reviews.comでは60点で「恐ろしく無難、シンプルの極み」と評され、Al FakherのMintに少量混ぜるミックス素材として推されている。',
  'starbuzz:cantaloupe':
    '渋みとスモーキーさが強い、クラシックなシーシャのメロン。hookah-reviews.comでは「昔ながらのシーシャのメロンをStarBuzzなりにリメイクした香り」と評され、NakhlaやAl Fakherのメロンに通じるがビターさは強め。煙が粗く喉に障りやすい点は辛口に指摘されている。',
  'starbuzz:cappuccino':
    'コーヒー味の菓子に使われるカラメル香料のような、苦めのコーヒーキャンディの香り。甘さは控えめでビターにまとまる。hookah-reviews.comでは25点で「ベースの香りが強くカプチーノが分かりにくい」と低評価。現在は生産されていないとみられる。',
  'starbuzz:caramel apple':
    'リコリスの効いたダブルアップルをベースに、わずかにビターなマッタリしたキャラメルの甘さを重ねた一本で、アップルのシャープさは残る。hookah-reviews.comでは75点で「リコリスのクセをキャラメルがカバーしつつキレも残る絶妙なバランス」と高く評された。',
  'starbuzz:caramel macchiato':
    '吸うときと吐くときはミルクジャムのような甘い香り、余韻はビターで、確かにキャラメルと分かる濃い香り。ビターな余韻のおかげでクドくなりにくい。hookah-reviews.comでは65点で「最後まで飽きずに吸えた」と評された。',
  'starbuzz:cherry':
    'よく熟したアメリカンチェリーのような甘みの強い香りで、お菓子っぽさやツンとしたクセは控えめ、フルーツ寄りのサッパリした甘さ。hookah-reviews.comでは70点で「他社のチェリーと比べても劣らない出来」と評されたが、味の持ちはやや短い。',
  'starbuzz:chocolate mint':
    'ココアシガレットのような粉っぽいチョコレートが主役で、ミントの清涼感は脇役。時間が経つと粉っぽさが抜けチョコレートらしくなる。hookah-reviews.comでは45点で「駄作揃いのチョコミントの中では良く出来ている」と評された。',
  'starbuzz:chocolate strawberry':
    'サッパリしたストロベリーとミルクチョコレートをほぼ半々で重ねた香りで、粉っぽさがなくナチュラルな甘さ。煙はStarBuzzの平均で、最後までバランスが崩れない安定感がある。hookah-reviews.comでは78点で「甘いがクドくない」と評された。',
  'starbuzz:citrus mint':
    '皮のニュアンスを伴うオレンジが主体で、吸うときにほんのりミントのメンソール感が乗る。喉に障らないスムーズな煙だが、中盤以降によく分からないケミカルなクドい甘さが出る。hookah-reviews.comでは50点で「ほとんどオレンジミントで無難すぎる」と評された。',
  'starbuzz:citrus mist':
    'Blue Mist系のブルーベリーの香りにライムらしいシトラスが重なり、時間とともにシトラスが強まって甘さ控えめにサッパリしていく。ひんやりした喉越しで軽く、最後まで安定して香る。hookah-reviews.comでは75点で「Blue Mistの甘さが強いと感じる人にすすめられる」と評された。',
  'starbuzz:classic cola':
    '炭酸のチクチク感がないマイルドなコーラ単体の香りで、駄菓子のコーララムネ寄りの甘さがやや強め。喉越しはスムーズで焦げにくいが、香りの持ちは平均より少し短い。hookah-reviews.comでは65点で「可もなく不可もないまずまずの出来」と評された。',
  'starbuzz:classic mojito':
    '透明感のある甘さのミントにライムが重なった薄味ながらしっかり香るモヒートで、煙の質と味の持ちは良好。ただしニコチンとは別の得体の知れない重さがあり、評価は大きく割れる。hookah-reviews.comでは30点で「味だけなら80点だが謎の鎮静作用が不気味」と辛口に評された。',
  'starbuzz:cocojumbo':
    'ライム7にココナッツ3ほどの配分で、スッキリしたライムのビター感をココナッツのマイルドな後味が支える。中盤から濃い煙が大量に出て、最後まで爽やかなライムが続く持ちの良さも評価された。hookah-reviews.comでは77点で「ミックスのバランスが良いダークホース」と評された。',
  'starbuzz:coconut':
    'ココナッツジュースを思わせる水々しく控えめな甘さで、ココナッツ系の中ではサッパリした部類。煙は軽く吸い心地が良い一方、香りの持ちは平均よりやや短く、StarBuzzにしては少し焦げやすいとされる。hookah-reviews.comでは65点で「ミックスの幅が広がる」と評された。',
  'starbuzz:code 69':
    '8割がたコーラで、吐くときに奥からアプリコット系のマイルドな甘いフルーツが香る。序盤は炭酸らしいチクチクした当たりがあるが20分ほどで消え、その後は薄めのコーラのような物足りなさが残る。hookah-reviews.comでは60点で「変なクセがなく無難な出来」と評された。',
  'starbuzz:cosmopolitan':
    'スッキリしたライムを軸にオレンジとクランベリーの甘さが混じり、Nakhlaの同名品より角の取れたマイルドな仕上がり。ボリュームのある煙ながら喉に障らず、カクテル系にありがちな妙な酩酊感もない。hookah-reviews.comでは75点で「シトラス系が好きなら試す価値が大きい」と評された。',
  'starbuzz:double apple':
    'リコリスの香りを伴う昔ながらのダブルアップルで、Nakhlaのそれよりマイルドな甘さが強くキレ感は控えめ。しっかりした煙量とがっしりした吸いごたえがあり、崩れずに最後まで安定して香る。hookah-reviews.comでは75点で「ダブルアップル好きなら大きく外さない」と評された。',
  'starbuzz:egyptian pharos':
    'ローストしたアーモンドやピーカンナッツのような香ばしさに香木っぽさが混じるクリーム系で、甘さは控えめ。ウェットでスムーズな煙が持ち味だが、火が強すぎるとクリーム系の香りが崩れやすい。hookah-reviews.comでは68点で「キワモノを無難にまとめており思ったより良い」と評された。',
  'starbuzz:flower power':
    'ジャスミン系のフローラルとお菓子っぽいソフトなレモンがほぼ半々で、全体としてはマッタリしたフローラル寄り。喉に障らないどっしりした煙で持ちも長いが、フローラル系は好みが分かれる。hookah-reviews.comでは55点で「ミックスのチョイスとバランスは非常に良い」と評された。',
  'starbuzz:fruit sensation':
    'StarBuzzらしいケミカルでハッキリしたチェリーが主役で、サッパリしたマスカット系のグレープが脇を固める。甘さは強いが抜けが良く、最後まで崩れない味の持ちの良さがある。hookah-reviews.comでは67点で「チェリー好きには自信をもってすすめられる」と評された。',
  'starbuzz:fuzzy lemonade':
    'ラムネ菓子を思わせる甘さのあるレモネード系で、喉に障らない程度のビター感と酸味がスッキリ効く。序盤数分だけホコリっぽさがあるが以降は安定し、濃い煙と火の調節のしやすさが評価された。hookah-reviews.comでは75点で「吸いごたえが非常に良い」と評された。',
  'starbuzz:fuzzy naval':
    'ピーチ7にマイルドなオレンジ3ほどの配分で、まったり甘いピーチをオレンジがややサッパリさせる名前どおりのカクテル。きめ細かい煙で喉越しは良いが、カクテル系にありがちな妙な重さがわずかにある。hookah-reviews.comでは60点で「香り自体は良く出来ているが妙な重さが残念」と評された。',
  'starbuzz:grapefruit':
    'シトラス系としてはやや甘めで、ほんのりしたビターさを伴う黄色い果肉のグレープフルーツの香り。Al Fakherのものより苦味はずっと控えめで、ケミカルさのないマイルドな仕上がり。hookah-reviews.comでは73点で「弱めの火加減ならサッパリと香る、なかなかの煙」と評された。',
  'starbuzz:grapefruits':
    'シトラス系としてはやや甘めで、ほんのりしたビターさを伴う黄色い果肉のグレープフルーツの香り。Al Fakherのものより苦味はずっと控えめで、ケミカルさのないマイルドな仕上がり。hookah-reviews.comでは73点で「弱めの火加減ならサッパリと香る、なかなかの煙」と評された。',
  'starbuzz:guava':
    'グァバらしい爽やかな甘い香りが主体で、水々しさは控えめ、果物らしいテイストが前に出る。StarBuzzには珍しくサッパリ系と言い切れる仕上がりで、煙もノドへの当たりが柔らかい。hookah-reviews.comでは65点で「グァバの中では確実にアタリの部類」と評された。',
  'starbuzz:hard rush':
    'ルートビアを思わせるケミカルな清涼感に、スッキリめのフルーツミックスを重ねた香り。清涼感が強い割にノドへの負担は少なく、後半はフルーツが薄れて清涼感が前に出る。hookah-reviews.comでは65点で「まとまりは良いがルートビア系の香りの好みが分かれる」と評された。',
  'starbuzz:holiday mix':
    'バナナのようなマッタリした甘さと、シナモンやジンジャー、クローブらしいスパイスが半々のジンジャーブレッド風ミックス。スパイス系にしては甘さ控えめでキレがあり、煙はウェットで火の調節も容易。hookah-reviews.comでは65点で「甘さが控えめでそれなりに楽しめた」と評された。',
  'starbuzz:honeyberry':
    'スプーンですくったハチミツのような濃厚な甘い香りが主体で、後味にマイルドなベリーがほんのり抜ける。煙はボリュームがあり吸いごたえ十分だが、濃いハチミツの香りは序盤で薄れやすい。hookah-reviews.comでは70点で「Honey系としては良く出来ている」と評された。',
  'starbuzz:kiwi':
    '酸味のないケミカルな甘い香りが中心で、水々しさはあるもののキウイにしてはややモッタリした印象。クセがなく吸いやすい一方、後半はタバコ的な重さが気になるとの指摘もある。hookah-reviews.comでは50点で「キゥイらしい爽やかさを期待するとハズレる」と評された。',
  'starbuzz:kiwi strawberry':
    'ストロベリー7〜6にキウイ3〜4ほどの配合で、序盤はストロベリーが強くキウイは分かりづらい。火が強いとストロベリーだけになり安定感を欠くが、吸いごたえはシッカリしている。hookah-reviews.comでは45点で「マズくはないがキウイが分かりづらい」と評された。',
  'starbuzz:lebanese bombshell':
    '甘さがほとんど無く、針葉樹林のような清々しい森の香りを再現した異色のフレーバー。煙は細かくスムーズでタバコ的な重さも軽く、香りの持ちも長い。hookah-reviews.comでは75点で「他社に無い香りで好き嫌いは分かれるが清々しさが魅力」と評された。',
  'starbuzz:lemon':
    '甘さ控えめで、果物のレモンらしい酸味とビターさが印象的な香り。StarBuzzらしくケミカルさやお菓子っぽさは少なく、シトラス系にしては煙がスムーズで吸いやすい。hookah-reviews.comでは70点で「明らかな欠点は無く無難によく出来ている」と評された。',
  'starbuzz:lemon mint':
    'ビターさを抑えたレモンの香りに、ほんのりした清涼感を合わせた軽やかでサッパリした仕上がり。煙はウェットでノドへの負担がなく、火加減による崩れも少ない。hookah-reviews.comでは75点で「他社のLemon Mintと比べても見劣りしない出来」と評された。',
  'starbuzz:lemon tea':
    'アールグレイ寄りの紅茶7にレモン3ほどの配合で、時間が経つとペットボトルのホットレモンティーのようなマッタリした香りに落ち着く。序盤10分ほどはノドに障るが、その後は安定する。hookah-reviews.comでは50点で「レモンティーの再現度は評価できる」と評された。',
  'starbuzz:man go':
    'ワックス臭さが控えめで、まったりしたトロピカルな甘さが前に出る濃厚なマンゴー。煙はボリュームと密度があり、ノドに障らず芯のある吸いごたえだが、中盤までは甘さが喉に残る。hookah-reviews.comでは65点で「無難によく出来ており、ミックスにも使いやすい」と評された。',
  'starbuzz:margarita':
    'オレンジとレモン（あるいはライム）を思わせるシトラスが主体で、甘さ控えめのシャープでキリッとした香り。煙はやや硬めでノドに当たる感じがあり、時間とともに香りは薄味になる。hookah-reviews.comでは62点で「キレのあるサッパリしたシトラス系」と評された。',
  'starbuzz:marlett':
    '当初はパッションフルーツやグァバのような香りとローズ寄りのフローラルのミックスだが、10分ほどで個々の要素を拾えない混沌とした甘い香りに変化する。甘さが強く煙もやや重め。hookah-reviews.comでは20点で「重いフローラルと雑然とした甘さが苦手」という辛口評価だった。',
  'starbuzz:marlette':
    'パッションフルーツやグァバを思わせる香りにローズ寄りのフローラルさが重なるが、10分ほどで個々の要素を判別しづらい雑然とした甘さへ変化する。甘さがノドに障り、煙の質は同社平均をやや下回る。hookah-reviews.comでは20点で「謎フレーバー」と評された。',
  'starbuzz:melon blue':
    '無難によく出来たメロンの香りにMist系の清涼感を重ね、後味に緑茶のような奥行きが残る変わり種。甘さはやや強めだが煙はスムーズで、火の調節も簡単で安定している。hookah-reviews.comでは75点で「Melon系が好きであれば試して損は無い」と評された。',
  'starbuzz:orange':
    'ミカンのような甘さにオレンジらしい酸味とビターさが乗った、ケミカルさのないスッキリ系。煙の量・質は同社平均で、シトラス系特有のノドへの当たりも他社より弱め。hookah-reviews.comでは75点で「基本に忠実な作りで他社の良いオレンジと比べても遜色ない」と評された。',
  'starbuzz:passion fruit':
    '酸味はほとんどなく、パッションフルーツのピューレを思わせるトロンとした甘い香りに、Al FakherのMango系に近いワックスっぽさが重なる。煙はウェットで同社平均より明らかに質が良く、火の調節も安定。hookah-reviews.comでは80点で「なかなかの再現度」と評された。',
  'starbuzz:passion fruit mojito':
    'パッションフルーツの香りは薄く、モヒートらしいミントの清涼感もない。余韻にアルコールを思わせるビニールっぽいビターさが残る程度で、のっぺりした甘さが目立つ。煙は細かく濃いものの、hookah-reviews.comでは30点で「これといった特徴が無くオススメしにくい」と評された。',
  'starbuzz:passion kiss':
    'パッションフルーツ系らしいマッタリした甘さが半分、残りは漠然としたフルーツ系という輪郭のぼやけたミックスで、酸味はほぼない。煙はきめ細かくスムーズで、扱いやすさは同社平均以上。hookah-reviews.comでは62点で「メインの香りがハッキリせず焦点が定まらない」と評された。',
  'starbuzz:peaches n cream':
    '無難によく出来たピーチの香りに、まろやかなクリームのテイストを4割ほど重ねた構成。クリームがピーチ特有のノドへの当たりを覆い、煙は同社平均よりきめ細かくウェットな吸い心地。hookah-reviews.comでは70点で「欠点を上手に隠している」と評された。',
  'starbuzz:pina colada':
    'ココナッツとパインアップルに、フローズン仕立てを思わせるMist系のヒンヤリしたテイストを重ねた分かりやすい構成。煙の量・質は同社平均より良く、清涼感のおかげでココナッツ入りでもクドくない。hookah-reviews.comでは60点で「トロピカルテイストが好きな人にはヒットする可能性はある」と評された。',
  'starbuzz:pineapple':
    '駄菓子のパイン飴を思わせる、どことなく深みのある甘いパインアップルの香り。ただし煙の質が同社平均以下でノドへの当たりが強く、弱めの火加減にするなどの工夫が要る。hookah-reviews.comでは50点で「香りは確かにパインだが煙の質が悪すぎる」と評された。',
  'starbuzz:pink':
    'ストロベリーを軸にラズベリーとピーチを重ねた王道のベリーミックスで、序盤はストロベリー、時間が経つとラズベリーとピーチが前に出る。煙はややドライだが香りとの相性は良く飽きにくい。hookah-reviews.comでは83点で「中身は普通に美味しい王道ミックス」と評された。',
  'starbuzz:pink lady':
    'コクのある甘いフルーツの香りに透明感のあるライム系がほんのり混じり、薄味ではないのに全体へ淡さが漂うのが特徴。煙はシットリとソフトで、香りの持ちも同社平均より長く安定感がある。hookah-reviews.comのBold版レビューでは73点で「薄味でないのに淡いという珍しい特徴がある」と評された。',
  'starbuzz:pirate s cave':
    'ライム味のガムやラムネ菓子を思わせるケミカルで濃いめのライムで、フレッシュさよりマイルドな存在感が身上。シトラス系の割にノドに障らず、香りが濃いためミックスでも負けにくい。hookah-reviews.comでは74点で「良く売れるのも納得できる香りと煙」と評された。',
  'starbuzz:plum':
    'アプリコット系にピーチを少し混ぜたような甘めのまったり系で、序盤のわずかな水々しさが特徴だが、後半はボンヤリしたフルーツの甘さに寄る。火が強すぎると水々しさが飛ぶため多少の調節が要る。hookah-reviews.comでは45点で「ハッキリした焦点が無い香り」と評された。',
  'starbuzz:pomberry':
    'ザクロ6にベリー4ほどの割合で、クランベリーのようなサッパリした甘さの後に、青臭く泥臭いザクロの皮の後味が残る。煙はややドライで疎く、炭の加減で味が崩れやすく安定感に欠ける。hookah-reviews.comでは57点で「あえて買う必要は無い」と評された。',
  'starbuzz:pomegranate':
    '酸味はなく、果実というよりザクロジュースに近い水っぽい香り。序盤は甘さが強くザクロ感が伝わりにくいが、甘さが薄れてからはクセのないサッパリした薄口のテイストになる。hookah-reviews.comでは30点で「不味くはないが特に美味しくもない」と評された。',
  'starbuzz:pumpkin pie':
    'シナモンを中心にクローブらしさも混じるスパイス系で、余韻にかぼちゃの香りがほのかに残る。hookah-reviews.comでは63点で「優しい甘さのスパイス系」と評されたが、カボチャが意識しないと分かりにくい点やボウルを選ぶ点は難点。強火だと煙がドライになるため弱めの火加減が向く。',
  'starbuzz:raspberry':
    '他社のラズベリー系より薄味でサッパリしており、酸味やケミカルさがなく穏やかな甘さ。非常にウェットな煙で水々しいテイストが出るのが持ち味。hookah-reviews.comでは76点で「みずみずしいラズベリー」と評され、地味な掘り出し物と位置づけられた。',
  'starbuzz:rose':
    '甘さ強めでまったりした濃口のローズ単体の香りで、火加減を弱めるとサッパリ、強めると濃厚になる。hookah-reviews.comでは30点で「火の具合で香りが変わる」と評されたが、これは評者がローズを苦手とするためで、ウェットでスムーズな煙自体は高評価。',
  'starbuzz:royal grape':
    '睡蓮のお香やムスクを思わせる優雅な香りが主体で、グレープはごく控えめに甘さを添える程度。hookah-reviews.comでは60点で「ロータスのお香のような香り」と評され、評者がお香系を苦手とするための低めの点数ながら、フローラル系好きには試す価値が大きいとされた。',
  'starbuzz:safari melon dew':
    'クラシックなメロン系とFumariのAmbrosiaの中間にあたり、余韻にクセのないウリらしさが出る。煙が粗くなりがちなメロン系としては吸い心地がスムーズ。hookah-reviews.comでは76点で「よく出来た普通のメロン」と評され、自信をもって勧められる出来とされた。',
  'starbuzz:sex on the beach':
    'マンゴーを軸にしたトロピカルフルーツとココナッツのミックスで、StarBuzzにしては薄味でサッパリめ。hookah-reviews.comでは35点で「トロピカルフルーツとココナッツのMix」と評されたが、低い点数は評者がココナッツを苦手とするためで、クドさのない作り自体は無難と評価された。',
  'starbuzz:sour apple':
    '焦点のぼやけた甘酸っぱい香りで、アップルらしさはほとんど伝わってこず、喉の奥に残る酸味のようなタッチが特徴。hookah-reviews.comでは60点で「ぼんやりした味」と評され、水々しくきめ細かな煙は良いがあえて買うほどではないという辛口。',
  'starbuzz:spearmint':
    'スペアミントらしいフレッシュな香りに、Al Fakherのミントの半分ほどの控えめな甘さを合わせた完全なサッパリ系。hookah-reviews.comでは78点で「キレがあるのにスムーズなミント」と評され、ミント好きの評者が買い足すほどの高評価だった。',
  'starbuzz:spicy red':
    '人工的でハッキリしたガムの香り3に対しシナモン1ほどのミックスで、吐き終わりにシナモンが鼻を抜けるスパイシーな仕上がり。hookah-reviews.comでは61点で「Al FakherのGumとシナモンのMix」と評され、歯磨き粉のようなクセがあり万人受けはしないとされた。',
  'starbuzz:strawberry':
    'ヘタのような青臭さがなく、日本のイチゴに近い親しみやすい甘さのストロベリーで、丁度よい濃さでクドくない。hookah-reviews.comでは70点で「クセのないストロベリー」と評され、煙も平均より良く、定番として無難かつ優秀な出来と評価された。',
  'starbuzz:strawberry daiquiri':
    'クセのない甘さのストロベリー7にライム3ほどで、単体のストロベリーよりサッパリした薄味の仕上がり。hookah-reviews.comでは45点で「サッパリめのストロベリー」と評され、ダイキリ感は伝わらずあえて選ぶ理由に乏しいという辛口。',
  'starbuzz:strawberry margarita':
    'StarBuzzのMargaritaにStrawberryを重ねた配分で、シトラスの爽やかさとストロベリーの優しい甘さが両立している。hookah-reviews.comでは68点で「サッパリした優しい甘さ」と評され、ミックスのバランスと喉に負担のない吸いごたえが好評だった。',
  'starbuzz:sweet apple':
    'キャンディーのようなお菓子っぽい甘さ7に今時のアップル3ほどで、序盤はアップルが分かりにくいのっぺりした甘さ。hookah-reviews.comでは45点で「のっぺりした甘さのアップル」と評され、煙はきめ細かいものの狙いが不明瞭という評価にとどまった。',
  'starbuzz:sweet melon':
    'ほぼメロン一色のマイルドな香りで、Safari Melon Dewよりやや人工的な甘さが強い。hookah-reviews.comでは50点で「よく出来た普通のメロン」と評され、ストレートボウルでは焦げやすく、安定感ではSafari Melon Dewに劣るとされた。',
  'starbuzz:tangerine dream':
    '酸味やシャープさを抑えた、マイルドで甘さの強いオレンジ。喉当たりの強いシトラス系としては吸いやすく、炭の調節が簡単で味も崩れにくい。hookah-reviews.comでは60点で「マイルドなオレンジ」と評され、平均点以上の手堅い作りで万人受けするとされた。',
  'starbuzz:tequila sunrise':
    'テキーラ、オレンジ、グレナディンのカクテルを模した、甘さ控えめでキリッとしたシトラス系。アルコールを思わせるケミカルな香りが混じり、時間が経つとそれが薄れて普通のシトラス系になる。hookah-reviews.comでは45点で「吸えなくはないが好みでもない」と評され、あえて選ぶ理由はないという辛口。',
  'starbuzz:tropical fruit':
    'マンゴーを軸に何のフルーツか掴みにくい香りが重なるトロピカル系で、ココナッツ感はなく甘さも控えめ。煙はきめ細かくスムーズだが味の持ちは短めで、焦げると香りが崩れやすい。hookah-reviews.comでは50点で「マズくはないが特別おいしいわけでもない」と評された。',
  'starbuzz:turkish apple':
    '赤リンゴの香りにDouble Apple特有のキレ感が混じり、リコリスは控えめ。ウェットで吸いごたえのある煙が出て、火加減も容易で安定感が高い。hookah-reviews.comでは76点で、クラシックなDouble Appleを丁寧にリメイクした出来だがインパクトには欠けると評された。',
  'starbuzz:u f o':
    'マッタリした花の香りとシトラス系のミックスで、20分ほどでフローラルさが薄れNakhlaのCosmopolitanに似た柑橘が主役になる。密度のある煙がよく出てタバコ的には軽め。hookah-reviews.comでは72点で、ケミカルさ込みで割り切って吸えばそこそこ美味しいと評された。',
  'starbuzz:vanilla':
    'シーシャのバニラ系としては濃いめだが、ケミカルさやノドに残る甘さは少なく、キレのよい素直なバニラ。味の持ちは長い一方、燃えすぎると酸っぱく崩れる。hookah-reviews.comでは55点で、濃くなり過ぎないラインを上手く見極めた出来と評され、ミックスにも使いやすい。',
  'starbuzz:vintage dark caribbean':
    '薄っすらとしたライムを軸に、輪郭のぼんやりしたフルーツが重なる穏やかなミックス。クドさやクセがなく、煙はしっとりスムーズで香りの持ちも長い。hookah-reviews.comでは65点で、香りの焦点が定まらない点にモヤモヤするがソフトで吸いやすいと評された。',
  'starbuzz:vintage dark mist':
    'ブラックベリーの絵柄に反しブルーベリーが主役の、甘さ控えめでケミカルさの少ないBlue Mist系。土っぽいベースの香りが奥行きを与え、煙はウェットで扱いやすい。hookah-reviews.comでは77点で、Al FakherのBlueberry with Mintが好きなら試す価値は非常に大きいと評された。',
  'starbuzz:vintage dark vanilla':
    'バニラ自体は素朴で程よいが、マッタリした甘さが非常に強く、弱めの火加減にしないとクドくなる。香りと煙の質を同時に良く出すのが難しく、火の調節は難物。hookah-reviews.comでは35点と低評価で、コッテリしたバニラ系を探す人向けと評された。',
  'starbuzz:vintage fresh lime':
    '爽やかな酸味のライムがハッキリ出た柑橘系で、わずかな甘さを伴いながらケミカルさは抑えめ。柑橘系としては煙が非常にスムーズで、火加減も容易で扱いやすい。hookah-reviews.comでは79点で、ワザとらしさがなくミックスにも使いやすいとオススメされた。',
  'starbuzz:vintage ginkco':
    'マッタリした甘さのクリーム系に微かなビターさと土っぽさが混じり、中国茶でいれたミルクティのような一風変わった香り。ココナッツは後ろに隠れ気味。煙はウェットで安定感もあり、hookah-reviews.comでは68点で、好みは分かれるがフルーツ以外とのクリーム系として貴重と評された。',
  'starbuzz:vintage honey dew me':
    '熟したメロンの中心部を思わせる、クラシックなシーシャのメロン系を一回り洗練させた香りで、酸っぱさやノドに障る甘さはない。メロン系には珍しく火の調節が容易で安定感が高い。hookah-reviews.comでは77点で、クラシックなメロン系を探すなら試す価値は非常に大きいとオススメされた。',
  'starbuzz:vintage morning breeze':
    '華やかな紅茶の香りが主役で、微かな柑橘がベルガモットのように効いたアールグレイのアイスティ風。煙は極めてスムーズだが、時間が経つとグリセリンっぽい甘さが出やすい。hookah-reviews.comでは76点で、煙の質の良いアールグレイを求めるなら試す価値は極めて大きいと評された。',
  'starbuzz:vintage orange chocolate':
    'オレンジピールに薄くダークチョコレートをかけたオランジェットのような香りで、比率はオレンジ3対チョコレート1ほど。柑橘系ながら煙はスムーズで火の調節も容易。hookah-reviews.comでは75点で、他社に珍しい組み合わせが狙い通りに仕上がっているとオススメされた。',
  'starbuzz:vintage spice me red':
    'ラズベリーを軸にストロベリーとクローブを重ねたミックスで、吐いた後の余韻に甘くクスリっぽいクローブがしっかり残る。煙はボリュームがありスムーズで安定感も良い。hookah-reviews.comでは65点で、スパイス系が苦手な筆者ゆえの低めの点数とされ、シナモン系が好きな人向けと評された。',
  'starbuzz:vintage sweet cigar':
    'バニラのような甘い香りに、葉巻の余韻を薄めたようなスモーキーなタバコの葉の香りが混じる。煙の質はやや乾いてノドに障るが、火の調節は容易で香りの持ちは長め。hookah-reviews.comでは55点で、誰に勧めるべきか分からないイロモノという辛口の評価だった。',
  'starbuzz:vintage timisue':
    'Al FakherのCappuccinoに似たクラシックなコーヒー系を軸に、ダークバニラと微かなチョコレートが重なるベイリーズ風の甘い香り。焦げたビターさや煙のドライさは控えめで、やや弱めの火加減のほうが香りと煙の質が出る。hookah-reviews.comでは65点で「確かにティラミスで通じる香り」と評された。',
  'starbuzz:vintage tiramisu':
    'Al FakherのCappuccinoに似たクラシックなコーヒー系を軸に、ダークバニラと微かなチョコレートが重なるベイリーズ風の甘い香り。焦げたビターさや煙のドライさは控えめで、やや弱めの火加減のほうが香りと煙の質が出る。hookah-reviews.comでは65点で「確かにティラミスで通じる香り」と評された。',
  'starbuzz:vintage tokyo spice':
    'ライムを思わせる軽やかで薄味のシトラス系に、序盤だけごく微かな清涼感が乗る香り。ケミカルさは控えめで輪郭はややぼやけるが、Al FakherのMojitoに近い方向性で、煙は安定して焦げにくい。hookah-reviews.comでは83点で「ケミカルさ控えめで軽やかなライム系を吸いたいなら試す価値は非常に大きい」と評された。',
  'starbuzz:watermelon':
    '皮の青さより実の甘さが立つスイカで、サッパリ系ではなくマッタリした甘い香りが強い。煙はボリュームがあり、NakhlaのWatermelonより質はウェットでスムーズ。hookah-reviews.comでは45点で「もっとクリアでキレのあるライトな香りであって欲しかった」と辛口に評された。',
  'starbuzz:white grape':
    'ホワイトグレープながら酸味はなく、巨峰のようなコクのあるマッタリした甘さが前に出る。時間が経つとサッパリしてくるが、同社Black Grapeに似た香りが混じる点は好みが分かれる。hookah-reviews.comでは65点で「ホワイトグレープとしては少しマッタリした甘さが強い」と評された。',
  'starbuzz:white peach':
    '甘めのピーチが主体で、吐くときにスッキリしたテイストが鼻を抜ける。FumariのWhite Peachより香りの輪郭がハッキリしてキレがあり、煙はシットリとソフトで火加減も容易。hookah-reviews.comでは80点で「出来の良い定番の香りという点で確実にアタリの部類」と評された。',
  'starbuzz:wild mint':
    'ミントらしい清涼感に、ココナッツのようなマッタリした甘さが重なるまろやかな香り。煙の量と質は良くノドへの当たりもソフトだが、ミントとしては甘さがクドいという指摘がある。hookah-reviews.comでは30点で「各社がシノギを削るMint系でこの出来というのは見劣りがする」と厳しく評された。',
  'starbuzz:wildberry':
    'ラズベリー6にブルーベリー4ほどの、非常にハッキリした甘いベリーの香り。濃いめながら水々しさがあって吐き心地は爽やかで、序盤のケミカルさも5分ほどで気にならなくなる。hookah-reviews.comでは75点で「香りの濃さと吐き心地のスムーズさを両立」と評された。',
  'starbuzz:wildberry mint':
    'Al FakherのFresh Mistのような薄口でサッパリしたベリーの香りに、吸うときの清涼感が乗る。同社Wildberryより軽くクセがなく、しっとりスムーズでボリュームのある煙が続く。hookah-reviews.comでは75点で「クセが無く煙も良いので万人受けしそう」と評された。',
  'starbuzz:winter fresh':
    'ルートビアや湿布を思わせる独特のメンソール感が甘さに勝つ、非常にスッキリした香り。ケミカルさはStarBuzzの中でも随一で好みは分かれるが、冷たく澄んだノド越しで煙の質は平均以上。hookah-reviews.comでは72点で「他社に無い斬新で確かなフレッシュさ」と評された。',
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
  // Al Fakher — 日本語レビューブログ hookah-reviews.com (byダビデ) の各フレーバー記事を要約
  // (2026-09 時点)。通常ライン / Golden / Special Edition・Fusion・Dreams Collection が対象。
  // 財務省公告には同一商品が「Al Fakher <名前>」と「AL FAKHER Shisha Molasses <名前>」の
  // 2 通りで登録されているため、両キーが同じ記事を出典として同じ説明を共有する。
  // 「with」の有無や表記ゆれ (Water melon = Watermelon、Cardamom = Cardamon、
  // Virgine Grape = Virgin Grape) も同様に同一商品として扱っている。
  // Two Apples 系 6 キーはファイル冒頭の既存定数を維持 (重複キーは作っていない)。
  // 記事が見つからなかった Caffe Latte / Fresh / Diamond Dust / Dream Scape /
  // Harvest Moon / Lucid Dream(s) / Magic Love は意図的に未記載。
  'al-fakher:apple':
    'リコリスを含まないApple系で、吐く煙が鼻を抜ける薄味加減の甘さが実物のリンゴの果肉を思わせる。hookah-reviews.comでは77点で「確かにリンゴの果肉部分を彷彿とさせる香りで良く出来ている」と評された。火加減を強めると香りが崩れるため、やや弱めの火で吸うのが無難。',
  'al-fakher:apricot':
    'Al FakherのPeachの甘さを控えめにして微かな酸味を足したような香りに、クセの少ないフローラル系あるいはアマレットのようなアクセントが混じる。hookah-reviews.comでは71点で「Peach系やPlum系が好きな人の琴線には触れる」と評された。煙はノドに障らないボディで満足感がある。',
  'al-fakher:banana':
    '紙パックのバナナオレのようなお菓子っぽい香りで、Banana Montanaのような渋味が無くクセなく吸いやすい。hookah-reviews.comでは71点で「Banana系が好きであれば、試す価値は非常に大きい」と評された。煙の質はAl Fakher平均よりずっと良くきめ細かい。',
  'al-fakher:berry':
    'Al FakherのRaspberryとBlueberryを2対1ほどで混ぜた香りで、酸味と渋味のあるラズベリーにマッタリしたブルーベリーの甘さが軽やかさを添える。hookah-reviews.comでは76点で「ややガッシリしたRaspberry系が好きな人向け」と評された。弱めの火加減だとサッパリ出る。',
  'al-fakher:blueberry':
    'ややマッタリした甘さに薄っすらとした酸味が混じる、少し酸っぱいブルーベリーガムのような香り。hookah-reviews.comでは73点で「シーシャのブルーベリー然とした香りとして、過不足無くまとまっている」と評された。強めの火でも焦げにくく扱いやすい。',
  'al-fakher:blueberry mint':
    'Al FakherのBlueberryとMintが半々のミックスで、清涼感によって薄まったサッパリした甘いブルーベリーの香りが最後までクドくない。hookah-reviews.comでは77点で「香りも煙もソツなく良く出来ている」と評された。ノド越しが良く吸いごたえにも満足感がある。',
  'al-fakher:blueberry with mint':
    'Al FakherのBlueberryとMintが半々のミックスで、清涼感によって薄まったサッパリした甘いブルーベリーの香りが最後までクドくない。hookah-reviews.comでは77点で「香りも煙もソツなく良く出来ている」と評された。ノド越しが良く吸いごたえにも満足感がある。',
  'al-fakher:bubble gum':
    'どことなくバナナを思わせるケミカルな甘い香りで、序盤のみ白いすじのような渋味が舌の奥に残る。hookah-reviews.comでは45点と辛口で、「Al Fakherのファンがこういったケミカルな香りを求めているかと言われると、あんまり求めていない」と評された。煙の量と質は平均的。',
  'al-fakher:cappuccino':
    '甘さ控えめでビターさの強い、炭焼珈琲飴のようなコーヒーキャンディの香り。hookah-reviews.comでは60点で「ニオイ残りを除けば目立った欠点などは無く、ソツなくまとまっている」と評された。吸い口やホースへのニオイ残りは激しく、火の調節は容易。',
  'al-fakher:cardamom':
    '針葉樹の樹脂を薄めたような香りとレモンの皮のようなCitrus系の香りが軸で、余韻にショウガらしさが残る甘さ控えめのSpice系。hookah-reviews.comでは77点で「万人受けする香りでは無いので強くオススメはしないが、個人的には好き」と評された。火の調節は容易。',
  'al-fakher:cherry':
    'コクのある甘さと微かな酸味が特徴で、ダークチェリーで作った酸っぱめのジャムのような香り。アメリカ系にありがちなツンとしたケミカルさは非常に控えめ。hookah-reviews.comでは68点で「ツンとしたケミカルな感じの無いCherry系を探しているのであれば、試す価値は大きい」と評された。',
  'al-fakher:cherry mint':
    'Al FakherのCherryとMintを1対1で混ぜた香りで、コクのある甘さと微かな酸味を、グリーンで少し渋いミントがサッパリと引き締める。hookah-reviews.comでは70点で「Cherry系の中では好きな方」と評された。清涼感のおかげでノド越しも良い。',
  'al-fakher:cherry with mint':
    'Al FakherのCherryとMintを1対1で混ぜた香りで、コクのある甘さと微かな酸味を、グリーンで少し渋いミントがサッパリと引き締める。hookah-reviews.comでは70点で「Cherry系の中では好きな方」と評された。清涼感のおかげでノド越しも良い。',
  'al-fakher:chocolate':
    '駄菓子のココアシガレットやハーシーズのキスチョコのような、粉乳っぽさのあるシンプルなチョコレートの香り。hookah-reviews.comでは65点で「ミニマルかつシンプルな香りながらチョコレートらしい香り」と評された。火加減が強いとビターさが出てノドに障る。',
  'al-fakher:chocolate with mint':
    'マイルドな甘さの強い外国のミルクチョコレートのような香りに、スペアミント感の無い純粋な清涼感が乗る。hookah-reviews.comでは71点で「ミニマルだが過不足なくチョコミントらしくまとめてくる」と評された。香りの持ちはやや短いが、どう作っても扱いやすい。',
  'al-fakher:cinnamon':
    'やや薄味めのシナモンの香りに、乾いた厚紙のような土臭さが奥に感じられるのが特徴。hookah-reviews.comでは74点で「まずまずの再現度」と評され、陶器のPhunnel系ボウルで作ると再現度が高まるとされる。煙はウェットでスムーズ、高温にも耐えるので火の調節は容易。',
  'al-fakher:citrus mint':
    'やや強めのミントの清涼感に、オレンジ2対レモン1ほどの配分のシトラスが重なるスッキリした甘い香り。hookah-reviews.comでは80点で「Al Fakherらしい手堅い作りで、無難かつ良く出来ている」と評された。煙にボリュームがあり吸いごたえは良いが、香りの持ちはやや短め。',
  'al-fakher:citrus with mint':
    'やや強めのミントの清涼感に、オレンジ2対レモン1ほどの配分のシトラスが重なるスッキリした甘い香り。hookah-reviews.comでは80点で「Al Fakherらしい手堅い作りで、無難かつ良く出来ている」と評された。煙にボリュームがあり吸いごたえは良いが、香りの持ちはやや短め。',
  'al-fakher:cocktail':
    'プラム系を主体に、リコリス感のないアップルと後味のココナッツがほのかに重なるマッタリしたフルーツミックス。hookah-reviews.comでは73点で「なかなか練られたMix」と評された。煙はややきめ細かくAl Fakherらしい吸いごたえもあり、火の調節も容易。',
  'al-fakher:coconut':
    'マッタリと甘いココナッツが主役で、香りの輪郭が程よくボヤけているためクドさがないのが特徴。hookah-reviews.comでは67点で「強すぎる主張やクドさが無い」と評された。香りの持ちは平均より良く、火の調節も容易。',
  'al-fakher:cola':
    'コーラ味のラムネやガムのような香りだが、炭酸を狙ったのか酸味のようなテイストが強すぎ、コーラらしさの焦点が外れている。hookah-reviews.comでは50点で「香りや煙の質、安定感など、どれをとってもイマイチ」と評された。火が強いと酸味が出すぎるため火加減に気を使う。',
  'al-fakher:energy drink':
    'Al Fakherには珍しいケミカルな甘い香りが主体で、そこに水々しさや酸味を思わせるサッパリしたテイストが微かに混じる。hookah-reviews.comでは55点で「ケミカルさの突き抜け方が足りず、中途半端な感がある」と評された。香りの持ちは長く、扱いやすさは良好。',
  'al-fakher:golden al fakher shisha molasses bahraini':
    'Al FakherのAppleらしい赤リンゴ感と、Double Apple系のリコリスの甘さが中間で同居した香り。リコリスはTwo Appleの1/3〜1/2程度と控えめで軽やか、煙はボリュームがあり香りの持ちも平均より長い。hookah-reviews.comのGoldenライン版レビューでは78点で「Al FakherのTwo AppleとAppleの中間のような香り」と評された。',
  'al-fakher:golden al fakher shisha molasses golden iskandarani':
    '無果汁の青リンゴ味ゼリーを半分に薄めたような、薄味で輪郭のボンヤリしたGreen Apple系。煙のボリュームと吸いごたえは及第点だが香りの持ちは平均より短く、片手間に吸う向き。hookah-reviews.comのGoldenライン版レビューでは68点で「サッパリした何かのフルーツの香り、香りの輪郭がボヤけ気味」と評された。',
  'al-fakher:golden al fakher shisha molasses grape':
    '実物のブドウというよりシーシャのグレープそのもので、強い甘さと吐き終わりの少々の酸味や渋みが特徴。hookah-reviews.comでは74点で「どこの国に行っても必ず見かける定番の1つ」と評された。火が強すぎるとエグみが出て崩れるため、やや弱めの火加減が良い。',
  'al-fakher:golden al fakher shisha molasses strawberry':
    '少々の青味とCream系に似たテイストが特徴のストロベリーで、イチゴミルク飴のような丸い甘さがある。香りの輪郭はややボヤけ気味だが、煙はウェットで吸いやすくAl Fakherらしい満足感がある。hookah-reviews.comでは74点で「再現度は高くないが、これはこれでアリ」と評された。',
  'al-fakher:grape':
    '実物のブドウというよりシーシャのグレープそのもので、強い甘さと吐き終わりの少々の酸味や渋みが特徴。hookah-reviews.comでは74点で「どこの国に行っても必ず見かける定番の1つ」と評された。火が強すぎるとエグみが出て崩れるため、やや弱めの火加減が良い。',
  'al-fakher:grape berry':
    'Al FakherのGrapeが6〜7にブラックベリー系が3〜4ほどの配合で、序盤はグレープが強く、時間とともにベリーの香りが出てくる。hookah-reviews.comでは72点で「Al Fakherらしい手堅い作り」と評された。煙はボリュームがあり、火の調節も容易。',
  'al-fakher:grape fruit':
    'ややまろやかなビターさと酸味が主役で、甘さ控えめのスッキリまとまったグレープフルーツ。hookah-reviews.comでは73点で「シンプルかつストレートな作りで、Al Fakherらしさが良く出ている」と評された。シトラス系らしくノドに障る感じはあるが、香りの持ちと安定感は良い。',
  'al-fakher:grape mint':
    'Al FakherのGrapeとMintを1対1ほどで混ぜた香りで、ミントのグリーンな清涼感が甘さと酸味・渋みを抑えている。hookah-reviews.comでは76点で「別々に買って自分で混ぜた方が、用途が広い」と評された。火が強すぎると崩れるので弱めの火加減が良い。',
  'al-fakher:grape with berry':
    'Al FakherのGrapeが6〜7にブラックベリー系が3〜4ほどの配合で、序盤はグレープが強く、時間とともにベリーの香りが出てくる。hookah-reviews.comでは72点で「Al Fakherらしい手堅い作り」と評された。煙はボリュームがあり、火の調節も容易。',
  'al-fakher:grape with cream':
    'Al FakherのGrapeにファジーで優しいクリームのテイストが重なり、酸味が抑えられて吸いやすい。中盤からクリームが前に出てノド越しもシルキーに変わる。hookah-reviews.comでは76点で「決して不味くはない」ものの、Mint with Creamなどと比べると少しパッとしないと評された。',
  'al-fakher:grape with mint':
    'Al FakherのGrapeとMintを1対1ほどで混ぜた香りで、ミントのグリーンな清涼感が甘さと酸味・渋みを抑えている。hookah-reviews.comでは76点で「別々に買って自分で混ぜた方が、用途が広い」と評された。火が強すぎると崩れるので弱めの火加減が良い。',
  'al-fakher:grapefruit':
    'ややまろやかなビターさと酸味が主役で、甘さ控えめのスッキリまとまったグレープフルーツ。hookah-reviews.comでは73点で「シンプルかつストレートな作りで、Al Fakherらしさが良く出ている」と評された。シトラス系らしくノドに障る感じはあるが、香りの持ちと安定感は良い。',
  'al-fakher:grapefruit with mint':
    'Al FakherのGrapefruitとMintを2対1ほどで混ぜた香りで、ビターさと渋みを残しつつ清涼感で角が取れている。hookah-reviews.comでは76点で「そこそこ再現度が高い。地味に良く出来ている」と評された。香りの持ちは一定で、火の調節も難しくない。',
  'al-fakher:grenadine':
    '酸味のあるラズベリー系にブラックグレープ系を少し加えたような、サッパリしたベリー寄りの香り。hookah-reviews.comでは73点で「割と好みの香り」と評されたが、実物のザクロらしさという点では再現度は高くない。少々の酸味で吸いごたえにボディがある。',
  'al-fakher:guava':
    'グァバらしい青臭さのあるサッパリとしたフルーツの香り。吸い心地は水々しくスムーズながら煙にはAl Fakherらしいボディがあり、火の調節も容易。hookah-reviews.comでは77点で「やや好き嫌いは分かれそうだが、Guava系特有のテイストが無いと他のフルーツ系との差別化が難しい」と評された。',
  'al-fakher:gum':
    '歯磨き粉、もしくはキシリトールガムのような香り。濃いめのスペアミント系に人工的で厚みのある甘さが混じり、微かな清涼感も伴う。hookah-reviews.comでは61点で「万人受けする香りではなくミックスにも使いづらいが、たまに吸うと美味しい」と評された。',
  'al-fakher:gum cinnamon':
    'Al FakherのGumとCinnamonを4対1ほどで合わせた香りで、ほんのりしたシナモンの甘さが歯磨き粉っぽいクセを上手くカバーしている。清涼感はMintの半分ほど。hookah-reviews.comでは61点で「手放しにはオススメしにくいが、ミックスのチョイスと割合は絶妙」と評された。',
  'al-fakher:gum mastic':
    '松ヤニなど針葉樹の樹脂を薄めたような香りが主体で、スッキリしつつも甘さとクセが強く、ミント系の清涼感は無い。火の調節は容易で安定感は良好。hookah-reviews.comでは55点で「万人受けはしないが、クセのあるスッキリした香りが好きなら試す価値は少なくない」と評された。',
  'al-fakher:gum mint':
    'Al FakherのMintとGumを2対1ほどで合わせた香りで、歯磨き粉っぽさが薄れてスペアミント系に近い仕上がり。清涼感はMintの3分の1から半分ほど。hookah-reviews.comでは68点で「Gum単体よりボディとクセが控えめで吸いやすい」と評された。',
  'al-fakher:gum with cinnamon':
    'Al FakherのGumとCinnamonを4対1ほどで合わせた香りで、ほんのりしたシナモンの甘さが歯磨き粉っぽいクセを上手くカバーしている。清涼感はMintの半分ほど。hookah-reviews.comでは61点で「手放しにはオススメしにくいが、ミックスのチョイスと割合は絶妙」と評された。',
  'al-fakher:gum with mint':
    'Al FakherのMintとGumを2対1ほどで合わせた香りで、歯磨き粉っぽさが薄れてスペアミント系に近い仕上がり。清涼感はMintの3分の1から半分ほど。hookah-reviews.comでは68点で「Gum単体よりボディとクセが控えめで吸いやすい」と評された。',
  'al-fakher:honey':
    'マッタリした甘さにジャスミンを思わせるフローラルな香りが少し混じるが、ハチミツとしての再現度は高くなく、弱めの火加減の維持が無難。hookah-reviews.comでは74点で「単体では分かりにくいが、ミックスにすると汎用性は高い」と評され、レモン系やブルーベリー系、クリーム系との相性が良いとされる。',
  'al-fakher:jasmine':
    '薄っすらとした華やぎと少しの甘さがあり、メインは中国茶を思わせる香り。ただし肝心のジャスミンの花の香りは薄く、序盤は煙がドライでノドに障る。hookah-reviews.comでは55点で「クドさは無いので、中国茶っぽい香りをスッキリ楽しみたいなら試してみても良い」と評された。',
  'al-fakher:kiwi':
    '酸味のようなテイストは無く、サッパリした甘さの緑色のキウイを思わせる香り。香りの出来は良いが煙の質はAl Fakherの平均に劣り、序盤はノドに障る。hookah-reviews.comでは65点で「煙の質に目をつぶれるなら、入手性とコストから試しても良い」と評された。',
  'al-fakher:lemon':
    'ビターさは控えめで酸味のようなテイストが強い、ガッシリとしたクラシックなレモンの香り。煙はドライで粗さが目立ち、ノド越しはハード。hookah-reviews.comでは71点で「ややノド越しがハードで吸いごたえが強く、ガッシリしたLemon系が好きな人向け」と評された。',
  'al-fakher:lemon mint':
    'Al FakherのLemonとMintを1対1ほどで合わせた香りで、酸味のあるレモンにやや弱めの清涼感が重なる。その清涼感がノドへのハードな当たりを和らげ、吸いやすい。hookah-reviews.comでは76点で「カドを落としつつ吸いごたえを残したバランスが絶妙」と評された。',
  'al-fakher:lemon with mint':
    'Al FakherのLemonとMintを1対1ほどで合わせた香りで、酸味のあるレモンにやや弱めの清涼感が重なる。その清涼感がノドへのハードな当たりを和らげ、吸いやすい。hookah-reviews.comでは76点で「カドを落としつつ吸いごたえを残したバランスが絶妙」と評された。',
  'al-fakher:licorice':
    '薬っぽさのあるマッタリした甘い香りだが、Licorice系特有のキレ感は控えめで全体に穏やか。香りの輪郭はややボンヤリしており、煙は可もなく不可もないAl Fakherの平均。hookah-reviews.comでは55点で「控えめでクセの少ないLicorice系なら試す価値はある」と評された。',
  'al-fakher:mango':
    'トロピカルフルーツらしいマッタリした甘さと少々の酸味に、余韻でマンゴーの外皮のようなワックスっぽさが出る香り。煙はややウェットで吸いやすいが、火加減は気持ち弱めが無難。hookah-reviews.comでは73点で「Mango系の1つの典型。フィリピンマンゴーと思えば、再現度は割と高い」と評された。',
  'al-fakher:melon':
    '青臭さとウリ臭さが際立つクラシックなメロンの香りで、弱めの火加減を維持するとマスクメロンの中心部のような香りが出る。火の調節はやや難しい。hookah-reviews.comでは80点で「アクの強さはあるが再現度が非常に高く、試す価値は非常に大きい」と評された。',
  'al-fakher:mint':
    'ホンノリした甘さと、後味に少しビターなグリーンさが残るミント。清涼感は強すぎず弱すぎず穏やかで、煙はAl Fakherらしい満足感のある吸いごたえだが、火加減が強すぎると変な酸味が出る。hookah-reviews.comでは95点で「色々なMint系の原型。シンプルながら飽きのこない味わい」と評された。',
  'al-fakher:mint cream':
    'クリームらしいソフトな甘い香りにミントの清涼感を重ねた一本で、清涼感はAl Fakher Mintの1/3〜1/2程度と穏やか。煙はウェットでボリュームがあり、調節も難しくない。hookah-reviews.comでは85点で「Al Fakherから出ているCream系の中で、間違いなく一番のアタリ」と評された。',
  'al-fakher:mint with cream':
    'クリームらしいソフトな甘い香りにミントの清涼感を重ねた一本で、清涼感はAl Fakher Mintの1/3〜1/2程度と穏やか。煙はウェットでボリュームがあり、調節も難しくない。hookah-reviews.comでは85点で「Al Fakherから出ているCream系の中で、間違いなく一番のアタリ」と評された。',
  'al-fakher:mojito':
    '爽やかな甘さのライムの香りに割と強めのミントの清涼感が乗り、スッキリしたライムらしい余韻が鼻を抜ける。煙はボリュームがあり、最初にシッカリ蒸らせばノドに障る感じもほとんど無い。hookah-reviews.comでは85点で「スッキリした香りが好きならば、非常にオススメ」と評された。',
  'al-fakher:orange':
    'よく日を浴びたオレンジのようなシッカリした酸味と、吐き終わりに皮目のようなビターさが残るクラシックなシトラス。陶器のPhunnel系ならシャープに、シリコンボウルとKaloud Lotusなら穏やかにと、ボウル次第で表情が変わる。hookah-reviews.comでは78点で「定番であり、かつ1つの完成形」と評された。',
  'al-fakher:orange cream':
    'オレンジの爽やかな甘い香りに、Cream系のマイルドなノド越しとバニラっぽいソフトな甘さが重なり一体感がある。弱めの火加減の方がクリームらしさが出て、シトラス系としては非常にスムーズな煙。hookah-reviews.comでは78点で「ミニマルではあるが、そのぶん露骨なケミカルさや角が無い」と評された。',
  'al-fakher:orange mint':
    'Al FakherのOrangeとMintを2対1で混ぜたような香りで、酸味の強いクラシックなオレンジに1/3ほどの清涼感が乗る。ミントで薄まる分、シトラス特有のノドへの当たりは控えめ。hookah-reviews.comでは69点で「マズくは無いが、これじゃなきゃダメという理由も無い」と評された。',
  'al-fakher:orange with cream':
    'オレンジの爽やかな甘い香りに、Cream系のマイルドなノド越しとバニラっぽいソフトな甘さが重なり一体感がある。弱めの火加減の方がクリームらしさが出て、シトラス系としては非常にスムーズな煙。hookah-reviews.comでは78点で「ミニマルではあるが、そのぶん露骨なケミカルさや角が無い」と評された。',
  'al-fakher:orange with mint':
    'Al FakherのOrangeとMintを2対1で混ぜたような香りで、酸味の強いクラシックなオレンジに1/3ほどの清涼感が乗る。ミントで薄まる分、シトラス特有のノドへの当たりは控えめ。hookah-reviews.comでは69点で「マズくは無いが、これじゃなきゃダメという理由も無い」と評された。',
  'al-fakher:peach':
    '誰もがピーチと納得するハッキリした香りで、白桃よりも微かな酸味と歯ごたえのある黄桃寄り。抑揚の無いマッタリした甘さでクドさを感じにくく、甘さの割に煙はスムーズで火の調節も容易。hookah-reviews.comでは81点で「シーシャのPeach系として王道の香り。老舗の実力を感じる」と評された。',
  'al-fakher:pineapple':
    '実物のパイナップルとパイン飴の中間ぐらいの香りで、吐き終わりに微かな酸味がノドで感じられる。火が強すぎるとノドに障るため火加減には少し気を使うが、香りの輪郭がハッキリしておりミックスにも使いやすい。hookah-reviews.comでは77点で「目立った欠点など無く平均点以上にまとまっている」と評された。',
  'al-fakher:plum':
    '中東の会社らしいPeach系に近いマッタリした甘さがメインで、吐き終わりに種の近くのような微かな青臭さが差す。酸味はほとんど無く煙はソリッドで吸いごたえが良いが、火加減が強すぎると焦げて酸味が出る。hookah-reviews.comでは78点で「微かな青臭さによる少しのアクセントで、クドく感じにくくてよかった」と評された。',
  'al-fakher:rose':
    'バラの精油のようなマッタリした濃い口の香りが非常にハッキリと出て、吐き終わりにLemon系に似たキレが少し入る。香りの持ちは長めで高温にも比較的強く、扱いやすい。hookah-reviews.comでは69点で「基本的には好きな人向けな香りではあるものの、何かと上手く隙間を埋めてくる出来」と評された。',
  'al-fakher:shisha molasses apple':
    'リコリスを含まないApple系で、吐く煙が鼻を抜ける薄味加減の甘さが実物のリンゴの果肉を思わせる。hookah-reviews.comでは77点で「確かにリンゴの果肉部分を彷彿とさせる香りで良く出来ている」と評された。火加減を強めると香りが崩れるため、やや弱めの火で吸うのが無難。',
  'al-fakher:shisha molasses apricot':
    'Al FakherのPeachの甘さを控えめにして微かな酸味を足したような香りに、クセの少ないフローラル系あるいはアマレットのようなアクセントが混じる。hookah-reviews.comでは71点で「Peach系やPlum系が好きな人の琴線には触れる」と評された。煙はノドに障らないボディで満足感がある。',
  'al-fakher:shisha molasses banana':
    '紙パックのバナナオレのようなお菓子っぽい香りで、Banana Montanaのような渋味が無くクセなく吸いやすい。hookah-reviews.comでは71点で「Banana系が好きであれば、試す価値は非常に大きい」と評された。煙の質はAl Fakher平均よりずっと良くきめ細かい。',
  'al-fakher:shisha molasses berry':
    'Al FakherのRaspberryとBlueberryを2対1ほどで混ぜた香りで、酸味と渋味のあるラズベリーにマッタリしたブルーベリーの甘さが軽やかさを添える。hookah-reviews.comでは76点で「ややガッシリしたRaspberry系が好きな人向け」と評された。弱めの火加減だとサッパリ出る。',
  'al-fakher:shisha molasses bubble gum':
    'どことなくバナナを思わせるケミカルな甘い香りで、序盤のみ白いすじのような渋味が舌の奥に残る。hookah-reviews.comでは45点と辛口で、「Al Fakherのファンがこういったケミカルな香りを求めているかと言われると、あんまり求めていない」と評された。煙の量と質は平均的。',
  'al-fakher:shisha molasses cappuccino':
    '甘さ控えめでビターさの強い、炭焼珈琲飴のようなコーヒーキャンディの香り。hookah-reviews.comでは60点で「ニオイ残りを除けば目立った欠点などは無く、ソツなくまとまっている」と評された。吸い口やホースへのニオイ残りは激しく、火の調節は容易。',
  'al-fakher:shisha molasses cardamom':
    '針葉樹の樹脂を薄めたような香りとレモンの皮のようなCitrus系の香りが軸で、余韻にショウガらしさが残る甘さ控えめのSpice系。hookah-reviews.comでは77点で「万人受けする香りでは無いので強くオススメはしないが、個人的には好き」と評された。火の調節は容易。',
  'al-fakher:shisha molasses cherry':
    'コクのある甘さと微かな酸味が特徴で、ダークチェリーで作った酸っぱめのジャムのような香り。アメリカ系にありがちなツンとしたケミカルさは非常に控えめ。hookah-reviews.comでは68点で「ツンとしたケミカルな感じの無いCherry系を探しているのであれば、試す価値は大きい」と評された。',
  'al-fakher:shisha molasses cherry with mint':
    'Al FakherのCherryとMintを1対1で混ぜた香りで、コクのある甘さと微かな酸味を、グリーンで少し渋いミントがサッパリと引き締める。hookah-reviews.comでは70点で「Cherry系の中では好きな方」と評された。清涼感のおかげでノド越しも良い。',
  'al-fakher:shisha molasses chocolate':
    '駄菓子のココアシガレットやハーシーズのキスチョコのような、粉乳っぽさのあるシンプルなチョコレートの香り。hookah-reviews.comでは65点で「ミニマルかつシンプルな香りながらチョコレートらしい香り」と評された。火加減が強いとビターさが出てノドに障る。',
  'al-fakher:shisha molasses chocolate with mint':
    'マイルドな甘さの強い外国のミルクチョコレートのような香りに、スペアミント感の無い純粋な清涼感が乗る。hookah-reviews.comでは71点で「ミニマルだが過不足なくチョコミントらしくまとめてくる」と評された。香りの持ちはやや短いが、どう作っても扱いやすい。',
  'al-fakher:shisha molasses cinnamon':
    'やや薄味めのシナモンの香りに、乾いた厚紙のような土臭さが奥に感じられるのが特徴。hookah-reviews.comでは74点で「まずまずの再現度」と評され、陶器のPhunnel系ボウルで作ると再現度が高まるとされる。煙はウェットでスムーズ、高温にも耐えるので火の調節は容易。',
  'al-fakher:shisha molasses citrus with mint':
    'やや強めのミントの清涼感に、オレンジ2対レモン1ほどの配分のシトラスが重なるスッキリした甘い香り。hookah-reviews.comでは80点で「Al Fakherらしい手堅い作りで、無難かつ良く出来ている」と評された。煙にボリュームがあり吸いごたえは良いが、香りの持ちはやや短め。',
  'al-fakher:shisha molasses cocktail':
    'プラム系を主体に、リコリス感のないアップルと後味のココナッツがほのかに重なるマッタリしたフルーツミックス。hookah-reviews.comでは73点で「なかなか練られたMix」と評された。煙はややきめ細かくAl Fakherらしい吸いごたえもあり、火の調節も容易。',
  'al-fakher:shisha molasses coconut':
    'マッタリと甘いココナッツが主役で、香りの輪郭が程よくボヤけているためクドさがないのが特徴。hookah-reviews.comでは67点で「強すぎる主張やクドさが無い」と評された。香りの持ちは平均より良く、火の調節も容易。',
  'al-fakher:shisha molasses cola':
    'コーラ味のラムネやガムのような香りだが、炭酸を狙ったのか酸味のようなテイストが強すぎ、コーラらしさの焦点が外れている。hookah-reviews.comでは50点で「香りや煙の質、安定感など、どれをとってもイマイチ」と評された。火が強いと酸味が出すぎるため火加減に気を使う。',
  'al-fakher:shisha molasses energy drink':
    'Al Fakherには珍しいケミカルな甘い香りが主体で、そこに水々しさや酸味を思わせるサッパリしたテイストが微かに混じる。hookah-reviews.comでは55点で「ケミカルさの突き抜け方が足りず、中途半端な感がある」と評された。香りの持ちは長く、扱いやすさは良好。',
  'al-fakher:shisha molasses grape':
    '実物のブドウというよりシーシャのグレープそのもので、強い甘さと吐き終わりの少々の酸味や渋みが特徴。hookah-reviews.comでは74点で「どこの国に行っても必ず見かける定番の1つ」と評された。火が強すぎるとエグみが出て崩れるため、やや弱めの火加減が良い。',
  'al-fakher:shisha molasses grape with berry':
    'Al FakherのGrapeが6〜7にブラックベリー系が3〜4ほどの配合で、序盤はグレープが強く、時間とともにベリーの香りが出てくる。hookah-reviews.comでは72点で「Al Fakherらしい手堅い作り」と評された。煙はボリュームがあり、火の調節も容易。',
  'al-fakher:shisha molasses grape with cream':
    'Al FakherのGrapeにファジーで優しいクリームのテイストが重なり、酸味が抑えられて吸いやすい。中盤からクリームが前に出てノド越しもシルキーに変わる。hookah-reviews.comでは76点で「決して不味くはない」ものの、Mint with Creamなどと比べると少しパッとしないと評された。',
  'al-fakher:shisha molasses grape with mint':
    'Al FakherのGrapeとMintを1対1ほどで混ぜた香りで、ミントのグリーンな清涼感が甘さと酸味・渋みを抑えている。hookah-reviews.comでは76点で「別々に買って自分で混ぜた方が、用途が広い」と評された。火が強すぎると崩れるので弱めの火加減が良い。',
  'al-fakher:shisha molasses grapefruit':
    'ややまろやかなビターさと酸味が主役で、甘さ控えめのスッキリまとまったグレープフルーツ。hookah-reviews.comでは73点で「シンプルかつストレートな作りで、Al Fakherらしさが良く出ている」と評された。シトラス系らしくノドに障る感じはあるが、香りの持ちと安定感は良い。',
  'al-fakher:shisha molasses grapefruit with mint':
    'Al FakherのGrapefruitとMintを2対1ほどで混ぜた香りで、ビターさと渋みを残しつつ清涼感で角が取れている。hookah-reviews.comでは76点で「そこそこ再現度が高い。地味に良く出来ている」と評された。香りの持ちは一定で、火の調節も難しくない。',
  'al-fakher:shisha molasses grenadine':
    '酸味のあるラズベリー系にブラックグレープ系を少し加えたような、サッパリしたベリー寄りの香り。hookah-reviews.comでは73点で「割と好みの香り」と評されたが、実物のザクロらしさという点では再現度は高くない。少々の酸味で吸いごたえにボディがある。',
  'al-fakher:shisha molasses guava':
    'グァバらしい青臭さのあるサッパリとしたフルーツの香り。吸い心地は水々しくスムーズながら煙にはAl Fakherらしいボディがあり、火の調節も容易。hookah-reviews.comでは77点で「やや好き嫌いは分かれそうだが、Guava系特有のテイストが無いと他のフルーツ系との差別化が難しい」と評された。',
  'al-fakher:shisha molasses gum':
    '歯磨き粉、もしくはキシリトールガムのような香り。濃いめのスペアミント系に人工的で厚みのある甘さが混じり、微かな清涼感も伴う。hookah-reviews.comでは61点で「万人受けする香りではなくミックスにも使いづらいが、たまに吸うと美味しい」と評された。',
  'al-fakher:shisha molasses gum with cinnamon':
    'Al FakherのGumとCinnamonを4対1ほどで合わせた香りで、ほんのりしたシナモンの甘さが歯磨き粉っぽいクセを上手くカバーしている。清涼感はMintの半分ほど。hookah-reviews.comでは61点で「手放しにはオススメしにくいが、ミックスのチョイスと割合は絶妙」と評された。',
  'al-fakher:shisha molasses honey':
    'マッタリした甘さにジャスミンを思わせるフローラルな香りが少し混じるが、ハチミツとしての再現度は高くなく、弱めの火加減の維持が無難。hookah-reviews.comでは74点で「単体では分かりにくいが、ミックスにすると汎用性は高い」と評され、レモン系やブルーベリー系、クリーム系との相性が良いとされる。',
  'al-fakher:shisha molasses jasmine':
    '薄っすらとした華やぎと少しの甘さがあり、メインは中国茶を思わせる香り。ただし肝心のジャスミンの花の香りは薄く、序盤は煙がドライでノドに障る。hookah-reviews.comでは55点で「クドさは無いので、中国茶っぽい香りをスッキリ楽しみたいなら試してみても良い」と評された。',
  'al-fakher:shisha molasses kiwi':
    '酸味のようなテイストは無く、サッパリした甘さの緑色のキウイを思わせる香り。香りの出来は良いが煙の質はAl Fakherの平均に劣り、序盤はノドに障る。hookah-reviews.comでは65点で「煙の質に目をつぶれるなら、入手性とコストから試しても良い」と評された。',
  'al-fakher:shisha molasses lemon':
    'ビターさは控えめで酸味のようなテイストが強い、ガッシリとしたクラシックなレモンの香り。煙はドライで粗さが目立ち、ノド越しはハード。hookah-reviews.comでは71点で「ややノド越しがハードで吸いごたえが強く、ガッシリしたLemon系が好きな人向け」と評された。',
  'al-fakher:shisha molasses lemon with mint':
    'Al FakherのLemonとMintを1対1ほどで合わせた香りで、酸味のあるレモンにやや弱めの清涼感が重なる。その清涼感がノドへのハードな当たりを和らげ、吸いやすい。hookah-reviews.comでは76点で「カドを落としつつ吸いごたえを残したバランスが絶妙」と評された。',
  'al-fakher:shisha molasses licorice':
    '薬っぽさのあるマッタリした甘い香りだが、Licorice系特有のキレ感は控えめで全体に穏やか。香りの輪郭はややボンヤリしており、煙は可もなく不可もないAl Fakherの平均。hookah-reviews.comでは55点で「控えめでクセの少ないLicorice系なら試す価値はある」と評された。',
  'al-fakher:shisha molasses mango':
    'トロピカルフルーツらしいマッタリした甘さと少々の酸味に、余韻でマンゴーの外皮のようなワックスっぽさが出る香り。煙はややウェットで吸いやすいが、火加減は気持ち弱めが無難。hookah-reviews.comでは73点で「Mango系の1つの典型。フィリピンマンゴーと思えば、再現度は割と高い」と評された。',
  'al-fakher:shisha molasses melon':
    '青臭さとウリ臭さが際立つクラシックなメロンの香りで、弱めの火加減を維持するとマスクメロンの中心部のような香りが出る。火の調節はやや難しい。hookah-reviews.comでは80点で「アクの強さはあるが再現度が非常に高く、試す価値は非常に大きい」と評された。',
  'al-fakher:shisha molasses mint':
    'ホンノリした甘さと、後味に少しビターなグリーンさが残るミント。清涼感は強すぎず弱すぎず穏やかで、煙はAl Fakherらしい満足感のある吸いごたえだが、火加減が強すぎると変な酸味が出る。hookah-reviews.comでは95点で「色々なMint系の原型。シンプルながら飽きのこない味わい」と評された。',
  'al-fakher:shisha molasses orange':
    'よく日を浴びたオレンジのようなシッカリした酸味と、吐き終わりに皮目のようなビターさが残るクラシックなシトラス。陶器のPhunnel系ならシャープに、シリコンボウルとKaloud Lotusなら穏やかにと、ボウル次第で表情が変わる。hookah-reviews.comでは78点で「定番であり、かつ1つの完成形」と評された。',
  'al-fakher:shisha molasses orange with cream':
    'オレンジの爽やかな甘い香りに、Cream系のマイルドなノド越しとバニラっぽいソフトな甘さが重なり一体感がある。弱めの火加減の方がクリームらしさが出て、シトラス系としては非常にスムーズな煙。hookah-reviews.comでは78点で「ミニマルではあるが、そのぶん露骨なケミカルさや角が無い」と評された。',
  'al-fakher:shisha molasses orange with mint':
    'Al FakherのOrangeとMintを2対1で混ぜたような香りで、酸味の強いクラシックなオレンジに1/3ほどの清涼感が乗る。ミントで薄まる分、シトラス特有のノドへの当たりは控えめ。hookah-reviews.comでは69点で「マズくは無いが、これじゃなきゃダメという理由も無い」と評された。',
  'al-fakher:shisha molasses peach':
    '誰もがピーチと納得するハッキリした香りで、白桃よりも微かな酸味と歯ごたえのある黄桃寄り。抑揚の無いマッタリした甘さでクドさを感じにくく、甘さの割に煙はスムーズで火の調節も容易。hookah-reviews.comでは81点で「シーシャのPeach系として王道の香り。老舗の実力を感じる」と評された。',
  'al-fakher:shisha molasses pineapple':
    '実物のパイナップルとパイン飴の中間ぐらいの香りで、吐き終わりに微かな酸味がノドで感じられる。火が強すぎるとノドに障るため火加減には少し気を使うが、香りの輪郭がハッキリしておりミックスにも使いやすい。hookah-reviews.comでは77点で「目立った欠点など無く平均点以上にまとまっている」と評された。',
  'al-fakher:shisha molasses plum':
    '中東の会社らしいPeach系に近いマッタリした甘さがメインで、吐き終わりに種の近くのような微かな青臭さが差す。酸味はほとんど無く煙はソリッドで吸いごたえが良いが、火加減が強すぎると焦げて酸味が出る。hookah-reviews.comでは78点で「微かな青臭さによる少しのアクセントで、クドく感じにくくてよかった」と評された。',
  'al-fakher:shisha molasses rose':
    'バラの精油のようなマッタリした濃い口の香りが非常にハッキリと出て、吐き終わりにLemon系に似たキレが少し入る。香りの持ちは長めで高温にも比較的強く、扱いやすい。hookah-reviews.comでは69点で「基本的には好きな人向けな香りではあるものの、何かと上手く隙間を埋めてくる出来」と評された。',
  'al-fakher:shisha molasses strawberry':
    '少々の青味とCream系に似たテイストが特徴のストロベリーで、イチゴミルク飴のような丸い甘さがある。香りの輪郭はややボヤけ気味だが、煙はウェットで吸いやすくAl Fakherらしい満足感がある。hookah-reviews.comでは74点で「再現度は高くないが、これはこれでアリ」と評された。',
  'al-fakher:shisha molasses strawberry with cream':
    'イチゴのヘタのような青味が少しあるクラシックなストロベリーに、バニラっぽいソフトなクリームが重なり可愛らしくまとまる。弱めの火加減の方がクリームが出て、なめらかなノド越しの煙。hookah-reviews.comでは70点で「一体感と完成度は高い」と評された。',
  'al-fakher:shisha molasses vanilla':
    '甘いバニラに漠然としたシーシャっぽい香りとマッタリしたクリーミィな甘さが乗り、バニラビーンズよりもお菓子のバニラクリームを思わせる。火加減が強すぎると渋味や酸味が出て崩れやすく、香りの持ちと安定感には不満が残る。hookah-reviews.comでは63点で「イメージのしやすさを求めるならこれを試すと良い」と評された。',
  'al-fakher:shisha molasses water melon':
    '疎でスカスカした感じのサッパリした甘さに、吐くときウリ科らしい青臭さが鼻を抜けるクラシックなWatermelon系。煙量はAl Fakherらしく良いが煙質はやや乾いてノドに障り、序盤は強めの火でしっかり蒸らすのがコツ。hookah-reviews.comでは76点で「クラシックなWatermelon系らしい、スカスカした感じのサッパリした甘さ」と評された。',
  'al-fakher:shisha molasses water melon with mint':
    'スイカにノドがヒンヤリする程度の清涼感が重なり、単体版よりウリらしい青臭さとサッパリ感が立つ定番のスイカミント。煙の量・質ともAl Fakherの平均で安定感も良いが、香りの持ちはやや短い。hookah-reviews.comでは77点で「定番のMixが、Al Fakherらしくクラシックな感じで上手くまとまっている」と評された。',
  'al-fakher:special edition hookah matata':
    '甘さより爽やかさが際立つスッキリしたグリーンアップルに、吐き終わりでパインの香りが少し重なるMix。微かな清涼感もあり煙質は良いが、火が強すぎると酸っぱいニオイが出て崩れるため弱めの火加減が要る。hookah-reviews.comでは79点で「今までに無かったグリーンアップル、美味」と評された。',
  'al-fakher:special edition hot ice':
    'Nakhlaに似たクラシックでミニマルなスイカに強い清涼感が乗り、余韻にカルダモンのような香りが残る攻めたMix。煙はウェットで辛さは無く、中盤からスパイス感が薄れて普通のスイカミントへ変化する。hookah-reviews.comでは77点で「スイカとミントとカルダモンのMix」と評された。',
  'al-fakher:special edition rich creme':
    'Al FakherのCream with Mintと同じ香料を使ったクリーム単体の香りで、クルミやアーモンドに似た微かな香ばしさがある。煙質は良いがストレートでは序盤ノドに障り、焦がすとリカバーが難しい。hookah-reviews.comでは72点で「クルミなどのナッツに似た香ばしさが少しある香り」と評された。',
  'al-fakher:special edition seven wings':
    'ブラックグレープのようなスッキリした爽やかさが主体のブルーミストで、少し強めの清涼感と微かな後味が全体を引き締める。煙質は平均以上で吸い心地が良く、炭が燃え尽きるまでしっかり香る。hookah-reviews.comでは78点で「スッキリしたBlue Mist系、美味」と評された。',
  'al-fakher:special edition sparkle':
    '皮のビターさや酸味が控えめで、微かにラムネのようなお菓子っぽさが漂う軽やかなLemon系。柑橘系としては煙がスムーズで安定感が高く、弱火ではスッキリ、強火では濃いめと火加減で香りを調節できる。hookah-reviews.comでは78点で「軽やかでスッキリしたLemon系」と評された。',
  'al-fakher:special edition sweet pomegranate':
    '他社のPomegranate系より実物のザクロに近い甘酸っぱさで、序盤の数分だけコーラに似た香りが出てから安定する。ボリュームがありながらウェットな煙で吸いごたえがあり、香りの持ちも平均より少し長い。hookah-reviews.comでは76点で「珍しく実物のザクロらしい香り」と評された。',
  'al-fakher:special edition virgine grape':
    'Al FakherのGrapeより酸味と甘さが控えめで、ボディのある今どきのWhite Grape系にまとまった一本。香りが濃いぶん持ちも良く、煙量は平均以上で焦げにくく安定感が高い。hookah-reviews.comでは83点で「新旧のGrape系の特徴が同居しており、非常に完成度が高い」と評された。',
  'al-fakher:special edition watermelon splash':
    'やや丸みのある甘さを程よい薄味でサッパリまとめたスイカに、ヒンヤリした純粋な清涼感が混じる定番のスイカミント。煙質は平均より良くノド越しがスムーズで、火の調節も容易で崩れにくい。hookah-reviews.comでは79点で「定番のスイカミントが高水準でリメイクされている」と評された。',
  'al-fakher:strawberry':
    '少々の青味とCream系に似たテイストが特徴のストロベリーで、イチゴミルク飴のような丸い甘さがある。香りの輪郭はややボヤけ気味だが、煙はウェットで吸いやすくAl Fakherらしい満足感がある。hookah-reviews.comでは74点で「再現度は高くないが、これはこれでアリ」と評された。',
  'al-fakher:strawberry cream':
    'イチゴのヘタのような青味が少しあるクラシックなストロベリーに、バニラっぽいソフトなクリームが重なり可愛らしくまとまる。弱めの火加減の方がクリームが出て、なめらかなノド越しの煙。hookah-reviews.comでは70点で「一体感と完成度は高い」と評された。',
  'al-fakher:strawberry with cream':
    'イチゴのヘタのような青味が少しあるクラシックなストロベリーに、バニラっぽいソフトなクリームが重なり可愛らしくまとまる。弱めの火加減の方がクリームが出て、なめらかなノド越しの煙。hookah-reviews.comでは70点で「一体感と完成度は高い」と評された。',
  'al-fakher:vanilla':
    '甘いバニラに漠然としたシーシャっぽい香りとマッタリしたクリーミィな甘さが乗り、バニラビーンズよりもお菓子のバニラクリームを思わせる。火加減が強すぎると渋味や酸味が出て崩れやすく、香りの持ちと安定感には不満が残る。hookah-reviews.comでは63点で「イメージのしやすさを求めるならこれを試すと良い」と評された。',
  'al-fakher:water melon':
    '疎でスカスカした感じのサッパリした甘さに、吐くときウリ科らしい青臭さが鼻を抜けるクラシックなWatermelon系。煙量はAl Fakherらしく良いが煙質はやや乾いてノドに障り、序盤は強めの火でしっかり蒸らすのがコツ。hookah-reviews.comでは76点で「クラシックなWatermelon系らしい、スカスカした感じのサッパリした甘さ」と評された。',
  'al-fakher:water melon with mint':
    'スイカにノドがヒンヤリする程度の清涼感が重なり、単体版よりウリらしい青臭さとサッパリ感が立つ定番のスイカミント。煙の量・質ともAl Fakherの平均で安定感も良いが、香りの持ちはやや短い。hookah-reviews.comでは77点で「定番のMixが、Al Fakherらしくクラシックな感じで上手くまとまっている」と評された。',
  'al-fakher:watermelon':
    '疎でスカスカした感じのサッパリした甘さに、吐くときウリ科らしい青臭さが鼻を抜けるクラシックなWatermelon系。煙量はAl Fakherらしく良いが煙質はやや乾いてノドに障り、序盤は強めの火でしっかり蒸らすのがコツ。hookah-reviews.comでは76点で「クラシックなWatermelon系らしい、スカスカした感じのサッパリした甘さ」と評された。',
  'al-fakher:watermelon with mint':
    'スイカにノドがヒンヤリする程度の清涼感が重なり、単体版よりウリらしい青臭さとサッパリ感が立つ定番のスイカミント。煙の量・質ともAl Fakherの平均で安定感も良いが、香りの持ちはやや短い。hookah-reviews.comでは77点で「定番のMixが、Al Fakherらしくクラシックな感じで上手くまとまっている」と評された。',
  // LaVoo — 日本語レビューブログ hookah-reviews.com (byダビデ) の各フレーバー記事を要約
  // (2026-09 時点)。財務省公告名の「Tobacco」はライン名ではなく商品名の一部で、
  // 記事側の通常ライン (Lavoo / <名前>) と 1 対 1 で対応する。
  // Heritage Reserve ラインは日本流通が無いため対象外。
  'lavoo:tobacco dark mint':
    'キリッと冷たいシャープな清涼感に、ダークリーフの香りが鼻へ抜けるやや甘めのミント。煙はウェットすぎず滑らかで安定感も良いが、清涼感が薄れるのは少し早い。hookah-reviews.comでは81点で「エグくない程度に土っぽいダークリーフの香りあれば、これを試す価値はある」と評された。',
  'lavoo:tobacco ice breaker':
    '強めのシャープな清涼感に、バナナ3対クローブ1ほどで重なる独特なミックス。バナナ系のエグ味をクローブとダークリーフがフォローする意欲的な作りだが、中盤以降は香りが混然一体となり判別しにくい。hookah-reviews.comでは70点で「他社に無い独特なMixであり少し人を選ぶ」と評された。',
  'lavoo:tobacco mean java':
    'バニラ系の香りが少し入った、やや甘めのコーヒー系。ミルク入りコーヒーキャンディのような香りで、Al Fakherなどの古典的なコーヒー系ほど焦げたビターさは強くなく、持ちは長いが火加減が強すぎると酸味が出る。hookah-reviews.comでは筆者がコーヒー系を苦手とするため60点で「甘めのCoffee系が好きであれば、試す価値はある」と評された。',
  'lavoo:tobacco mint citron':
    'シャープな清涼感と、甘めでソフトなレモンの香り。皮の酸味やビターさを押し出す古典的なレモン系と異なり優しい甘さが主体で、中盤からは丸みが出る。hookah-reviews.comでは76点で「クラシックなLemon系には無い穏やかさと、Lemon系らしい爽やかさが上手く両立されており」と評され、持ちはやや短いが安定感は良い。',
  'lavoo:tobacco russian tea':
    '誰もがアールグレイと納得する再現度で、煙を吐き終えた余韻は完全にベルガモット。甘さ控えめゆえ紅茶らしいキリッとした感じが活き煙の質も優秀だが、中盤終わりで紅茶感がピークアウトし持ちはやや短い。hookah-reviews.comでは85点で「Earl Grey系や紅茶系が好きであれば、間違いなく気に入るだろう」と評された。',
  'lavoo:tobacco southern peach':
    'キレのある今どきのホワイトピーチに、クドさのないジャスミン系のフローラルが重なるミックス。Al Fakher Special Editionの66に近い作りで、ダークリーフの香りが香りの尾を丸くまとめ、甘さの割に煙はスムーズで強めの火加減にも崩れにくい。hookah-reviews.comでは75点で「上手くまとまっている」と評された。',
  'lavoo:tobacco tropicali':
    'ライム2〜3対ココナッツ1ほどの比率のミックスで、シロップ的でない確かなライムの爽やかさが持ち味。控えめなココナッツとダークリーフが香りの角を丸くし、持ちも安定感も良く高熱にも耐える。hookah-reviews.comでは79点で「ダークリーフの香りのおかげでケミカルさが抑えられており、良く出来ている」と評された。',
  'lavoo:tobacco viceroy chai':
    'シナモン主体の甘めのチャイで、ダークリーフ由来のビターなキャラメルに似た香ばしい甘さが乗る。FumariのSpiced Chaiに似るがより奥行きがあり渋好みで、蒸らしすぎや強めの火加減だと気管支に障りやすい。hookah-reviews.comでは75点で「実際は甲乙つけがたい出来」と評された。',
  // Bang Bang — 日本の小売 (NEWEMO SHISHA) の商品説明を要約 (2026-09 時点)。
  // 財務省公告には「Bang Bang」と「BangBang」の 2 通りの登録があり、同一銘柄は
  // 同じ商品ページを出典として説明を共有する。
  // 本文が銘柄名のカタカナ表記のみの銘柄は未記載。
  'bang-bang:biscuits':
    '有名ビスケットを再現したという焼き菓子系のフレーバー。甘さ、粉っぽさ、ビスケットらしい風味を併せ持つとされる。',
  'bang-bang:blue guava':
    '甘みを備えたブルーグァバのフレーバー。グァバとしては珍しく甘さが乗るタイプで、販売元の説明では万人受けしやすい味わいとされる。',
  'bang-bang:cinnamon gum':
    'シナモン風味のガム系フレーバー。単品でも十分に成立し、ミックスでは単純にシナモンとして使うこともできる。以前から知られた銘柄とされる。',
  'bang-bang:double apple':
    '二種のリンゴを合わせたダブルアップル。えぐみが出にくく甘さがあり、吸いやすい仕上がりとされる。',
  'bang-bang:gum':
    'キシリトールガム系のフレーバーで、爽快感の奥に甘みも感じられる。ミントやアイス以外で清涼感を出したいときの選択肢で、ミックスにも使いやすいとされる。',
  'bang-bang:ice green apple':
    'グリーンアップルにアイスを効かせたフレーバー。火入れの加減次第で甘いグリーンアップルにも、さっぱりとしたグリーンアップルにも振れるとされる。',
  'bang-bang:ice mint':
    '清涼感がありながら、ミント自体の旨味と甘味もしっかり感じられるアイスミント。強めのミントを求める場合の選択肢とされる。',
  'bang-bang:ice plum':
    'プラムの果実味を主体としたフレーバー。名称にアイスと付くが、販売元の説明では清涼感はほとんど無いとされる。',
  'bang-bang:love':
    '中東で定番とされるLove系のミックスフレーバー。あらかじめ複数の味が混ぜ合わされており、単体でも組み合わせずに楽しめる。',
  'bang-bang:mestika gum':
    '木の樹液を乾燥させたマスティック (ミスティカ) を写したガム系フレーバー。販売元の説明では、日本でミントガムを口直しに噛むように、中東ではこのマスティックが普段から噛まれるとされる。',
  'bang-bang:milk':
    '冷たい牛乳を思わせるミルクフレーバーで、甘さはほどよい水準に抑えられている。',
  'bang-bang:mint':
    '清涼感と甘みを両立させたミント。すっきりした冷たさの中に甘さが残る、ミント好き向けの一本とされる。',
  'bang-bang:pomegranate':
    'ザクロの果実味を前面に出したフレーバー。販売元の説明では、小豆を思わせるニュアンスが感じられる温度帯が理想とされる。',
  'bang-bang:red power':
    'エナジードリンク系のフレーバー。販売元の説明では、レッドブルの味わいを再現したものとされる。',
  'bang-bang:vanilla':
    'バニラのフレーバー。販売元の説明では、茶色い濃厚さとシガーのような香ばしさを備え、ハーゲンダッツのバニラアイスに例えられる味わいとされる。',
  'bang-bang:watermelon':
    'スイカのフレーバーで、瓜っぽさは控えめ。甘み主体で吸いやすい仕上がりとされる。',
  'bangbang:blue guava':
    '甘みも感じられる珍しいグァバのフレーバー。ブランドの代名詞とも言える一作とされ、万人受けする味わいと説明される。',
  'bangbang:double apple':
    '正統派のダブルアップル。えぐみが出にくく、甘さがあって吸いやすい仕上がりとされる。',
  'bangbang:gum':
    'キシリトールガムを思わせるガムのフレーバー。爽快感が高く奥に甘みも感じられ、ミントやアイス以外の清涼系としてミックスにも使いやすいとされる。',
  'bangbang:mint':
    '清涼感と甘みを両立させたミント。すっきりした冷たさの中に甘さが残る、ミント好き向けの一本とされる。',
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
