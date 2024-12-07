'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageLoaderProps {
  src: string
  alt: string
  className?: string
}

export default function ImageLoader({ src, alt, className = '' }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    // Try loading without _hires suffix if it fails
    if (imgSrc.includes('_hires')) {
      setImgSrc(imgSrc.replace('_hires', ''))
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-700/50 animate-pulse rounded-lg" />
      )}

      {/* Error State */}
      {hasError && !imgSrc.includes('_hires') && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg">
          <div className="text-center p-2">
            <svg 
              className="w-8 h-8 mx-auto text-gray-500 mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-xs text-gray-400">Image not available</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  )
}
