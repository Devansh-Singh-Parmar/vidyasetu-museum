import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <p className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-3">
          India’s museums, in one place
        </p>
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Museum Guide India</h1>
        <p className="text-lg text-gray-700 mb-6">
          Find great stops, scan artifacts, and keep a light diary of where you’ve been.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/museums"
            className="bg-primary-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Explore museums
          </Link>
          <Link
            href="/scanner"
            className="bg-white text-primary-700 px-7 py-3 rounded-lg font-semibold border-2 border-primary-200 hover:bg-primary-50 transition-colors"
          >
            Open scanner
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-gray-900 px-7 py-3 rounded-lg font-semibold border-2 border-gray-200 hover:bg-gray-100 transition-colors hidden sm:inline-block"
          >
            My space
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-3xl mb-3">🏛️</div>
          <h3 className="text-lg font-semibold mb-1 text-gray-900">Quick directory</h3>
          <p className="text-gray-700 text-sm">
            Browse 15+ museums with hours, tickets, and highlights in two taps.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-3xl mb-3">📸</div>
          <h3 className="text-lg font-semibold mb-1 text-gray-900">AI scanner</h3>
          <p className="text-gray-700 text-sm">
            Snap an artifact and get a short, friendly explainer in seconds.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold mb-1 text-gray-900">Your trail</h3>
          <p className="text-gray-700 text-sm">
            Save wishlists, mark visits, and jot quick notes you’ll actually read later.
          </p>
        </div>
      </div>
    </div>
  )
}

