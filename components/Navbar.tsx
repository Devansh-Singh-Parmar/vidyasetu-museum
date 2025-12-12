'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            🏛️ Museum Guide India
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/museums" className="text-gray-800 hover:text-primary-600 font-medium transition-colors">
              Museums
            </Link>
            <Link href="/scanner" className="text-gray-800 hover:text-primary-600 font-medium transition-colors">
              Scanner
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-800 hover:text-primary-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700 font-medium">
                    {user.name} ({user.points} pts)
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-800 hover:text-primary-600 font-medium transition-colors">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

