'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import museumsData from '@/data/museums.json'

interface Museum {
  id: number
  name: string
  location: string
  state: string
  description: string
  image: string
}

export default function MuseumsPage() {
  const [museums, setMuseums] = useState<Museum[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterState, setFilterState] = useState('')

  useEffect(() => {
    setMuseums(museumsData as Museum[])
  }, [])

  const filteredMuseums = museums.filter((museum) => {
    const matchesSearch =
      museum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      museum.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      museum.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = !filterState || museum.state === filterState
    return matchesSearch && matchesState
  })

  const states = Array.from(new Set(museums.map((m) => m.state))).sort()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Museum Directory</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search museums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
        />
        <select
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
          className="px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMuseums.map((museum) => (
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
              <p className="text-gray-700 text-sm mb-2">
                📍 {museum.location}, {museum.state}
              </p>
              <p className="text-gray-800 text-sm line-clamp-3">
                {museum.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredMuseums.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-700 text-lg">No museums found matching your search.</p>
        </div>
      )}
    </div>
  )
}

