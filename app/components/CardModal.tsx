'use client'

import { useEffect, useCallback } from 'react'
import { PokemonCard, getCardRarityColor } from '../utils/pokemon-tcg'
import ImageLoader from './ImageLoader'
import { motion, AnimatePresence } from 'framer-motion'
import type { MouseEvent } from 'react'

interface CardModalProps {
  card: PokemonCard
  onClose: () => void
  onAdd: (card: PokemonCard) => void
}

export default function CardModal({ card, onClose, onAdd }: CardModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'Enter') {
      onAdd(card)
      onClose()
    }
  }, [card, onClose, onAdd])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [handleKeyDown])

  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#1a1f2e]/95" />

        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-[#1a1f2e] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            onClick={handleModalClick}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-300 z-10"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Content */}
            <div className="flex p-6 gap-6">
              {/* Card Image */}
              <div className="flex-1 flex items-center justify-center max-w-[400px]">
                {card.images?.large ? (
                  <ImageLoader
                    src={card.images.large}
                    alt={card.name}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                ) : card.images?.small ? (
                  <ImageLoader
                    src={card.images.small}
                    alt={card.name}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="aspect-[2.5/3.5] w-full bg-gray-800/50 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              {/* Details Panel */}
              <div className="w-72 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{card.name}</h2>
                  {card.language && (
                    <span className="px-2 py-0.5 text-sm bg-blue-600 text-white rounded">
                      {card.language}
                    </span>
                  )}
                </div>

                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-400">Number</dt>
                    <dd className="text-white">#{card.number.padStart(3, '0')}</dd>
                  </div>

                  <div>
                    <dt className="text-sm text-gray-400">Set</dt>
                    <dd className="text-white">{card.set.name}</dd>
                  </div>

                  {card.rarity && (
                    <div>
                      <dt className="text-sm text-gray-400">Rarity</dt>
                      <dd className="text-white">{card.rarity}</dd>
                    </div>
                  )}

                  {card.artist && (
                    <div>
                      <dt className="text-sm text-gray-400">Illustrator</dt>
                      <dd className="text-white">{card.artist}</dd>
                    </div>
                  )}

                  {card.set.releaseDate && (
                    <div>
                      <dt className="text-sm text-gray-400">Release Date</dt>
                      <dd className="text-white">{new Date(card.set.releaseDate).toLocaleDateString()}</dd>
                    </div>
                  )}
                </dl>

                {/* Actions */}
                <div className="mt-auto space-y-2">
                  <button
                    onClick={() => {
                      onAdd(card)
                      onClose()
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Add to Collection
                  </button>

                  {/* Keyboard Shortcuts */}
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Enter</kbd>
                      <span>to add</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Esc</kbd>
                      <span>to close</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
