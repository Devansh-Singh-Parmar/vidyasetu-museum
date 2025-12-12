'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import museumsData from '@/data/museums.json'
import { useAuth } from '@/contexts/AuthContext'

interface Exhibit {
  name: string
  description: string
  image: string
  period: string
  significance: string
}

interface Museum {
  id: number
  name: string
  location: string
  state: string
  description: string
  openingHours: string
  ticketPrice: string
  image: string
  topExhibits: Exhibit[]
}

export default function MuseumProfilePage() {
  const params = useParams()
  const { user } = useAuth()
  const [museum, setMuseum] = useState<Museum | null>(null)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isVisited, setIsVisited] = useState(false)

  useEffect(() => {
    const museumId = parseInt(params.id as string)
    const foundMuseum = museumsData.find((m) => m.id === museumId) as Museum | undefined
    if (foundMuseum) {
      setMuseum(foundMuseum)
      checkUserData(museumId)
    }
  }, [params.id])

  const checkUserData = async (museumId: number) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/user/museum-status?museumId=${museumId}&userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setIsInWishlist(data.inWishlist)
        setIsVisited(data.isVisited)
      }
    } catch (error) {
      console.error('Error checking user data:', error)
    }
  }

  const toggleWishlist = async () => {
    if (!user) {
      alert('Please login to add to wishlist')
      return
    }
    
    try {
      const response = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          museumId: museum?.id, 
          action: isInWishlist ? 'remove' : 'add',
          userId: user.id 
        }),
      })
      
      if (response.ok) {
        setIsInWishlist(!isInWishlist)
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
    }
  }

  const markAsVisited = async () => {
    if (!user) {
      alert('Please login to mark as visited')
      return
    }
    
    try {
      const response = await fetch('/api/user/visited', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          museumId: museum?.id, 
          date: new Date().toISOString(),
          userId: user.id 
        }),
      })
      
      if (response.ok) {
        setIsVisited(true)
      }
    } catch (error) {
      console.error('Error marking as visited:', error)
    }
  }

  if (!museum) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-700">Museum not found</p>
        <Link href="/museums" className="text-primary-600 hover:underline mt-4 inline-block font-medium">
          Back to Museums
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/museums" className="text-primary-600 hover:underline mb-4 inline-block font-medium">
        ← Back to Museums
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={museum.image}
            alt={museum.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900">{museum.name}</h1>
              <p className="text-gray-700 text-lg">
                📍 {museum.location}, {museum.state}
              </p>
            </div>
            {user && (
              <div className="flex gap-2">
                <button
                  onClick={toggleWishlist}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isInWishlist
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-300 text-gray-900 hover:bg-gray-400 border-2 border-gray-400'
                  }`}
                >
                  {isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>
                {!isVisited && (
                  <button
                    onClick={markAsVisited}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
                  >
                    ✓ Mark Visited
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-6 text-lg">{museum.description}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🕐 Opening Hours</h3>
              <p className="text-gray-700">{museum.openingHours}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💰 Ticket Price</h3>
              <p className="text-gray-700">{museum.ticketPrice}</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Top 5 Exhibits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {museum.topExhibits.map((exhibit, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="relative h-48 w-full">
                  <Image
                    src={exhibit.image}
                    alt={exhibit.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{exhibit.name}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Period:</strong> {exhibit.period}
                  </p>
                  <p className="text-gray-800 text-sm mb-2">{exhibit.description}</p>
                  <p className="text-xs text-gray-700 italic">
                    <strong>Significance:</strong> {exhibit.significance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

