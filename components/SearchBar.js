'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch, manufacturers }) {
  const [query, setQuery] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, manufacturer: selectedManufacturer });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mb-12"
    >
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search flavors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="md:w-64">
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full py-3 px-4 border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">All Manufacturers</option>
              {manufacturers?.map((manufacturer) => (
                <option key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-md"
          >
            Search
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
