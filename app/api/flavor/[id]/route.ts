import { NextRequest, NextResponse } from 'next/server'

import { shishaData } from '../../../../data/shishaData'
import type { ShishaFlavor } from '../../../../types/shisha'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ShishaFlavor | { error: string }>> {
  try {
    const { id } = await params
    const flavor = shishaData.find(item => item.id === parseInt(id))
    
    if (!flavor) {
      return NextResponse.json(
        { error: 'Flavor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(flavor)
  } catch (error) {
    console.error('Error fetching flavor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flavor' },
      { status: 500 }
    )
  }
}