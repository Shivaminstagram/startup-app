import React, { useEffect, useState } from 'react'
import { Network } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 3500)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center z-50 transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-6 px-4">
        {/* Logo Animation */}
        <div className="flex justify-center">
          <div className="animate-bounce">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-full">
              <Network size={48} className="text-white" />
            </div>
          </div>
        </div>

        {/* App Title */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Startup Network
          </h1>
          <p className="text-blue-100 text-lg">Connect & Collaborate</p>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2 h-8">
          <div className="h-2 w-2 bg-white/60 rounded-full animate-pulse"></div>
          <div
            className="h-2 w-2 bg-white/60 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="h-2 w-2 bg-white/60 rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>

        {/* Credit - Appears at the end */}
        <div
          className={`transition-opacity duration-700 ${
            fadeOut ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-white/80 text-sm">
            Created by <span className="font-semibold text-white">Shivam Sharma</span>
          </p>
        </div>
      </div>
    </div>
  )
}
