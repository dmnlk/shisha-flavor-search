import { shishaData } from './shishaData';

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

  // Filter by manufacturer
  if (manufacturer) {
    filteredData = filteredData.filter(item =>
      item.manufacturer.toLowerCase() === manufacturer.toLowerCase()
    );
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
  const manufacturers = new Set(shishaData.map(item => item.manufacturer));
  return Array.from(manufacturers).sort();
}
