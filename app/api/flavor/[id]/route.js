import { NextResponse } from 'next/server';

import { shishaData } from '../../../../data/shishaData';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const flavor = shishaData.find(item => item.id === parseInt(id));
    
    if (!flavor) {
      return NextResponse.json(
        { error: 'Flavor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(flavor);
  } catch (error) {
    console.error('Error fetching flavor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flavor' },
      { status: 500 }
    );
  }
}
