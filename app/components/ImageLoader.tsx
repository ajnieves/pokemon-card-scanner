'use client'

import { useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

interface ImageLoaderProps {
  src: string
  alt: string
  className?: string
}

export default function ImageLoader({ src, alt, className = '' }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError(true)
  }

  return (
    <div className="relative w-24 h-32 shrink-0 group-hover:scale-105 transition-transform duration-200">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <LoadingSpinner />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm text-center p-2">
          Failed to load image
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover rounded-lg shadow-sm transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}
