import { PokemonCard, formatCardNumber, getCardRarityColor } from '../utils/pokemon-tcg'

interface CollectedCard extends PokemonCard {
  quantity: number
}

interface CollectionProps {
  cards: CollectedCard[]
  onRemove: (cardId: string, e?: React.MouseEvent<Element, MouseEvent>) => void
  onUpdateQuantity: (cardId: string, quantity: number, e?: React.MouseEvent<Element, MouseEvent>) => void
  onExport: (cards: CollectedCard[]) => void
  onCardClick: (card: PokemonCard) => void
}

export default function Collection({ 
  cards, 
  onRemove, 
  onUpdateQuantity, 
  onExport,
  onCardClick 
}: CollectionProps) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {/* Collection Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Collection ({cards.length})
          </h2>
          <button
            onClick={() => onExport(cards)}
            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors active:scale-95"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Collection List */}
      <div className="flex-1 overflow-y-auto">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">
              Your collection is empty. Search for cards to add them here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {cards.map((card) => (
              <div 
                key={card.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group relative"
              >
                <div className="flex items-start space-x-3">
                  {/* Card Image */}
                  <div 
                    className="relative w-16 h-22 shrink-0 cursor-pointer"
                    onClick={() => onCardClick(card)}
                  >
                    <img
                      src={card.images.small}
                      alt={card.name}
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 
                        className="font-medium text-gray-900 dark:text-white truncate cursor-pointer"
                        onClick={() => onCardClick(card)}
                      >
                        {card.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      #{formatCardNumber(card.number)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {card.set.name}
                    </p>
                    <p className={`text-sm ${getCardRarityColor(card.rarity)}`}>
                      {card.rarity || 'Unknown'}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center mt-2">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">Qty:</label>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => onUpdateQuantity(card.id, card.quantity - 1, e)}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={card.quantity}
                          onChange={(e) => onUpdateQuantity(card.id, parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 px-2 py-1 text-center border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                        <button
                          onClick={(e) => onUpdateQuantity(card.id, card.quantity + 1, e)}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-r transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => onRemove(card.id, e)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-600 transition-colors bg-white dark:bg-gray-800 rounded-full shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Remove from collection"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
