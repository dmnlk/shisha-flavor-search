'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';

export default function ShishaCard({ flavor, index, onManufacturerClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden cursor-pointer">
        <Link href={`/flavor/${flavor.id}`}>
          <img
            src={flavor.imageUrl}
            alt={flavor.productName}
            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>
      <div className="p-6">
        <div className="mb-2">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              onManufacturerClick(flavor.manufacturer);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              'px-3 py-1 text-xs font-medium rounded-full cursor-pointer',
              'bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors'
            )}
          >
            {flavor.manufacturer}
          </motion.button>
        </div>
        <Link href={`/flavor/${flavor.id}`} className="block group">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {flavor.productName}
          </h3>
          {flavor.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {flavor.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              ${flavor.price.toFixed(2)}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              View Details
            </motion.button>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
