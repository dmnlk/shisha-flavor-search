'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch, manufacturers }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: searchTerm });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for flavors..."
            className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-shadow"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" /> {/* Dark mode icon color */}
        </motion.div>
      </div>
    </form>
  );
}
