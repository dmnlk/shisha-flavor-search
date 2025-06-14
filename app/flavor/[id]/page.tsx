'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState, MouseEvent } from 'react'

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
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!flavor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Flavor not found</h1>
        <Link href="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-4 sm:py-8 md:py-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 mb-4 sm:mb-6 md:mb-8 group text-sm sm:text-base"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Search
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:w-1/2"
            >
              <Image
                src={(flavor.imageUrl || '/images/no_image_hookah_cover.png').replace('.png', '_w.png')}
                alt={flavor.productName}
                width={600}
                height={400}
                className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 sm:p-6 md:p-8 md:w-1/2"
            >
              <Link href="/" onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault()
                window.history.back()
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-gray-700 dark:text-primary-300 dark:hover:bg-gray-600 transition-colors mb-3 sm:mb-4"
                >
                  {flavor.manufacturer}
                </motion.button>
              </Link>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {flavor.productName}
              </h1>

              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4 sm:mb-6">
                {flavor.price}
              </div>

              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-gray-600 dark:text-gray-300">
                <p>{flavor.description || `${flavor.amount} - ${flavor.country}`}</p>
                <div className="mt-4 space-y-2">
                  <p><span className="font-semibold">容量:</span> {flavor.amount}</p>
                  <p><span className="font-semibold">原産国:</span> {flavor.country}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}