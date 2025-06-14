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
  onManufacturerClick?: (manufacturer: string) => void
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
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/flavor/${flavor.id}`} className="block">
        <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <Image
            src={flavor.imageUrl || '/images/no_image_hookah_cover.png'}
            alt={flavor.productName}
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <button
            onClick={handleLikeClick}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
          >
            {isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <button
              onClick={handleManufacturerClick}
              className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-gray-700 dark:text-primary-300 dark:hover:bg-gray-600 transition-colors"
            >
              {flavor.manufacturer}
            </button>
            
            <div className="flex items-center text-yellow-400">
              <SparklesIcon className="h-4 w-4" />
            </div>
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm sm:text-base leading-tight">
            {flavor.productName}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
            {flavor.description}
          </p>

          <div className="flex justify-between items-center">
            <span className="font-bold text-primary-600 dark:text-primary-400 text-sm sm:text-base">
              {flavor.price}
            </span>
            <motion.div
              whileHover={{ x: 5 }}
              className="text-primary-600 dark:text-primary-400"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
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