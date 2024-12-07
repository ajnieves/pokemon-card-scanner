'use client'

import { PokemonCard } from '../utils/pokemon-tcg'
import ImageLoader from './ImageLoader'

interface CollectionProps {
  cards: Array<PokemonCard & { quantity: number }>
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onExport: (cards: Array<PokemonCard & { quantity: number }>) => void
  onCardClick: (card: PokemonCard) => void
}

export default function Collection({
  cards,
  onRemove,
  onUpdateQuantity,
  onExport,
  onCardClick
}: CollectionProps) {
  const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0)
  const totalValue = cards.reduce((sum, card) => {
    const price = card.tcgplayer?.prices?.normal?.market || 
                 card.tcgplayer?.prices?.holofoil?.market || 
                 card.tcgplayer?.prices?.reverseHolofoil?.market || 0
    return sum + (price * card.quantity)
  }, 0)

  return (
    <div className="h-full flex flex-col bg-slate-800/95 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Collection</h2>
          <div className="text-sm text-gray-400">
            {cards.length} unique ({totalCards} total)
          </div>
        </div>

        {cards.length > 0 && (
          <div className="space-y-2">
            {totalValue > 0 && (
              <div className="card p-3">
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-lg font-semibold text-white">${totalValue.toFixed(2)}</p>
              </div>
            )}
            <button
              onClick={() => onExport(cards)}
              className="btn btn-secondary w-full"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                />
              </svg>
              Export to CSV
            </button>
          </div>
        )}
      </div>

      {/* Card List */}
      <div className="flex-1 overflow-y-auto">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg 
              className="w-16 h-16 text-gray-600 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
            <p className="text-gray-400">
              Your collection is empty. Click the "Add" button on a card to start collecting!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {cards.map((card) => (
              <div 
                key={card.id}
                className="p-4 hover:bg-slate-700/30 transition-colors duration-200"
              >
                <div className="flex items-start space-x-3">
                  {/* Card Image */}
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => onCardClick(card)}
                  >
                    {card.images?.small && (
                      <ImageLoader
                        src={card.images.small}
                        alt={card.name}
                        className="w-16 h-22 rounded shadow-lg group-hover:scale-105 transition-transform duration-200"
                      />
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 
                          className="font-medium text-white truncate cursor-pointer hover:text-blue-400 transition-colors"
                          onClick={() => onCardClick(card)}
                        >
                          {card.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {card.set.name} · {card.number}/{card.set.printedTotal}
                        </p>
                        {card.tcgplayer?.prices && (
                          <p className="text-sm text-gray-400">
                            ${((card.tcgplayer.prices.normal?.market || 
                               card.tcgplayer.prices.holofoil?.market || 
                               card.tcgplayer.prices.reverseHolofoil?.market || 0) * 
                               card.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemove(card.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        aria-label="Remove from collection"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(card.id, card.quantity - 1)}
                        className="btn btn-secondary !p-1"
                        disabled={card.quantity <= 1}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M20 12H4" 
                          />
                        </svg>
                      </button>
                      <span className="text-sm text-gray-300 w-8 text-center">
                        {card.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(card.id, card.quantity + 1)}
                        className="btn btn-secondary !p-1"
                      >
                        <svg 
                          className="w-4 h-4" 
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
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
