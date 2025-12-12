import { NextRequest, NextResponse } from 'next/server'
import { getMuseumStatus } from '@/lib/users'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const museumId = parseInt(request.nextUrl.searchParams.get('museumId') || '0')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    if (!museumId) {
      return NextResponse.json(
        { error: 'Museum ID required' },
        { status: 400 }
      )
    }

    const status = getMuseumStatus(userId, museumId)
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error fetching museum status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

