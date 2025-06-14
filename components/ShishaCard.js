'use client';

import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ShishaCard({ flavor, onManufacturerClick }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleManufacturerClick = (e) => {
    e.preventDefault();
    if (onManufacturerClick) {
      onManufacturerClick(flavor.manufacturer);
    }
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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

          <div className="absolute bottom-3 left-3 right-3">
            <span 
              onClick={handleManufacturerClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <SparklesIcon className="h-3 w-3" />
              {flavor.manufacturer}
            </span>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
              {flavor.productName}
            </h3>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap">
              {flavor.price}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {flavor.description || 'エキゾチックな味わいをお楽しみください'}
          </p>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex -space-x-1">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              プレミアムフレーバー
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
