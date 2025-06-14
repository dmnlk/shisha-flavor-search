import { NextResponse } from 'next/server';

import { getManufacturers } from '../../../data/shishaMethods';

export async function GET() {
  const manufacturers = getManufacturers();
  return NextResponse.json(manufacturers);
}
