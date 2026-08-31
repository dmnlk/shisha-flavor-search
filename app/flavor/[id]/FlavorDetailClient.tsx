'use client'

import Image from 'next/image'
import Link from 'next/link'

import NoImage from '../../../components/NoImage'
import ShareOnX from '../../../components/ShareOnX'
import ShishaCard from '../../../components/ShishaCard'
import { flavorTagLabel } from '../../../data/flavorTagTaxonomy'
import { brandSlug } from '../../../lib/utils/brandNormalizer'
import type { ShishaFlavor } from '../../../types/shisha'

function formatIndex(id: number): string {
  return id.toString().padStart(4, '0')
}

/**
 * "100.0g箱" → 数量 "100.0g" + 容器 "箱" に分割する。数量は大きく、
 * 容器種別 (プラスチックケース等の長い語) は小さなラベルで折り返して
 * 表示し、狭いカラムでの見切れを防ぐ。
 */
function splitAmount(amount: string): { measure: string; container: string } {
  const m = amount.match(/^([\d.,]+\s*g?)(.*)$/i)
  if (!m) return { measure: amount, container: '' }
  return { measure: m[1].trim(), container: m[2].trim() }
}

interface FlavorDetailClientProps {
  flavor: ShishaFlavor
  related?: ShishaFlavor[]
}

export default function FlavorDetailClient({ flavor, related = [] }: FlavorDetailClientProps) {
  const { measure, container } = splitAmount(flavor.amount)
  return (
    <div className="min-h-screen bg-paper-0 dark:bg-paper-950 text-ink-950 dark:text-ink-50">
      <main className="mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-24 max-w-[1480px]">
        {/* Masthead */}
        <header className="flex flex-wrap items-center justify-between gap-3 py-3 border-t-2 border-b border-ink-900 dark:border-ink-100 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-700 dark:text-ink-200 mb-0">
          <Link href="/" className="flex items-center gap-2 hover:text-ember-500 transition-colors">
            <span aria-hidden>←</span>
            <span>Back to Ledger</span>
          </Link>
          <span className="nums text-ember-500">
            ENTRY · № {formatIndex(flavor.id)}
          </span>
        </header>

        {/* Entry */}
        <article className="grid grid-cols-12 gap-0 border-b border-ink-900 dark:border-ink-100">
          <figure className="col-span-12 md:col-span-7 md:border-r border-rule-200 dark:border-rule-800 relative bg-paper-50 dark:bg-paper-900">
            <div className="relative aspect-[3/4] md:aspect-auto md:h-full md:min-h-[640px]">
              {flavor.imageUrl ? (
                <Image
                  src={flavor.imageUrl}
                  alt={`${flavor.manufacturer} ${flavor.productName} シーシャ フレーバー`}
                  fill
                  // cover だと横長のプロモ画像 (DARKSIDE 等) の左右が大きく
                  // トリミングされるため、全体が見える contain で表示する
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 58vw"
                  priority
                />
              ) : (
                <NoImage label="No image on file" priority />
              )}
            </div>
            <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-2 border-t border-rule-200 dark:border-rule-800 bg-paper-0/95 dark:bg-paper-950/95 backdrop-blur-sm font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-500 dark:text-ink-400 flex items-center justify-between nums">
              <span>Plate № {formatIndex(flavor.id)}</span>
              <span>{flavor.country}</span>
            </figcaption>
          </figure>

          <div className="col-span-12 md:col-span-5">
            <div className="px-6 md:px-10 py-10">
              <Link
                href={`/brands/${brandSlug(flavor.manufacturer)}`}
                className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ember-500 hover:text-ember-600 transition-colors block mb-4"
              >
                {flavor.manufacturer}
              </Link>

              <h1 className="font-sans-tight font-semibold text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] leading-[0.95] tracking-[-0.03em] text-ink-950 dark:text-ink-50 mb-8">
                {flavor.productName}<span className="text-ember-500">.</span>
              </h1>

              <div className="flex items-baseline gap-4 pb-6 border-b border-rule-200 dark:border-rule-800">
                <span className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500">
                  Price
                </span>
                <span className="font-sans-tight font-semibold text-4xl sm:text-5xl tracking-[-0.02em] nums">
                  {flavor.price}
                </span>
              </div>

              {flavor.description && (
                <div className="py-6 border-b border-rule-200 dark:border-rule-800">
                  <p className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500 mb-3">
                    Tasting note
                  </p>
                  <p className="font-sans-tight text-ink-700 dark:text-ink-200 text-base leading-[1.55]">
                    {flavor.description}
                  </p>
                </div>
              )}

              {flavor.tags && flavor.tags.length > 0 && (
                <div className="py-6 border-b border-rule-200 dark:border-rule-800">
                  <p className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500 mb-3">
                    Flavor tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {flavor.tags.map(tag => (
                      <Link
                        key={tag}
                        href={`/?tags=${tag}`}
                        className="font-mono-tight text-[10px] tracking-[0.12em] px-2.5 py-1.5 border border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:border-ember-500 hover:text-ember-500 transition-colors"
                      >
                        {flavorTagLabel(tag)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* md〜lg は右カラムが狭くセルが約100pxになるため縦積みにする */}
              <dl className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 border-b border-rule-200 dark:border-rule-800">
                <div className="py-5 pr-4 md:pr-0 lg:pr-4 border-r md:border-r-0 lg:border-r border-rule-200 dark:border-rule-800">
                  <dt className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500 mb-2">
                    Grammage
                  </dt>
                  <dd className="font-sans-tight font-semibold text-2xl xl:text-3xl tracking-[-0.02em] nums break-words">
                    {measure}
                    {container && (
                      <span className="block mt-1 font-mono-tight text-xs font-normal tracking-[0.08em] text-ink-500 dark:text-ink-400">
                        {container}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="py-5 pl-4 md:pl-0 lg:pl-4 md:border-t lg:border-t-0 border-rule-200 dark:border-rule-800">
                  <dt className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500 mb-2">
                    Origin
                  </dt>
                  <dd className="font-sans-tight font-semibold text-2xl xl:text-3xl tracking-[-0.02em] break-words">
                    {flavor.country}
                  </dd>
                </div>
              </dl>

              <div className="py-6 border-b border-rule-200 dark:border-rule-800">
                <p className="font-mono-tight text-[10px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-500 mb-3">
                  Share
                </p>
                <ShareOnX
                  text={`${flavor.productName} — ${flavor.manufacturer}`}
                  hashtags={['シーシャ', 'shisha']}
                />
              </div>

              <div className="pt-6 font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500 flex items-center justify-between nums">
                <span>Entry № {formatIndex(flavor.id)}</span>
                <span>Vol.&nbsp;I · Ed.&nbsp;2026</span>
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-16">
            <header className="flex items-center justify-between gap-3 py-3 border-t-2 border-b border-ink-900 dark:border-ink-100 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-700 dark:text-ink-200 mb-6">
              <span className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 bg-ember-500" aria-hidden />
                <span>More from {flavor.manufacturer}</span>
              </span>
              <Link
                href={`/brands/${brandSlug(flavor.manufacturer)}`}
                className="hover:text-ember-500 transition-colors"
              >
                View house →
              </Link>
            </header>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.map((item, index) => (
                <ShishaCard key={item.id} flavor={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
