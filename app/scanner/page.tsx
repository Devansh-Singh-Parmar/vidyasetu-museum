'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'

interface ArtifactInfo {
  name: string
  description: string
  period: string
  significance: string
  museum?: string
}

// Sample artifact database - in production, this would be a comprehensive database
const artifactDatabase: { [key: string]: ArtifactInfo } = {
  'dancing girl': {
    name: 'Dancing Girl of Mohenjo-daro',
    description: 'A 4,500-year-old bronze statuette from the Indus Valley Civilization, one of the most iconic artifacts of ancient India. This small bronze figure represents a young woman in a dancing pose, showcasing the artistic sophistication of the Harappan civilization.',
    period: '2500 BCE',
    significance: 'Represents the artistic sophistication of the Harappan civilization and is considered one of the finest examples of ancient Indian bronze work.',
    museum: 'National Museum, New Delhi',
  },
  'nataraja': {
    name: 'Chola Bronze Nataraja',
    description: 'A magnificent bronze sculpture of Lord Shiva in his cosmic dance form, created during the Chola dynasty. The sculpture depicts Shiva performing the Tandava dance, symbolizing the cosmic cycles of creation and destruction.',
    period: '11th-12th Century CE',
    significance: 'Exemplifies the pinnacle of Chola bronze artistry and is considered one of the greatest achievements of Indian sculpture.',
    museum: 'National Museum, New Delhi / Government Museum, Chennai',
  },
  'buddha': {
    name: 'Standing Buddha',
    description: 'A serene standing Buddha statue from the Gupta period, representing the golden age of Indian Buddhist art. The sculpture shows Buddha in a graceful pose with characteristic features of Gupta art.',
    period: '5th-6th Century CE',
    significance: 'Represents the peak of Buddhist art in India during the Gupta period, known for its spiritual beauty and technical perfection.',
    museum: 'Sarnath Museum, Varanasi',
  },
  'lion capital': {
    name: 'Lion Capital of Ashoka',
    description: 'The original Lion Capital from the Ashoka Pillar at Sarnath, now the national emblem of India. The capital features four lions standing back to back, symbolizing power and authority.',
    period: '3rd Century BCE',
    significance: 'National symbol of India and masterpiece of Mauryan art, representing one of the earliest examples of Indian stone sculpture.',
    museum: 'Sarnath Museum, Varanasi',
  },
  'veiled rebecca': {
    name: 'Veiled Rebecca',
    description: 'A stunning marble sculpture by Italian artist Giovanni Maria Benzoni, famous for its translucent veil effect. The sculpture demonstrates incredible technical skill in marble carving.',
    period: '1876 CE',
    significance: 'Masterpiece of Italian neoclassical sculpture, showcasing the artist\'s ability to create the illusion of transparency in stone.',
    museum: 'Salar Jung Museum, Hyderabad',
  },
}

export default function ScannerPage() {
  const { user } = useAuth()
  const [model, setModel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ArtifactInfo | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadModel()
  }, [])

  const loadModel = async () => {
    try {
      await tf.ready()
      const mobilenetModel = await mobilenet.load()
      setModel(mobilenetModel)
      setLoading(false)
    } catch (error) {
      console.error('Error loading model:', error)
      setLoading(false)
    }
  }

  const identifyArtifact = async (imageElement: HTMLImageElement | HTMLVideoElement) => {
    if (!model) return

    try {
      setScanning(true)
      const predictions = await model.classify(imageElement)
      
      // Check if any prediction matches known artifacts
      const topPrediction = predictions[0]?.className.toLowerCase() || ''
      
      // Simple keyword matching - in production, use a more sophisticated matching system
      let matchedArtifact: ArtifactInfo | null = null
      
      for (const [key, artifact] of Object.entries(artifactDatabase)) {
        if (topPrediction.includes(key) || key.includes(topPrediction.split(' ')[0])) {
          matchedArtifact = artifact
          break
        }
      }

      // If no direct match, try to find similar artifacts
      if (!matchedArtifact) {
        // Check for common artifact-related keywords
        const artifactKeywords = ['sculpture', 'statue', 'bronze', 'stone', 'marble', 'art', 'figure']
        const hasArtifactKeyword = artifactKeywords.some(keyword => 
          topPrediction.includes(keyword)
        )
        
        if (hasArtifactKeyword) {
          // Return a generic artifact info
          matchedArtifact = {
            name: 'Artifact Detected',
            description: `We detected an artifact in your image. The AI identified it as: "${topPrediction}". While we don't have specific information about this artifact in our database, it appears to be a cultural or artistic object.`,
            period: 'Unknown',
            significance: 'This artifact may be part of India\'s rich cultural heritage. Visit a museum to learn more!',
          }
        }
      }

      setResult(matchedArtifact)
      setScanning(false)
    } catch (error) {
      console.error('Error identifying artifact:', error)
      setScanning(false)
      alert('Error identifying artifact. Please try again.')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      setImageSrc(src)
      setResult(null)
      
      const img = new Image()
      img.onload = () => {
        identifyArtifact(img)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Could not access camera. Please use file upload instead.')
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg')
      setImageSrc(dataUrl)
      setResult(null)
      
      const img = new Image()
      img.onload = () => {
        identifyArtifact(img)
      }
      img.src = dataUrl
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl">Loading AI model...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">Smart Artifact Scanner</h1>
      <p className="text-gray-700 mb-8">
        Take a photo or upload an image of an artifact to learn about its history
      </p>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Capture or Upload Image</h2>
            
            <div className="space-y-4 mb-4">
              <button
                onClick={startCamera}
                className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700"
              >
                📷 Start Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-400 border-2 border-gray-400 transition-colors"
              >
                📁 Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {videoRef.current?.srcObject && (
              <div className="mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <button
                  onClick={capturePhoto}
                  className="w-full mt-2 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
                >
                  📸 Capture Photo
                </button>
              </div>
            )}

            {imageSrc && (
              <div className="mt-4">
                <img
                  src={imageSrc}
                  alt="Captured"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {scanning && (
              <div className="mt-4 text-center">
                <p className="text-lg">🔍 Analyzing artifact...</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Artifact Information</h2>
            {result ? (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2">{result.name}</h3>
                {result.museum && (
                  <p className="text-sm text-gray-700 mb-4 font-medium">📍 {result.museum}</p>
                )}
                <div className="space-y-3">
                  <div>
                    <strong className="text-gray-900">Period:</strong>
                    <p className="text-gray-700">{result.period}</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Description:</strong>
                    <p className="text-gray-700">{result.description}</p>
                  </div>
                  <div>
                    <strong className="text-gray-900">Significance:</strong>
                    <p className="text-gray-700">{result.significance}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-gray-200">
                <p className="text-gray-700">
                  {scanning
                    ? 'Analyzing image...'
                    : 'Upload or capture an image to identify an artifact'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

