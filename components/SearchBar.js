'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ onSearch, manufacturers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: searchTerm });
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch({ query: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="お気に入りのフレーバーを検索..."
            className="w-full px-5 py-4 pl-14 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-2xl shadow-lg border-2 border-transparent focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-all text-base"
          />
          
          <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 dark:text-gray-500" />
          
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={false}
          animate={{ 
            opacity: isFocused ? 1 : 0,
            y: isFocused ? 0 : -10 
          }}
          className="absolute inset-x-0 -bottom-1 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full blur-sm"
        />
      </motion.div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <p className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium">
            {manufacturers.length}
          </span>
          ブランドから検索
        </p>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FunnelIcon className="h-4 w-4" />
          フィルター
        </button>
      </div>
    </form>
  );
}
