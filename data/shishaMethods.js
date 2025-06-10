import { shishaData } from './shishaData';
import { normalizeBrandName, getUniqueBrands, normalizeBrandForSearch } from '../lib/utils/brandNormalizer';

export function searchFlavors({ query = '', manufacturer = '', page = 1, limit = 12 }) {
  let filteredData = [...shishaData];

  // Filter by search query
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.productName.toLowerCase().includes(searchTerm) ||
      item.manufacturer.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
    );
  }

  // Filter by manufacturer (大文字小文字を無視して比較)
  if (manufacturer) {
    const normalizedSearchBrand = normalizeBrandForSearch(manufacturer);
    filteredData = filteredData.filter(item => {
      const normalizedItemBrand = normalizeBrandForSearch(item.manufacturer);
      return normalizedItemBrand === normalizedSearchBrand;
    });
  }

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    items: paginatedData,
    total: filteredData.length,
    page,
    totalPages: Math.ceil(filteredData.length / limit)
  };
}

export function getManufacturers() {
  const manufacturers = shishaData.map(item => item.manufacturer);
  return getUniqueBrands(manufacturers);
}
