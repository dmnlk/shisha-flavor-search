import { NextResponse } from 'next/server';
import { shishaData } from '../../../data/shishaData';
import { searchFlavors } from '../../../data/shishaMethods';

export async function GET(request) {
  try {
    // Safely parse URL parameters with validation
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Get and validate parameters
    const query = searchParams.get('query') || '';
    const manufacturer = searchParams.get('manufacturer') || '';
    const pageParam = searchParams.get('page');
    const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
    
    if (isNaN(page)) {
      return NextResponse.json(
        { error: 'Invalid page parameter' },
        { status: 400 }
      );
    }

    const itemsPerPage = 12;

    // Start with all data
    let filteredData = [...shishaData];

    // Filter by manufacturer if specified
    if (manufacturer) {
      filteredData = filteredData.filter(item => 
        item.manufacturer.toLowerCase() === manufacturer.toLowerCase()
      );
    }

    // Then apply search query if specified
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      filteredData = filteredData.filter(item => {
        const searchText = `${item.manufacturer} ${item.productName} ${item.description}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      });
    }

    // Calculate pagination
    const totalItems = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const validPage = Math.min(page, totalPages); // Ensure page doesn't exceed total pages
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedItems = filteredData.slice(startIndex, endIndex);

    return NextResponse.json({
      items: paginatedItems,
      totalPages,
      currentPage: validPage,
      totalItems
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
