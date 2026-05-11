import Image from 'next/image'
import Link from 'next/link'

import { brandSlug } from '../../lib/utils/brandNormalizer'
import type { EditorsPickFlavor } from '../../data/homeSections'
import NoImage from '../NoImage'

import SectionHeader from './SectionHeader'

interface EditorsPicksProps {
  picks: EditorsPickFlavor[]
}

export default function EditorsPicks({ picks }: EditorsPicksProps) {
  if (picks.length === 0) return null

  return (
    <section className="mt-16">
      <SectionHeader
        section="§ 005"
        title="Editor's Selection"
        subtitle={`${picks.length} entries · hand-picked · with notes`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-rule-200 dark:border-rule-800">
        {picks.map(({ flavor, note }, idx) => {
          const hasImg = Boolean(flavor.imageUrl && flavor.imageUrl.trim() !== '')
          const isRightCol = idx % 2 === 1
          const isNotLast = idx < picks.length - 1
          const isLastRow = idx >= picks.length - 2
          return (
            <article
              key={flavor.id}
              className={`group flex items-start gap-4 p-5 border-rule-200 dark:border-rule-800 ${
                !isRightCol ? 'md:border-r' : ''
              } ${isNotLast ? 'border-b' : ''} ${isLastRow ? 'md:border-b-0' : 'md:border-b'}`}
            >
              <Link
                href={`/flavor/${flavor.id}`}
                className="relative w-28 h-28 shrink-0 bg-paper-100 dark:bg-paper-900 border border-rule-200 dark:border-rule-800 overflow-hidden"
              >
                {hasImg ? (
                  <Image
                    src={flavor.imageUrl}
                    alt={`${flavor.manufacturer} ${flavor.productName} シーシャ フレーバー`}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <NoImage />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 font-mono-tight text-[10px] uppercase tracking-[0.1em] text-ink-500 dark:text-ink-400 nums mb-1.5">
                  <span className="text-ember-500">№&nbsp;{String(idx + 1).padStart(2, '0')}</span>
                  <span>·</span>
                  <Link
                    href={`/brands/${brandSlug(flavor.manufacturer)}`}
                    className="hover:text-ember-500 transition-colors truncate"
                  >
                    {flavor.manufacturer}
                  </Link>
                </div>
                <Link
                  href={`/flavor/${flavor.id}`}
                  className="block font-sans-tight font-semibold text-base sm:text-lg leading-[1.2] text-ink-950 dark:text-ink-50 group-hover:text-ember-500 transition-colors line-clamp-2 mb-2"
                >
                  {flavor.productName}
                </Link>
                {note && (
                  <p className="font-sans-tight text-sm text-ink-600 dark:text-ink-300 leading-[1.5] line-clamp-2">
                    {note}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3 font-mono-tight text-[10px] uppercase tracking-[0.12em] text-ink-400 dark:text-ink-500 nums">
                  <span>{flavor.amount}</span>
                  <span className="inline-block w-px h-2.5 bg-rule-300 dark:bg-rule-700" />
                  <span>{flavor.price}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
