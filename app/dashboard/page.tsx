'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import museumsData from '@/data/museums.json'
import ReviewForm from '@/components/ReviewForm'

interface Museum {
  id: number
  name: string
  location: string
  state: string
  image: string
}

interface VisitedMuseum extends Museum {
  date: string
  rating?: number
  notes?: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'wishlist' | 'visited' | 'reviews'>('wishlist')
  const [wishlist, setWishlist] = useState<Museum[]>([])
  const [visited, setVisited] = useState<VisitedMuseum[]>([])
  const [reviews, setReviews] = useState<VisitedMuseum[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      loadUserData()
    }
  }, [user, loading, router])

  const loadUserData = async () => {
    if (!user) return
    
    try {
      const [wishlistRes, visitedRes, reviewsRes] = await Promise.all([
        fetch(`/api/user/wishlist?userId=${user.id}`),
        fetch(`/api/user/visited?userId=${user.id}`),
        fetch(`/api/user/reviews?userId=${user.id}`),
      ])

      if (wishlistRes.ok) {
        const wishlistIds = await wishlistRes.json()
        const wishlistMuseums = museumsData.filter((m) =>
          wishlistIds.includes(m.id)
        ) as Museum[]
        setWishlist(wishlistMuseums)
      }

      if (visitedRes.ok) {
        const visitedData = await visitedRes.json()
        const visitedMuseums = visitedData.map((item: any) => {
          const museum = museumsData.find((m) => m.id === item.museumId) as Museum
          return { ...museum, date: item.date }
        }) as VisitedMuseum[]
        setVisited(visitedMuseums)
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        const reviewMuseums = reviewsData.map((item: any) => {
          const museum = museumsData.find((m) => m.id === item.museumId) as Museum
          return {
            ...museum,
            date: item.date,
            rating: item.rating,
            notes: item.notes,
          }
        }) as VisitedMuseum[]
        setReviews(reviewMuseums)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">My Dashboard</h1>
      <p className="text-gray-700 mb-8">
        Welcome, {user.name}! You have {user.points} points.
      </p>

      <div className="flex gap-4 mb-8 border-b-2 border-gray-300">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'wishlist'
              ? 'border-b-2 border-primary-600 text-primary-600 -mb-0.5'
              : 'text-gray-700 hover:text-primary-500'
          }`}
        >
          Wishlist ({wishlist.length})
        </button>
        <button
          onClick={() => setActiveTab('visited')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'visited'
              ? 'border-b-2 border-primary-600 text-primary-600 -mb-0.5'
              : 'text-gray-700 hover:text-primary-500'
          }`}
        >
          Visited ({visited.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'reviews'
              ? 'border-b-2 border-primary-600 text-primary-600 -mb-0.5'
              : 'text-gray-700 hover:text-primary-500'
          }`}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {activeTab === 'wishlist' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className="text-gray-700">Your wishlist is empty. Start exploring museums!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((museum) => (
                <Link
                  key={museum.id}
                  href={`/museums/${museum.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={museum.image}
                      alt={museum.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{museum.name}</h3>
                    <p className="text-gray-700 text-sm">
                      📍 {museum.location}, {museum.state}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'visited' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Visited Log</h2>
          {visited.length === 0 ? (
            <p className="text-gray-700">You haven't visited any museums yet.</p>
          ) : (
            <div className="space-y-4">
              {visited.map((museum) => {
                const hasReview = reviews.some(r => r.id === museum.id)
                return (
                  <div
                    key={museum.id}
                    className="bg-white rounded-lg shadow-md p-6 flex gap-6"
                  >
                    <div className="relative h-32 w-32 flex-shrink-0">
                      <Image
                        src={museum.image}
                        alt={museum.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/museums/${museum.id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {museum.name}
                      </Link>
                      <p className="text-gray-700 text-sm mb-2">
                        📍 {museum.location}, {museum.state}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Visited on: {new Date(museum.date).toLocaleDateString()}
                      </p>
                      {!hasReview && (
                        <button
                          onClick={() => {
                            setSelectedMuseum(museum)
                            setShowReviewForm(true)
                          }}
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700"
                        >
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Review Diary</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-700">You haven't written any reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((museum) => (
                <div
                  key={museum.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex gap-6 mb-4">
                    <div className="relative h-32 w-32 flex-shrink-0">
                      <Image
                        src={museum.image}
                        alt={museum.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/museums/${museum.id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {museum.name}
                      </Link>
                      <p className="text-gray-700 text-sm mb-2">
                        📍 {museum.location}, {museum.state}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-2xl ${
                                i < (museum.rating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Reviewed on: {new Date(museum.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {museum.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-800">{museum.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showReviewForm && selectedMuseum && (
        <ReviewForm
          museumId={selectedMuseum.id}
          museumName={selectedMuseum.name}
          onClose={() => {
            setShowReviewForm(false)
            setSelectedMuseum(null)
          }}
          onSuccess={() => {
            loadUserData()
          }}
        />
      )}
    </div>
  )
}
