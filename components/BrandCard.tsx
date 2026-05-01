'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type CSSProperties, useState } from 'react'

import { brandSlug } from '../lib/utils/brandNormalizer'

interface BrandCardProps {
  name: string
  count: number
  sampleFlavors: string[]
  imageUrl?: string
  index?: number
}

function getBrandInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export default function BrandCard({ name, count, sampleFlavors, imageUrl, index = 0 }: BrandCardProps) {
  const [imageError, setImageError] = useState(false)
  const showImage = Boolean(imageUrl) && !imageError
  const initials = getBrandInitials(name)

  return (
    <article
      className="animate-card-in"
      style={{ '--card-delay': `${Math.min(index * 15, 300)}ms` } as CSSProperties}
    >
      <Link
        href={`/brands/${brandSlug(name)}`}
        className="group block bg-paper-0 dark:bg-paper-950 border border-rule-200 dark:border-rule-800 transition-[border-color] duration-150 hover:border-ember-500"
      >
        <div className="relative aspect-[4/3] overflow-hidden border-b border-rule-200 dark:border-rule-800 bg-paper-50 dark:bg-paper-900">
          {showImage ? (
            <Image
              src={imageUrl as string}
              alt={`${name} logo`}
              fill
              className="object-contain p-6 transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="font-sans-tight font-semibold text-5xl sm:text-6xl tracking-[-0.04em] text-ink-900 dark:text-ink-100">
                {initials}
              </span>
            </div>
          )}
          <div
            aria-hidden
            className="absolute left-0 top-0 h-px w-0 bg-ember-500 transition-[width] duration-200 ease-out group-hover:w-full"
          />
        </div>

        <div className="px-3 pt-2.5 pb-3">
          <div className="flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400 nums mb-2">
            <span>№&nbsp;{String(index + 1).padStart(3, '0')}</span>
            <span className="text-ember-500">{count.toString().padStart(3, '0')}&nbsp;ENTRIES</span>
          </div>

          <h3 className="font-sans-tight font-semibold text-[1rem] leading-[1.15] tracking-[-0.01em] text-ink-950 dark:text-ink-50 group-hover:text-ember-500 transition-colors truncate mb-1.5">
            {name}
          </h3>

          {sampleFlavors.length > 0 && (
            <p className="font-mono-tight text-[10px] uppercase tracking-[0.08em] text-ink-400 dark:text-ink-500 line-clamp-1">
              {sampleFlavors.slice(0, 2).join(' · ')}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
