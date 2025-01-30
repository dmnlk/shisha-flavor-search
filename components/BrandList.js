'use client';

import { motion } from 'framer-motion';

export default function BrandList({ manufacturers, selectedManufacturer, onSelect }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Popular Brands</h2>
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedManufacturer === ''
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-primary-50'
          } shadow-sm`}
        >
          All Brands
        </motion.button>
        {manufacturers.map((manufacturer) => (
          <motion.button
            key={manufacturer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(manufacturer)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedManufacturer === manufacturer
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-primary-50'
            } shadow-sm`}
          >
            {manufacturer}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
