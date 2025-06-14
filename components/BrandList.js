'use client';

import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';

export default function BrandList({ manufacturers, selectedManufacturer, onSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [randomSeed, setRandomSeed] = useState(0);
  
  // コンポーネントマウント時にランダムシードを設定
  useEffect(() => {
    setRandomSeed(Math.random());
  }, []);
  
  // 人気ブランドをランダムに選択
  const popularBrands = useMemo(() => {
    if (manufacturers.length <= 8) {
      return manufacturers;
    }
    
    // シード値を使用して一貫性のあるランダム選択を行う
    const seededRandom = (seed, index) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    // インデックスの配列を作成してシャッフル
    const indices = manufacturers.map((_, i) => i);
    const shuffled = [...indices];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(randomSeed, i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // シャッフルしたインデックスから8個のブランドを選択
    return shuffled.slice(0, 8).map(index => manufacturers[index]);
  }, [manufacturers, randomSeed]);
  
  const filteredManufacturers = useMemo(() => {
    if (!searchQuery) return manufacturers;
    return manufacturers.filter(brand => 
      brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [manufacturers, searchQuery]);
  
  const displayedBrands = isExpanded ? filteredManufacturers : popularBrands;

  return (
    <div className="mb-8 px-4 sm:px-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
          ブランドで絞り込む
        </h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          {isExpanded ? '閉じる' : `すべて見る (${manufacturers.length})`}
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>
      
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ブランドを検索..."
                className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-2">
        {/* すべてのブランドボタン */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('')}
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${
            selectedManufacturer === ''
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">🌟</span>
            すべてのブランド
          </span>
          <span className={`text-xs ${selectedManufacturer === '' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {manufacturers.length} ブランド
          </span>
        </motion.button>
        
        {/* ブランドグリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {displayedBrands.map((manufacturer, index) => (
            <motion.button
              key={manufacturer}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(manufacturer)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedManufacturer === manufacturer
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="truncate block">{manufacturer}</span>
            </motion.button>
          ))}
        </div>
        
        {/* 検索結果が0件の場合 */}
        {isExpanded && filteredManufacturers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            <p className="text-sm">「{searchQuery}」に一致するブランドが見つかりません</p>
          </motion.div>
        )}
        
        {/* もっと見るのヒント */}
        {!isExpanded && manufacturers.length > popularBrands.length && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3"
          >
            他に {manufacturers.length - popularBrands.length} ブランドあります
          </motion.p>
        )}
      </div>
    </div>
  );
}
