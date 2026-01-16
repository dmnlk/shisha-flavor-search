'use client'

import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, MouseEvent } from 'react'

import type { ShishaFlavor } from '../types/shisha'

interface ShishaCardProps {
  flavor: ShishaFlavor
  onManufacturerClick?: (_manufacturer: string) => void
  index?: number
}

export default function ShishaCard({ flavor, onManufacturerClick, index = 0 }: ShishaCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const handleManufacturerClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (onManufacturerClick) {
      onManufacturerClick(flavor.manufacturer)
    }
  }

  const handleLikeClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all duration-300"
    >
      <Link href={`/flavor/${flavor.id}`} className="block">
        <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30">
          <Image
            src={flavor.imageUrl || '/images/no_image_hookah_cover.png'}
            alt={flavor.productName}
            fill
            className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/80 transition-all duration-300" />

          <motion.button
            onClick={handleLikeClick}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 p-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all z-10"
          >
            {isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </motion.button>

          {/* Decorative accent: sparkles icon and pulsing dot used for visual emphasis only. */}
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 z-10"
            aria-hidden="true"
          >
            <SparklesIcon className="h-4 w-4 text-yellow-400 drop-shadow-lg" />
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <motion.button
              onClick={handleManufacturerClick}
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-md hover:shadow-lg transition-all"
            >
              {flavor.manufacturer}
            </motion.button>
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm sm:text-base leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {flavor.productName}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {flavor.description || `${flavor.amount} - ${flavor.country}`}
          </p>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <span className="font-black text-transparent bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-sm sm:text-base">
              {flavor.price}
            </span>
            <motion.div
              whileHover={{ x: 5 }}
              className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}