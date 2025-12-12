import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Museum Guide India
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Discover India's Rich Heritage and Track Your Cultural Journey
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/museums"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Explore Museums
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
          >
            My Dashboard
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">🏛️</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Museum Directory</h3>
          <p className="text-gray-700">
            Explore over 15 museums across India with detailed information about exhibits, timings, and ticket prices.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Artifact Scanner</h3>
          <p className="text-gray-700">
            Use AI-powered image recognition to identify artifacts and learn their history instantly.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Track Your Journey</h3>
          <p className="text-gray-700">
            Maintain wishlists, log visits, and write reviews to document your cultural exploration.
          </p>
        </div>
      </div>
    </div>
  )
}

