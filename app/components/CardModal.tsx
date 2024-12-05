import { PokemonCard, getCardRarityColor } from '../utils/pokemon-tcg'

interface CardModalProps {
  card: PokemonCard
  onClose: () => void
  onAdd: (card: PokemonCard) => void
}

export default function CardModal({ card, onClose, onAdd }: CardModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" 
          aria-hidden="true"
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Card Image */}
              <div className="flex-shrink-0">
                <img
                  src={card.images.large || card.images.small}
                  alt={card.name}
                  className="w-full sm:w-72 h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Card Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.name}
                  </h3>
                  {card.language && (
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      card.language === 'JPN' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {card.language}
                    </span>
                  )}
                </div>

                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Number</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      #{card.number.padStart(3, '0')}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Set</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {card.set.name}
                    </dd>
                  </div>

                  {card.rarity && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Rarity</dt>
                      <dd className={`mt-1 text-sm ${getCardRarityColor(card.rarity)}`}>
                        {card.rarity}
                      </dd>
                    </div>
                  )}

                  {card.artist && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Illustrator</dt>
                      <dd className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                        {card.artist}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onAdd(card)
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
                  >
                    Add to Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
