/**
 * 商品名からフレーバータグを推定するルールエンジン。
 *
 * 判定の流れ:
 *   1. 商品名を正規化 (ブランドプレフィックス除去 / NFKC / ダイアクリティクス除去 /
 *      小文字化 / 記号→スペース)
 *   2. data/flavorTagOverrides.ts に正規化キーが載っていればそれを採用
 *      (辞書で判定できない固有名 "Love 66" 等のAI分類結果。辞書より優先)
 *   3. キーワード辞書を「長いパターン優先」でマッチし、マッチ部分を消費しながら
 *      タグを集める。"cherry blossom" が floral として消費されれば cherry (fruit)
 *      には落ちない、という挙動のための消費方式。
 *
 * 英字パターンは単語境界付き ("grape" が "grapefruit" に誤マッチしない)、
 * カタカナ/漢字パターンは境界なしの部分一致 (長い順の消費で「さくらんぼ」→「さくら」
 * の誤爆を防ぐ)。
 *
 * 純粋な文字列処理のみで fs 依存なし。実行はビルド時 (scripts/build-data.ts) が主。
 */
import { FLAVOR_TAG_OVERRIDES } from '../../data/flavorTagOverrides'
import type { FlavorTagSlug } from '../../data/flavorTagTaxonomy'

type Rule = [pattern: string, tags: FlavorTagSlug[]]

// biome-ignore format: 1行1ルールのほうが差分レビューしやすい
const KEYWORD_RULES: Rule[] = [
  // ---- 複合語 (専用タグへ倒すため、構成語より先に消費させる) ----
  ['cherry blossom', ['floral']],
  ['orange blossom', ['floral']],
  ['ice cream', ['cream', 'dessert']],
  ['icecream', ['cream', 'dessert']],
  ['ginger ale', ['drink', 'spice']],
  ['ginger beer', ['drink', 'spice']],
  ['pina colada', ['tropical', 'drink']],
  ['pinacolada', ['tropical', 'drink']],
  ['colada', ['tropical', 'drink']],
  ['passion fruit', ['tropical']],
  ['dragon fruit', ['tropical']],
  ['star fruit', ['tropical']],
  ['grape fruit', ['citrus']],
  ['earl grey', ['tea']],
  ['green tea', ['tea']],
  ['milk tea', ['tea', 'cream']],
  ['pan masala', ['spice']],
  ['pan rasna', ['spice']],
  ['energy drink', ['drink']],
  ['bubble gum', ['dessert']],
  ['cotton candy', ['dessert']],
  ['creme brulee', ['cream', 'dessert']],
  ['condensed milk', ['cream']],
  ['maple syrup', ['dessert']],
  ['sex on the beach', ['drink']],
  ['mai tai', ['drink']],
  ['moscow mule', ['drink']],
  ['dulce de leche', ['cream', 'dessert']],
  ['cheese cake', ['dessert']],
  ['gummy bear', ['dessert']],
  ['gummi bear', ['dessert']],
  ['absolute zero', ['ice']],
  ['tutti frutti', ['fruit']],
  ['tuttifrutti', ['fruit']],
  ['red bull', ['drink']],
  ['redbull', ['drink']],
  ['irish cream', ['drink', 'cream']],

  // ---- 柑橘 ----
  ['lemon', ['citrus']],
  ['lime', ['citrus']],
  ['orange', ['citrus']],
  ['grapefruit', ['citrus']],
  ['mandarin', ['citrus']],
  ['tangerine', ['citrus']],
  ['clementine', ['citrus']],
  ['calamansi', ['citrus']],
  ['kumquat', ['citrus']],
  ['pomelo', ['citrus']],
  ['yuzu', ['citrus']],
  ['citrus', ['citrus']],
  ['citron', ['citrus']],
  ['bergamot', ['citrus', 'tea']],
  ['lemonade', ['citrus', 'drink']],
  ['limoncello', ['citrus', 'drink']],
  ['tangelo', ['citrus']],
  ['lemongrass', ['citrus', 'spice']],
  ['marmalade', ['citrus', 'dessert']],
  ['caipirinha', ['citrus', 'drink']],
  ['レモン', ['citrus']],
  ['ライム', ['citrus']],
  ['オレンジ', ['citrus']],
  ['シトラス', ['citrus']],
  ['ゆず', ['citrus']],
  ['柚子', ['citrus']],

  // ---- アップル ----
  ['apple', ['apple']],
  ['apples', ['apple']],
  ['apfel', ['apple']],
  ['アップル', ['apple']],
  ['りんご', ['apple']],
  ['リンゴ', ['apple']],
  ['林檎', ['apple']],

  // ---- グレープ ----
  ['grape', ['grape']],
  ['grapes', ['grape']],
  ['グレープ', ['grape']],
  ['ぶどう', ['grape']],
  ['ブドウ', ['grape']],
  ['葡萄', ['grape']],
  ['巨峰', ['grape']],
  ['マスカット', ['grape']],
  ['muscat', ['grape']],

  // ---- ベリー ----
  ['strawberry', ['berry']],
  ['strawberries', ['berry']],
  ['blueberry', ['berry']],
  ['blueberries', ['berry']],
  ['raspberry', ['berry']],
  ['blackberry', ['berry']],
  ['cranberry', ['berry']],
  ['mulberry', ['berry']],
  ['gooseberry', ['berry']],
  ['wildberry', ['berry']],
  ['wildberries', ['berry']],
  ['berry', ['berry']],
  ['berries', ['berry']],
  ['currant', ['berry']],
  ['blackcurrant', ['berry']],
  ['cassis', ['berry']],
  ['acai', ['berry']],
  ['イチゴ', ['berry']],
  ['いちご', ['berry']],
  ['苺', ['berry']],
  ['ストロベリー', ['berry']],
  ['ブルーベリー', ['berry']],
  ['ラズベリー', ['berry']],
  ['カシス', ['berry']],
  ['ベリー', ['berry']],

  // ---- ピーチ ----
  ['peach', ['peach']],
  ['peaches', ['peach']],
  ['nectarine', ['peach']],
  ['ピーチ', ['peach']],
  ['もも', ['peach']],
  ['モモ', ['peach']],
  ['桃', ['peach']],

  // ---- メロン・スイカ ----
  ['melon', ['melon']],
  ['watermelon', ['melon']],
  ['cantaloupe', ['melon']],
  ['honeydew', ['melon']],
  ['メロン', ['melon']],
  ['スイカ', ['melon']],
  ['すいか', ['melon']],
  ['西瓜', ['melon']],

  // ---- トロピカル ----
  ['mango', ['tropical']],
  ['pineapple', ['tropical']],
  ['coconut', ['tropical']],
  ['passion', ['tropical']],
  ['passionfruit', ['tropical']],
  ['maracuja', ['tropical']],
  ['guava', ['tropical']],
  ['lychee', ['tropical']],
  ['litchi', ['tropical']],
  ['papaya', ['tropical']],
  ['banana', ['tropical']],
  ['dragonfruit', ['tropical']],
  ['kiwi', ['tropical']],
  ['mangosteen', ['tropical']],
  ['tropical', ['tropical']],
  ['tropic', ['tropical']],
  ['マンゴー', ['tropical']],
  ['パイナップル', ['tropical']],
  ['パイン', ['tropical']],
  ['ココナッツ', ['tropical']],
  ['パッション', ['tropical']],
  ['ライチ', ['tropical']],
  ['バナナ', ['tropical']],
  ['グアバ', ['tropical']],
  ['パパイヤ', ['tropical']],
  ['トロピカル', ['tropical']],

  // ---- フルーツその他 ----
  ['pear', ['fruit']],
  ['cherry', ['fruit']],
  ['cherries', ['fruit']],
  ['plum', ['fruit']],
  ['apricot', ['fruit']],
  ['pomegranate', ['fruit']],
  ['fig', ['fruit']],
  ['figs', ['fruit']],
  ['quince', ['fruit']],
  ['persimmon', ['fruit']],
  ['rhubarb', ['fruit']],
  ['raisin', ['fruit']],
  ['prune', ['fruit']],
  ['cactus', ['fruit']],
  ['aloe', ['fruit']],
  ['grenadine', ['fruit', 'drink']],
  ['fruit', ['fruit']],
  ['fruits', ['fruit']],
  ['チェリー', ['fruit']],
  ['さくらんぼ', ['fruit']],
  ['アプリコット', ['fruit']],
  ['プルーン', ['fruit']],
  ['梨', ['fruit']],
  ['洋梨', ['fruit']],
  ['ザクロ', ['fruit']],
  ['いちじく', ['fruit']],
  ['フルーツ', ['fruit']],

  // ---- ミント ----
  ['mint', ['mint']],
  ['mints', ['mint']],
  ['peppermint', ['mint']],
  ['spearmint', ['mint']],
  ['doublemint', ['mint']],
  ['menthol', ['mint']],
  ['chocomint', ['mint', 'dessert']],
  ['cinnamint', ['mint', 'spice']],
  ['ミント', ['mint']],
  ['ハッカ', ['mint']],
  ['薄荷', ['mint']],

  // ---- アイス・清涼 ----
  ['ice', ['ice']],
  ['iced', ['ice']],
  ['icy', ['ice']],
  ['frozen', ['ice']],
  ['freeze', ['ice']],
  ['frost', ['ice']],
  ['frosty', ['ice']],
  ['chill', ['ice']],
  ['chilled', ['ice']],
  ['cool', ['ice']],
  ['arctic', ['ice']],
  ['polar', ['ice']],
  ['blizzard', ['ice']],
  ['glacier', ['ice']],
  ['winter', ['ice']],
  ['fresh', ['ice']],
  ['アイス', ['ice']],
  ['クール', ['ice']],

  // ---- クリーム・バニラ ----
  ['cream', ['cream']],
  ['creme', ['cream']],
  ['creamy', ['cream']],
  ['milk', ['cream']],
  ['milky', ['cream']],
  ['vanilla', ['cream']],
  ['yogurt', ['cream']],
  ['yoghurt', ['cream']],
  ['custard', ['cream', 'dessert']],
  ['pudding', ['cream', 'dessert']],
  ['クリーム', ['cream']],
  ['ミルク', ['cream']],
  ['バニラ', ['cream']],
  ['ヨーグルト', ['cream']],
  ['プリン', ['cream', 'dessert']],

  // ---- スイーツ ----
  ['cake', ['dessert']],
  ['cheesecake', ['dessert']],
  ['pie', ['dessert']],
  ['tart', ['dessert']],
  ['cookie', ['dessert']],
  ['cookies', ['dessert']],
  ['biscuit', ['dessert']],
  ['waffle', ['dessert']],
  ['pancake', ['dessert']],
  ['honey', ['dessert']],
  ['caramel', ['dessert']],
  ['candy', ['dessert']],
  ['gum', ['dessert']],
  ['bubblegum', ['dessert']],
  ['marshmallow', ['dessert']],
  ['donut', ['dessert']],
  ['doughnut', ['dessert']],
  ['brownie', ['dessert']],
  ['chocolate', ['dessert']],
  ['choco', ['dessert']],
  ['cocoa', ['dessert']],
  ['nutella', ['dessert', 'nut']],
  ['toffee', ['dessert']],
  ['fudge', ['dessert']],
  ['muffin', ['dessert']],
  ['baklava', ['dessert', 'nut']],
  ['halva', ['dessert', 'nut']],
  ['kunafa', ['dessert']],
  ['knafeh', ['dessert']],
  ['tiramisu', ['dessert', 'coffee']],
  ['dessert', ['dessert']],
  ['sugar', ['dessert']],
  ['maple', ['dessert']],
  ['gummy', ['dessert']],
  ['gummi', ['dessert']],
  ['jelly', ['dessert']],
  ['jam', ['dessert']],
  ['sorbet', ['dessert', 'ice']],
  ['sherbet', ['dessert', 'ice']],
  ['gelato', ['dessert', 'cream']],
  ['popsicle', ['dessert', 'ice']],
  ['ハニー', ['dessert']],
  ['はちみつ', ['dessert']],
  ['蜂蜜', ['dessert']],
  ['キャラメル', ['dessert']],
  ['チョコ', ['dessert']],
  ['ケーキ', ['dessert']],
  ['クッキー', ['dessert']],
  ['ガム', ['dessert']],
  ['バクラヴァ', ['dessert', 'nut']],
  ['スキットルズ', ['dessert', 'fruit']],
  ['バタースコッチ', ['dessert']],

  // ---- コーヒー ----
  ['coffee', ['coffee']],
  ['coffe', ['coffee']],
  ['cafe', ['coffee']],
  ['caffe', ['coffee']],
  ['espresso', ['coffee']],
  ['cappuccino', ['coffee']],
  ['capuchino', ['coffee']],
  ['latte', ['coffee']],
  ['macchiato', ['coffee']],
  ['machiato', ['coffee']],
  ['mocha', ['coffee']],
  ['mocca', ['coffee']],
  ['コーヒー', ['coffee']],
  ['カフェ', ['coffee']],
  ['エスプレッソ', ['coffee']],
  ['ラテ', ['coffee']],

  // ---- ティー ----
  ['tea', ['tea']],
  ['chai', ['tea', 'spice']],
  ['matcha', ['tea']],
  ['抹茶', ['tea']],
  ['紅茶', ['tea']],
  ['ティー', ['tea']],
  ['ほうじ茶', ['tea']],
  ['緑茶', ['tea']],

  // ---- ドリンク・カクテル ----
  ['cola', ['drink']],
  ['soda', ['drink']],
  ['mojito', ['mint', 'drink']],
  ['cocktail', ['drink']],
  ['margarita', ['drink']],
  ['daiquiri', ['drink']],
  ['sangria', ['drink']],
  ['champagne', ['drink']],
  ['prosecco', ['drink']],
  ['wine', ['drink']],
  ['whisky', ['drink']],
  ['whiskey', ['drink']],
  ['bourbon', ['drink']],
  ['rum', ['drink']],
  ['gin', ['drink']],
  ['vodka', ['drink']],
  ['tequila', ['drink']],
  ['brandy', ['drink']],
  ['cognac', ['drink']],
  ['beer', ['drink']],
  ['juice', ['drink']],
  ['smoothie', ['drink']],
  ['milkshake', ['cream', 'drink']],
  ['punch', ['drink']],
  ['spritz', ['drink']],
  ['mimosa', ['drink']],
  ['negroni', ['drink']],
  ['cosmopolitan', ['drink']],
  ['curacao', ['drink']],
  ['guarana', ['drink']],
  ['ガラナ', ['drink']],
  ['amaretto', ['drink', 'nut']],
  ['baileys', ['drink', 'cream']],
  ['コーラ', ['drink']],
  ['ソーダ', ['drink']],
  ['サイダー', ['drink']],
  ['ラムネ', ['drink']],
  ['ジュース', ['drink']],
  ['カクテル', ['drink']],
  ['モヒート', ['mint', 'drink']],
  ['ジンジャエール', ['drink', 'spice']],
  ['ジンジャーエール', ['drink', 'spice']],
  ['ブランデー', ['drink']],
  ['シダー', ['drink']],
  ['シードル', ['drink']],
  ['リプトン', ['tea', 'drink']],

  // ---- スパイス ----
  ['cinnamon', ['spice']],
  ['cardamom', ['spice']],
  ['cardamon', ['spice']],
  ['clove', ['spice']],
  ['ginger', ['spice']],
  ['anise', ['spice']],
  ['aniseed', ['spice']],
  ['licorice', ['spice']],
  ['liquorice', ['spice']],
  ['masala', ['spice']],
  ['paan', ['spice']],
  ['nutmeg', ['spice']],
  ['saffron', ['spice']],
  ['pepper', ['spice']],
  ['chili', ['spice']],
  ['chilli', ['spice']],
  ['spice', ['spice']],
  ['spices', ['spice']],
  ['spiced', ['spice']],
  ['spicy', ['spice']],
  ['basil', ['spice']],
  ['herb', ['spice']],
  ['herbs', ['spice']],
  ['herbal', ['spice']],
  ['pan', ['spice']],
  ['シナモン', ['spice']],
  ['カルダモン', ['spice']],
  ['ジンジャー', ['spice']],
  ['生姜', ['spice']],
  ['スパイス', ['spice']],

  // ---- フローラル ----
  ['rose', ['floral']],
  ['jasmine', ['floral']],
  ['lavender', ['floral']],
  ['violet', ['floral']],
  ['hibiscus', ['floral']],
  ['orchid', ['floral']],
  ['blossom', ['floral']],
  ['elderflower', ['floral']],
  ['floral', ['floral']],
  ['flower', ['floral']],
  ['sakura', ['floral']],
  ['ローズ', ['floral']],
  ['ジャスミン', ['floral']],
  ['ラベンダー', ['floral']],
  ['桜', ['floral']],
  ['さくら', ['floral']],

  // ---- ナッツ ----
  ['pistachio', ['nut']],
  ['almond', ['nut']],
  ['hazelnut', ['nut']],
  ['peanut', ['nut']],
  ['walnut', ['nut']],
  ['cashew', ['nut']],
  ['macadamia', ['nut']],
  ['chestnut', ['nut']],
  ['pecan', ['nut']],
  ['praline', ['nut', 'dessert']],
  ['marzipan', ['nut', 'dessert']],
  ['nut', ['nut']],
  ['nuts', ['nut']],
  ['ピスタチオ', ['nut']],
  ['アーモンド', ['nut']],
  ['ナッツ', ['nut']],
]

// 英字/数字のみのパターンは単語境界チェック付き、それ以外 (かな漢字) は部分一致。
function isAsciiPattern(pattern: string): boolean {
  return /^[a-z0-9 ]+$/.test(pattern)
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

interface CompiledRule {
  regex: RegExp
  tags: FlavorTagSlug[]
}

// 長いパターン優先で消費させるため、コンパイル時に長さ降順へ並べる。
const COMPILED_RULES: CompiledRule[] = [...KEYWORD_RULES]
  .sort((a, b) => b[0].length - a[0].length)
  .map(([pattern, tags]) => ({
    regex: isAsciiPattern(pattern)
      ? new RegExp(`(?<![a-z0-9])${escapeRegExp(pattern)}(?![a-z0-9])`, 'g')
      : new RegExp(escapeRegExp(pattern), 'g'),
    tags,
  }))

/**
 * 商品名を辞書マッチ/オーバーライド参照用のキーへ正規化する。
 * 例: "Abukhaliq Cr-ème Caramel" (manufacturer "Abukhaliq") → "creme caramel"
 */
export function normalizeFlavorName(productName: string, manufacturer: string): string {
  let name = productName.trim()
  const brand = manufacturer.trim()
  if (brand && name.toLowerCase().startsWith(brand.toLowerCase())) {
    name = name.slice(brand.length)
  }
  return name
    .normalize('NFKC')
    // ラテン文字のダイアクリティクスのみ除去 (è → e)。\p{M} 全除去にすると
    // NFD で分解された濁点/半濁点まで消えて「ガ」→「カ」になるので範囲を限定する。
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
    .toLowerCase()
    // 中点は区切り記号なのでスペースへ (かな範囲 U+3040-30FF に含まれるため個別に)
    .replace(/・/g, ' ')
    // 英数字・かな・漢字・長音記号以外はスペースへ
    .replace(/[^a-z0-9぀-ヿ一-鿿ー]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchByDictionary(normalized: string): FlavorTagSlug[] {
  const tags = new Set<FlavorTagSlug>()
  let rest = normalized
  for (const { regex, tags: ruleTags } of COMPILED_RULES) {
    regex.lastIndex = 0
    if (!regex.test(rest)) continue
    for (const t of ruleTags) tags.add(t)
    regex.lastIndex = 0
    rest = rest.replace(regex, ' ')
  }
  return [...tags]
}

/**
 * 商品名からタグを推定する。判定できない場合は空配列 (「不明なら付けない」方針)。
 */
export function tagFlavorName(productName: string, manufacturer: string): FlavorTagSlug[] {
  const normalized = normalizeFlavorName(productName, manufacturer)
  if (!normalized) return []
  const override = FLAVOR_TAG_OVERRIDES[normalized]
  if (override) return [...override]
  return matchByDictionary(normalized)
}
