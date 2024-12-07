'use client'

import { useEffect, useRef } from 'react'
import { PokemonCard } from '../utils/pokemon-tcg'
import ImageLoader from './ImageLoader'

interface CardModalProps {
  card: PokemonCard
  onClose: () => void
  onAdd: (card: PokemonCard) => void
}

export default function CardModal({ card, onClose, onAdd }: CardModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const marketPrice = card.tcgplayer?.prices?.normal?.market || 
                     card.tcgplayer?.prices?.holofoil?.market || 
                     card.tcgplayer?.prices?.reverseHolofoil?.market

  const directLowPrice = card.tcgplayer?.prices?.normal?.directLow || 
                        card.tcgplayer?.prices?.holofoil?.directLow || 
                        card.tcgplayer?.prices?.reverseHolofoil?.directLow

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative w-full max-w-2xl scale-in"
        >
          {/* Modal Content */}
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-white">{card.name}</h2>
                {card.language && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    card.language === 'JPN' 
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {card.language}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Card Image */}
                <div className="relative w-full md:w-1/2">
                  {card.images?.large ? (
                    <ImageLoader
                      src={card.images.large}
                      alt={card.name}
                      className="w-full rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="aspect-[2.5/3.5] bg-slate-700/50 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="w-full md:w-1/2 space-y-4">
                  {/* Set Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Set</h3>
                    <p className="text-white">{card.set.name}</p>
                    <p className="text-sm text-gray-400">
                      {card.number}/{card.set.printedTotal}
                      {card.rarity && ` · ${card.rarity}`}
                    </p>
                  </div>

                  {/* Artist */}
                  {card.artist && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Artist</h3>
                      <p className="text-white">{card.artist}</p>
                    </div>
                  )}

                  {/* Release Date */}
                  {card.set.releaseDate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Release Date</h3>
                      <p className="text-white">
                        {new Date(card.set.releaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Market Prices */}
                  {card.tcgplayer?.prices && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Market Prices</h3>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="card p-2">
                          <p className="text-sm text-gray-400">Market</p>
                          <p className="text-white">${marketPrice?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <div className="card p-2">
                          <p className="text-sm text-gray-400">Direct Low</p>
                          <p className="text-white">${directLowPrice?.toFixed(2) || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700/50">
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => onAdd(card)}
                className="btn btn-primary"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                Add to Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
