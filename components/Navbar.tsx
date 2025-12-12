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
    <nav className="bg-gradient-to-r from-primary-700 via-pink-500 to-orange-400 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold drop-shadow-sm">
            🏛️ Museum Guide India
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/museums" className="font-medium transition-colors hover:text-yellow-100">
              Museums
            </Link>
            <Link href="/scanner" className="font-medium transition-colors hover:text-yellow-100">
              Scanner
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="font-medium transition-colors hover:text-yellow-100">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                    {user.name} ({user.points} pts)
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-primary-700 px-4 py-2 rounded font-semibold hover:bg-yellow-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="font-medium transition-colors hover:text-yellow-100">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-primary-700 px-4 py-2 rounded font-semibold hover:bg-yellow-100 transition-colors"
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

