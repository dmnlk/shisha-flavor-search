import { getManufacturers } from '../../../data/shishaMethods';
import { NextResponse } from 'next/server';

export async function GET() {
  const manufacturers = getManufacturers();
  return NextResponse.json(manufacturers);
}
