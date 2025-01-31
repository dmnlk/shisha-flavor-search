'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

export default function ShishaCard({ flavor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="aspect-square relative overflow-hidden cursor-pointer">
        <Link href={`/flavor/${flavor.id}`}>
          <div className="relative h-full">
            <Image
              src={flavor.imageUrl}
              alt={flavor.productName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{flavor.manufacturer}</span>
          <span className="text-sm font-medium text-primary-600">
            ${flavor.price.toFixed(2)}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{flavor.productName}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {flavor.description}
        </p>
      </div>
    </motion.div>
  );
}
