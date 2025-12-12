import { NextRequest, NextResponse } from 'next/server'
import { updateUserWishlist, getUserWishlist } from '@/lib/users'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    const wishlist = getUserWishlist(userId)
    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { museumId, action, userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      )
    }

    if (!museumId || !action) {
      return NextResponse.json(
        { error: 'Missing museumId or action' },
        { status: 400 }
      )
    }

    const success = updateUserWishlist(userId, museumId, action)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update wishlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

