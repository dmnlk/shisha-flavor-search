'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState, MouseEvent } from 'react'

import BackgroundOrbs from '../../../components/BackgroundOrbs'
import LoadingSpinner from '../../../components/LoadingSpinner'
import type { ShishaFlavor } from '../../../types/shisha'

export default function FlavorDetail() {
  const [flavor, setFlavor] = useState<ShishaFlavor | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const fetchFlavor = async () => {
      try {
        const response = await fetch(`/api/flavor/${params.id}`)
        const data: ShishaFlavor = await response.json()
        setFlavor(data)
      } catch (error) {
        console.error('Error fetching flavor:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFlavor()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-lounge-50 dark:bg-lounge-950">
        <LoadingSpinner />
      </div>
    )
  }

  if (!flavor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-lounge-50 dark:bg-lounge-950">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1
            className="text-2xl font-medium text-lounge-800 dark:text-lounge-200 mb-6"
            style={{ fontFamily: 'var(--font-display), serif' }}
          >
            Flavor not found
          </h1>
          <Link href="/">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors"
            >
              Return to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-lounge-50 dark:bg-lounge-950 relative overflow-hidden bg-atmosphere-light dark:bg-atmosphere-dark py-8 sm:py-12 md:py-16">
      <BackgroundOrbs />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-lounge-400 dark:text-lounge-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 group text-sm font-medium tracking-wide transition-colors"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </Link>
        </motion.div>

        <div className="bg-white dark:bg-lounge-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-lounge-200/60 dark:border-lounge-800/40 shadow-sm">
          <div className="md:flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="md:w-1/2"
            >
              <div className="relative h-[320px] sm:h-[420px] md:h-[520px] lg:h-[600px] bg-lounge-100 dark:bg-lounge-800/60">
                <Image
                  src={(flavor.imageUrl || '/images/no_image_hookah_cover.png').replace('.png', '_w.png')}
                  alt={flavor.productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-8 sm:p-10 md:p-12 lg:p-16 md:w-1/2 flex flex-col justify-center"
            >
              <Link href="/" onClick={(e: MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.history.back() }}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors cursor-pointer">
                  {flavor.manufacturer}
                </span>
              </Link>

              <h1
                className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-lounge-900 dark:text-lounge-100 mt-3 mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-display), serif' }}
              >
                {flavor.productName}
              </h1>

              <div className="w-8 h-px bg-primary-400/50 mb-6" />

              <p className="text-2xl sm:text-3xl font-semibold text-lounge-800 dark:text-lounge-200 mb-8">
                {flavor.price}
              </p>

              <div className="space-y-4 text-lounge-500 dark:text-lounge-400">
                <p className="text-sm leading-relaxed">
                  {flavor.description || `${flavor.amount} · ${flavor.country}`}
                </p>
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-lounge-200/60 dark:border-lounge-800/40">
                  <div className="bg-lounge-50 dark:bg-lounge-800/40 p-4 rounded-xl">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-lounge-400 dark:text-lounge-500 mb-1">容量</p>
                    <p className="text-sm font-medium text-lounge-800 dark:text-lounge-200">{flavor.amount}</p>
                  </div>
                  <div className="bg-lounge-50 dark:bg-lounge-800/40 p-4 rounded-xl">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-lounge-400 dark:text-lounge-500 mb-1">原産国</p>
                    <p className="text-sm font-medium text-lounge-800 dark:text-lounge-200">{flavor.country}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
