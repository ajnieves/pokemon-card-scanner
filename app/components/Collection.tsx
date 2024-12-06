'use client'

import { PokemonCard, formatCardNumber } from '../utils/pokemon-tcg'
import CardDetails from './CardDetails'
import ImageLoader from './ImageLoader'

interface CollectionProps {
  cards: (PokemonCard & { quantity: number })[]
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onExport: (cards: (PokemonCard & { quantity: number })[]) => void
  onCardClick: (card: PokemonCard) => void
}

export default function Collection({ cards, onRemove, onUpdateQuantity, onExport, onCardClick }: CollectionProps) {
  return (
    <div className="h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Collection</h2>
        {cards.length > 0 && (
          <button
            onClick={() => onExport(cards)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export CSV
          </button>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Your collection is empty. Add some cards!
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => onCardClick(card)}
              className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer relative"
            >
              <div className="flex gap-3">
                {card.images?.small && (
                  <ImageLoader
                    src={card.images.small}
                    alt={card.name}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{card.name}</h3>
                    {card.language && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        card.language === 'JPN' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {card.language}
                      </span>
                    )}
                  </div>
                  <CardDetails card={card} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdateQuantity(card.id, card.quantity - 1)
                      }}
                      className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-gray-900 dark:text-white font-medium min-w-[1.5rem] text-center">
                      {card.quantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdateQuantity(card.id, card.quantity + 1)
                      }}
                      className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(card.id)
                    }}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
