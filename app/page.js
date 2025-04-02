'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import ShishaCard from '../components/ShishaCard';
import BrandList from '../components/BrandList';

export default function Home() {
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchManufacturers = async () => {
      try {
        const response = await fetch('/api/manufacturers');
        const data = await response.json();
        setManufacturers(data);
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
      }
    };
    fetchManufacturers();
  }, []);

  const handleSearch = async ({ query = '', manufacturer = undefined }) => {
    try {
      setLoading(true);
      setSearchQuery(query);
      
      // Only include manufacturer in query params if it's not empty
      const queryParams = new URLSearchParams({
        query,
        page: currentPage.toString()
      });
      
      // Add manufacturer to query params only if it's provided and not empty
      if (manufacturer !== undefined) {
        if (manufacturer) {
          queryParams.append('manufacturer', manufacturer);
        }
      } else if (selectedManufacturer) {
        queryParams.append('manufacturer', selectedManufacturer);
      }
      
      const response = await fetch(`/api/search?${queryParams}`);
      const data = await response.json();
      
      setFlavors(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManufacturerSelect = (manufacturer) => {
    // Reset to page 1 when changing manufacturer
    setCurrentPage(1);
    // Update selected manufacturer (empty string for "All Brands")
    setSelectedManufacturer(manufacturer);
    // Perform search with new manufacturer
    handleSearch({ 
      query: searchQuery, 
      manufacturer,
      page: 1 
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleSearch({ query: searchQuery, manufacturer: selectedManufacturer });
  };

  // Initial load
  useEffect(() => {
    handleSearch({});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Shisha Flavor Search
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover your perfect shisha flavor from our extensive collection
          </p>
        </motion.div>
        
        <SearchBar 
          onSearch={(params) => handleSearch({ query: params.query })} 
          manufacturers={manufacturers} 
        />
        
        <BrandList 
          manufacturers={manufacturers}
          selectedManufacturer={selectedManufacturer}
          onSelect={handleManufacturerSelect}
        />
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {flavors.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {flavors.map((flavor, index) => (
                      <ShishaCard 
                        key={flavor.id} 
                        flavor={flavor} 
                        index={index}
                        onManufacturerClick={handleManufacturerSelect}
                      />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                      {/* Previous button */}
                      {currentPage > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          ←
                        </motion.button>
                      )}

                      {/* First page */}
                      {currentPage > 2 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(1)}
                          className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          1
                        </motion.button>
                      )}

                      {/* Ellipsis */}
                      {currentPage > 3 && (
                        <span className="px-4 py-2">...</span>
                      )}

                      {/* Current page and neighbors */}
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        if (
                          pageNumber === currentPage ||
                          pageNumber === currentPage - 1 ||
                          pageNumber === currentPage + 1
                        ) {
                          return (
                            <motion.button
                              key={i}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-white text-gray-700 hover:bg-primary-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                              } shadow-sm`}
                            >
                              {pageNumber}
                            </motion.button>
                          );
                        }
                        return null;
                      })}

                      {/* Ellipsis */}
                      {currentPage < totalPages - 2 && (
                        <span className="px-4 py-2">...</span>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 1 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(totalPages)}
                          className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          {totalPages}
                        </motion.button>
                      )}

                      {/* Next button */}
                      {currentPage < totalPages && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-primary-50 shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          →
                        </motion.button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No flavors found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
