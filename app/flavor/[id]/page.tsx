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
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-950 bg-gradient-mesh">
        <LoadingSpinner />
      </div>
    )
  }

  if (!flavor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-950 bg-gradient-mesh">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-6 dark:text-white">Flavor not found</h1>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all shadow-xl glow"
            >
              Return to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 bg-gradient-mesh relative overflow-hidden py-8 sm:py-12 md:py-16">
      <BackgroundOrbs />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 mb-6 sm:mb-8 md:mb-10 group text-base sm:text-lg font-semibold"
          >
            <motion.svg
              whileHover={{ x: -4 }}
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </motion.svg>
            Back to Search
          </Link>
        </motion.div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
          <div className="md:flex">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:w-1/2 relative"
            >
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30">
                <Image
                  src={(flavor.imageUrl || '/images/no_image_hookah_cover.png').replace('.png', '_w.png')}
                  alt={flavor.productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 sm:p-8 md:p-10 lg:p-12 md:w-1/2 flex flex-col justify-center"
            >
              <Link href="/" onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault()
                window.history.back()
              }}>
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-5 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl transition-all mb-4 sm:mb-6"
                >
                  {flavor.manufacturer}
                </motion.button>
              </Link>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                {flavor.productName}
              </h1>

              <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8">
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  {flavor.price}
                </span>
              </div>

              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="text-base sm:text-lg leading-relaxed">
                  {flavor.description || `${flavor.amount} - ${flavor.country}`}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-gray-200/50 dark:border-gray-700/50">
                  <div className="bg-primary-50/50 dark:bg-primary-900/20 p-4 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">容量</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{flavor.amount}</p>
                  </div>
                  <div className="bg-accent-50/50 dark:bg-accent-900/20 p-4 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">原産国</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{flavor.country}</p>
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