import { getManufacturers } from '../../../data/shishaData';
import { NextResponse } from 'next/server';

export async function GET() {
  const manufacturers = getManufacturers();
  return NextResponse.json(manufacturers);
}
