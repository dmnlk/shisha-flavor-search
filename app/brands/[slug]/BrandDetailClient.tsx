'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import ShishaCard from '../../../components/ShishaCard'
import type { ShishaFlavor } from '../../../types/shisha'

interface BrandDetailClientProps {
  slug: string
  brandName: string
  flavors: ShishaFlavor[]
  imageUrl?: string
}

function getBrandInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export default function BrandDetailClient({ slug, brandName, flavors, imageUrl }: BrandDetailClientProps) {
  const [imageError, setImageError] = useState(false)
  const showImage = Boolean(imageUrl) && !imageError
  const initials = getBrandInitials(brandName)

  const countries = useMemo(() => {
    const set = new Set<string>()
    for (const f of flavors) if (f.country) set.add(f.country)
    return Array.from(set)
  }, [flavors])

  return (
    <div className="min-h-screen bg-paper-0 dark:bg-paper-950 text-ink-950 dark:text-ink-50">
      <main className="mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-24 max-w-[1480px]">
        {/* Masthead */}
        <header className="flex flex-wrap items-center justify-between gap-3 py-3 border-t-2 border-b border-ink-900 dark:border-ink-100 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-700 dark:text-ink-200">
          <Link href="/brands" className="flex items-center gap-2 hover:text-ember-500 transition-colors">
            <span aria-hidden>←</span>
            <span>Brand Index</span>
          </Link>
          <span className="nums text-ember-500">
            BRAND · /{slug}
          </span>
        </header>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-12 gap-0 border-b border-ink-900 dark:border-ink-100"
        >
          <div className="col-span-12 md:col-span-8 md:border-r md:border-rule-200 md:dark:border-rule-800 py-10 lg:py-14 md:pr-10">
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ember-500 mb-5">
              § Brand · {flavors.length} flavors on file
            </p>
            <h1 className="font-sans-tight font-semibold leading-[0.9] tracking-[-0.04em] text-ink-950 dark:text-ink-50 text-[3rem] sm:text-[4.5rem] lg:text-[6.5rem] break-words">
              {brandName}<span className="text-ember-500">.</span>
            </h1>
            <p className="mt-8 font-sans-tight text-ink-600 dark:text-ink-300 text-base sm:text-lg leading-[1.5] max-w-[52ch]">
              Every {brandName} flavor tracked in the ledger — {flavors.length} entries
              {countries.length > 0 && <> produced in {countries.slice(0, 3).join(', ')}{countries.length > 3 ? ` +${countries.length - 3}` : ''}</>}.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/brands"
                className="font-mono-tight text-[11px] uppercase tracking-[0.14em] px-4 py-2 border border-rule-200 dark:border-rule-800 text-ink-600 dark:text-ink-300 hover:border-ember-500 hover:text-ember-500 transition-colors"
              >
                ← All brands
              </Link>
              <Link
                href="/"
                className="font-mono-tight text-[11px] uppercase tracking-[0.14em] text-ink-400 dark:text-ink-500 hover:text-ember-500 transition-colors"
              >
                Flavor ledger →
              </Link>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4 flex flex-col">
            <div className="relative aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-[280px] bg-paper-50 dark:bg-paper-900 border-t md:border-t-0 border-rule-200 dark:border-rule-800">
              {showImage ? (
                <Image
                  src={imageUrl as string}
                  alt={`${brandName} logo`}
                  fill
                  className="object-contain p-8 sm:p-10"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <span className="font-sans-tight font-semibold text-6xl sm:text-7xl tracking-[-0.04em] text-ink-900 dark:text-ink-100">
                    {initials}
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 border-t border-rule-200 dark:border-rule-800">
              <div className="py-5 px-5 lg:px-8 border-r border-rule-200 dark:border-rule-800">
                <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-1">
                  Flavors
                </p>
                <p className="font-sans-tight font-semibold text-3xl lg:text-4xl tracking-[-0.03em] text-ink-950 dark:text-ink-50 nums leading-none">
                  {flavors.length}
                </p>
              </div>
              <div className="py-5 px-5 lg:px-8">
                <p className="font-mono-tight text-[10px] uppercase tracking-[0.2em] text-ink-400 dark:text-ink-500 mb-1">
                  Origins
                </p>
                <p className="font-sans-tight font-semibold text-3xl lg:text-4xl tracking-[-0.03em] text-ink-950 dark:text-ink-50 nums leading-none">
                  {countries.length}
                </p>
              </div>
            </div>
          </aside>
        </motion.section>

        {/* Results header */}
        <div className="flex items-baseline justify-between border-b border-rule-200 dark:border-rule-800 py-3 mt-10 font-mono-tight text-[10px] uppercase tracking-[0.16em] text-ink-600 dark:text-ink-300">
          <span className="flex items-center gap-3">
            <span className="text-ember-500">§</span>
            <span>Catalog</span>
          </span>
          <span className="nums">
            <span className="text-ember-500">{String(flavors.length).padStart(4, '0')}</span>
            <span className="text-ink-400 dark:text-ink-500">&nbsp;/&nbsp;entries</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-6">
          {flavors.map((flavor, index) => (
            <ShishaCard key={flavor.id} flavor={flavor} index={index} />
          ))}
        </div>
      </main>
    </div>
  )
}
