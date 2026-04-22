'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface BrandCardProps {
  name: string
  count: number
  sampleFlavors: string[]
  imageUrl?: string
  index?: number
}

const GRADIENTS = [
  'from-primary-600 via-accent-500 to-accent-700',
  'from-accent-700 via-primary-500 to-primary-800',
  'from-lounge-800 via-accent-600 to-primary-600',
  'from-primary-700 via-primary-400 to-accent-600',
  'from-accent-800 via-accent-500 to-primary-400',
  'from-primary-800 via-accent-700 to-lounge-700',
  'from-accent-600 via-primary-600 to-primary-900',
  'from-lounge-700 via-primary-700 to-accent-500',
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
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

  const gradient = GRADIENTS[hashString(name) % GRADIENTS.length]
  const initials = getBrandInitials(name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.6), duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        href={`/?manufacturer=${encodeURIComponent(name)}`}
        className="block bg-white dark:bg-lounge-900/80 rounded-xl overflow-hidden border border-lounge-200/60 dark:border-lounge-800/50 hover:border-primary-300/50 dark:hover:border-primary-600/40 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(201,165,94,0.12)] dark:hover:shadow-[0_12px_40px_rgba(201,165,94,0.08)]"
      >
        <div className={`aspect-[4/3] relative overflow-hidden bg-gradient-to-br ${gradient}`}>
          {showImage ? (
            <Image
              src={imageUrl as string}
              alt={`${name} logo`}
              fill
              className="object-contain p-6 bg-white/95 dark:bg-lounge-950/40 group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <>
              <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.3), transparent 50%)',
              }} />
              <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
                <span
                  className="text-5xl sm:text-6xl font-normal text-white/95 tracking-tight leading-none mb-3 drop-shadow-sm"
                  style={{ fontFamily: 'var(--font-display), serif' }}
                >
                  {initials}
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/70 font-semibold">
                  Shisha Brand
                </span>
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-4 sm:p-5">
          <h3
            className="text-base sm:text-lg text-lounge-900 dark:text-lounge-100 mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
            style={{ fontFamily: 'var(--font-display), serif' }}
          >
            {name}
          </h3>
          <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-primary-600/80 dark:text-primary-400/80 mb-2">
            {count} flavor{count === 1 ? '' : 's'}
          </p>
          {sampleFlavors.length > 0 && (
            <p className="text-xs text-lounge-400 dark:text-lounge-500 line-clamp-2 leading-relaxed">
              {sampleFlavors.slice(0, 2).join(' · ')}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
