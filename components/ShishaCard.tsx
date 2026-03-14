'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MouseEvent } from 'react'

import type { ShishaFlavor } from '../types/shisha'

interface ShishaCardProps {
  flavor: ShishaFlavor
  onManufacturerClick?: (_manufacturer: string) => void
  index?: number
}

export default function ShishaCard({ flavor, onManufacturerClick, index = 0 }: ShishaCardProps) {
  const handleManufacturerClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (onManufacturerClick) {
      onManufacturerClick(flavor.manufacturer)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-lounge-900/80 rounded-xl overflow-hidden border border-lounge-200/60 dark:border-lounge-800/50 hover:border-primary-300/40 dark:hover:border-primary-600/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(201,165,94,0.08)] dark:hover:shadow-[0_8px_30px_rgba(201,165,94,0.06)]"
    >
      <Link href={`/flavor/${flavor.id}`} className="block">
        <div className="aspect-[3/4] relative overflow-hidden bg-lounge-100 dark:bg-lounge-800/60">
          <Image
            src={flavor.imageUrl || '/images/no_image_hookah_cover.png'}
            alt={flavor.productName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-4">
          <button
            onClick={handleManufacturerClick}
            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-2 block"
          >
            {flavor.manufacturer}
          </button>

          <h3
            className="text-[15px] leading-snug text-lounge-900 dark:text-lounge-100 mb-2 line-clamp-2 transition-colors"
            style={{ fontFamily: 'var(--font-display), serif' }}
          >
            {flavor.productName}
          </h3>

          <p className="text-xs text-lounge-400 dark:text-lounge-500 mb-3 line-clamp-2 leading-relaxed">
            {flavor.description || `${flavor.amount} · ${flavor.country}`}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-lounge-100 dark:border-lounge-800/50">
            <span className="text-sm font-semibold text-lounge-800 dark:text-lounge-200">
              {flavor.price}
            </span>
            <span className="text-xs text-lounge-300 dark:text-lounge-600 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
