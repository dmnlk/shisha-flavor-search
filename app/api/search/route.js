import { NextResponse } from 'next/server';
import { shishaData } from '../../../data/shishaData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const manufacturer = searchParams.get('manufacturer') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const itemsPerPage = 12;

  try {
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
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredData.slice(startIndex, endIndex);

    return NextResponse.json({
      items: paginatedItems,
      totalPages,
      currentPage: page,
      totalItems
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
