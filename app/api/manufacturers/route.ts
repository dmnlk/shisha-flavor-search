import { NextResponse } from 'next/server'

import { getManufacturers } from '../../../data/shishaMethods'

export async function GET(): Promise<NextResponse<string[]>> {
  const manufacturers = getManufacturers()
  return NextResponse.json(manufacturers)
}