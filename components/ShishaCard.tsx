'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MouseEvent } from 'react'

import { brandSlug } from '../lib/utils/brandNormalizer'
import type { ShishaFlavor } from '../types/shisha'

import CountryFlag from './CountryFlag'
import NoImage from './NoImage'

interface ShishaCardProps {
  flavor: ShishaFlavor
  onManufacturerClick?: (_manufacturer: string) => void
  index?: number
}

function formatIndex(id: number): string {
  return id.toString().padStart(4, '0')
}

export default function ShishaCard({ flavor, onManufacturerClick, index = 0 }: ShishaCardProps) {
  const router = useRouter()

  const handleManufacturerClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (onManufacturerClick) {
      onManufacturerClick(flavor.manufacturer)
    } else {
      router.push(`/brands/${brandSlug(flavor.manufacturer)}`)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: Math.min(index * 0.02, 0.3), duration: 0.25 }}
      className="group"
    >
      <Link
        href={`/flavor/${flavor.id}`}
        className="block bg-paper-0 dark:bg-paper-950 border border-rule-200 dark:border-rule-800 transition-[border-color,background] duration-150 hover:border-ember-500 dark:hover:border-ember-500"
      >
        <div className="relative aspect-square overflow-hidden border-b border-rule-200 dark:border-rule-800 bg-paper-100 dark:bg-paper-900">
          {flavor.imageUrl ? (
            <Image
              src={flavor.imageUrl}
              alt={flavor.productName}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015]"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <NoImage />
          )}
          <div
            aria-hidden
            className="absolute left-0 top-0 h-px w-0 bg-ember-500 transition-[width] duration-200 ease-out group-hover:w-full"
          />
        </div>

        <div className="px-3 pt-2.5 pb-3">
          <div className="flex items-center justify-between font-mono-tight text-[10px] uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400 nums mb-2">
            <span>№&nbsp;{formatIndex(flavor.id)}</span>
            <span className="flex items-center gap-1.5">
              <CountryFlag country={flavor.country} />
              <span className="inline-block w-px h-2.5 bg-rule-300 dark:bg-rule-700" />
              <span>{flavor.amount}</span>
            </span>
          </div>

          <button
            onClick={handleManufacturerClick}
            className="font-mono-tight text-[10px] uppercase tracking-[0.14em] text-ink-600 dark:text-ink-300 hover:text-ember-500 transition-colors block text-left truncate w-full mb-1"
          >
            {flavor.manufacturer}
          </button>

          <h3 className="font-sans-tight text-[0.98rem] font-semibold leading-[1.15] text-ink-950 dark:text-ink-50 group-hover:text-ember-500 transition-colors line-clamp-2 mb-2">
            {flavor.productName}
          </h3>

          <div className="pt-2 mt-2 border-t border-rule-200 dark:border-rule-800 flex items-baseline justify-between">
            <span className="font-mono-tight text-sm font-medium text-ink-950 dark:text-ink-50 nums">
              {flavor.price}
            </span>
            <span className="font-mono-tight text-[10px] uppercase tracking-[0.1em] text-ember-500 opacity-0 group-hover:opacity-100 transition-opacity">
              view →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
