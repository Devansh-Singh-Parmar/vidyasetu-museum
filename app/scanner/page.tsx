'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface ArtifactInfo {
  name: string
  description: string
  period: string
  significance: string
  museum?: string
  materials?: string
  artist?: string
  isArtifact?: boolean
}

export default function ScannerPage() {
  const { user } = useAuth()
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ArtifactInfo | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const identifyArtifact = async (imageDataUrl: string) => {
    try {
      setScanning(true)
      setError(null)
      setResult(null)

      const response = await fetch('/api/scanner/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: imageDataUrl }),
      })

      if (!response.ok) {
        let message = 'Failed to identify artifact'
        try {
          const errorData = await response.json()
          message = errorData.error || message
        } catch {
          // noop
        }
        if (response.status === 404) {
          message = 'Scanner API not found. Restart dev server and retry.'
        }
        throw new Error(message)
      }

      const artifactInfo: ArtifactInfo = await response.json()

      if (artifactInfo.isArtifact === false) {
        setError('This doesn\'t appear to be an artifact or historical object. Please try with an image of a sculpture, painting, or artifact.')
        setResult(null)
      } else {
        setResult(artifactInfo)
      }
    } catch (error: any) {
      console.error('Error identifying artifact:', error)
      setError(error.message || 'Failed to identify artifact. Please try again.')
      setResult(null)
    } finally {
      setScanning(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Stop camera if active
    if (cameraActive) {
      stopCamera()
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      if (!src) {
        setError('Error reading file. Please try again.')
        return
      }
      
      setImageSrc(src)
      setResult(null)
      setCameraError(null)
      setError(null)
      
      // Identify artifact
      identifyArtifact(src)
    }
    reader.onerror = () => {
      setError('Error reading file. Please try again.')
    }
    reader.readAsDataURL(file)
    
    // Reset file input so same file can be selected again
    e.target.value = ''
  }

  const startCamera = async () => {
    try {
      setCameraError(null)
      setError(null)
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        setImageSrc(null) // Clear any previous image
        setResult(null) // Clear any previous result
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error('Error playing video:', err)
            setCameraError('Error starting camera preview')
          })
        }
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error)
      let errorMessage = 'Could not access camera. '
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.'
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on your device.'
      } else {
        errorMessage += error.message || 'Please check permissions and try again.'
      }
      setCameraError(errorMessage)
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    setCameraError(null)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) {
      setError('Please start the camera first')
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Camera is not ready yet. Please wait a moment.')
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      setImageSrc(dataUrl)
      setResult(null)
      setError(null)
      
      // Identify artifact
      identifyArtifact(dataUrl)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Artifact scanner</h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Snap or upload. We’ll give you a quick, human read on what you’re looking at.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image Capture */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📸</span>
                Capture or upload
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="col-span-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">📷</span>
                    Start Camera
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="col-span-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">🛑</span>
                    Stop Camera
                  </button>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="col-span-2 bg-gray-50 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 border border-gray-200 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <span className="text-xl">📁</span>
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Error Messages */}
              {(cameraError || error) && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">{cameraError || error}</p>
                </div>
              )}

              {/* Camera Preview */}
              {cameraActive && (
                <div className="mb-4 space-y-3">
                  <div className="relative rounded-lg overflow-hidden border-4 border-primary-500 shadow-lg">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-auto bg-gray-900"
                    />
                    <div className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none"></div>
                  </div>
                  <button
                    onClick={capturePhoto}
                    disabled={scanning}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">📸</span>
                    {scanning ? 'Analyzing...' : 'Capture & Analyze'}
                  </button>
                </div>
              )}

              {/* Captured/Uploaded Image */}
              {imageSrc && !cameraActive && (
                <div className="mb-4">
                  <div className="relative rounded-lg overflow-hidden border-4 border-gray-300 shadow-lg">
                    <img
                      src={imageSrc}
                      alt="Captured"
                      className="w-full h-auto"
                    />
                    {scanning && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                          <p className="text-lg font-semibold">🔍 Analyzing artifact...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scanning Indicator */}
              {scanning && !imageSrc && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-lg font-semibold text-gray-700">🔍 Analyzing artifact...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-3xl">📜</span>
              Artifact Information
            </h2>
            
            {result ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border-2 border-blue-200">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-gray-900">{result.name}</h3>
                    {result.museum && (
                      <p className="text-sm text-gray-700 mb-3 font-medium flex items-center gap-1">
                        <span>📍</span>
                        {result.museum}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {result.period && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <strong className="text-gray-900 block mb-1 text-sm font-semibold uppercase tracking-wide">Period</strong>
                        <p className="text-gray-700 text-lg font-medium">{result.period}</p>
                      </div>
                    )}
                    {result.materials && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <strong className="text-gray-900 block mb-1 text-sm font-semibold uppercase tracking-wide">Materials</strong>
                        <p className="text-gray-700 text-lg font-medium">{result.materials}</p>
                      </div>
                    )}
                    {result.artist && (
                      <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                        <strong className="text-gray-900 block mb-1 text-sm font-semibold uppercase tracking-wide">Artist/Creator</strong>
                        <p className="text-gray-700 text-lg font-medium">{result.artist}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <strong className="text-gray-900 block mb-2 text-sm font-semibold uppercase tracking-wide">Description</strong>
                    <p className="text-gray-700 leading-relaxed">{result.description}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <strong className="text-gray-900 block mb-2 text-sm font-semibold uppercase tracking-wide">Historical Significance</strong>
                    <p className="text-gray-700 leading-relaxed">{result.significance}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 text-center border-2 border-gray-200 shadow-inner">
                <div className="text-6xl mb-4">🏛️</div>
                <p className="text-gray-600 text-lg font-medium">
                  {scanning
                    ? 'Analyzing image...'
                    : 'Add a quick photo to get a short story about the piece.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      {!result && !scanning && (
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
            <span>💡</span>
            Quick tips
          </h3>
          <ul className="grid md:grid-cols-2 gap-2 text-gray-700 text-sm">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Good light and a steady hand help.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Try to fit the full piece in frame.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Works best for sculptures, paintings, objects.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Need more? Upload again from a clearer angle.</span>
            </li>
          </ul>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
