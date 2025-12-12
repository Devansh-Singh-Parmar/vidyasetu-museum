import { NextRequest, NextResponse } from 'next/server'
import { addVisitedMuseum, getUserVisited } from '@/lib/users'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    const visited = getUserVisited(userId)
    return NextResponse.json(visited)
  } catch (error) {
    console.error('Error fetching visited museums:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { museumId, date, userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    if (!museumId) {
      return NextResponse.json(
        { error: 'Missing museumId' },
        { status: 400 }
      )
    }

    const visitDate = date || new Date().toISOString()
    const success = addVisitedMuseum(userId, museumId, visitDate)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to add visited museum' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding visited museum:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

