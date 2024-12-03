'use client'

import { useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import Collection from './Collection'
import { 
  PokemonCard, 
  getCardRarityColor, 
  formatCardNumber,
  validateSearchResponse
} from '../utils/pokemon-tcg'

interface CollectedCard extends PokemonCard {
  quantity: number
}

export default function CardScanner() {
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null)
  const [collectedCards, setCollectedCards] = useState<CollectedCard[]>([])
  const [showCollection, setShowCollection] = useState(true)

  const searchCard = async () => {
    const query = searchInput.trim()
    if (!query) return
    
    setLoading(true)
    setError('')
    setCards([])
    setSelectedCard(null)

    try {
      const response = await fetch(`/api/pokemon?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search cards')
      }

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format')
      }

      setCards(data.data)

      if (data.data.length === 0) {
        setError(`No cards found matching "${query}". Try a different search term.`)
      }
    } catch (err: any) {
      console.error('Search error:', err)
      setError(err.message || 'Failed to search cards')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      searchCard()
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    if (error) setError('')
  }

  const addToCollection = (card: PokemonCard, e?: React.MouseEvent<Element, MouseEvent>) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    setCollectedCards(prev => {
      const existingCard = prev.find(c => c.id === card.id)
      if (existingCard) {
        return prev.map(c => 
          c.id === card.id 
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      }
      return [...prev, { ...card, quantity: 1 }]
    })
  }

  const updateQuantity = (cardId: string, newQuantity: number, e?: React.MouseEvent<Element, MouseEvent>) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (newQuantity < 1) return
    setCollectedCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, quantity: newQuantity }
          : card
      )
    )
  }

  const removeFromCollection = (cardId: string, e?: React.MouseEvent<Element, MouseEvent>) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    setCollectedCards(prev => prev.filter(card => card.id !== cardId))
  }

  const exportToCSV = (cards: CollectedCard[]) => {
    const csvData = [
      ['Qty', 'Name', 'Number', 'Set', 'Rarity'].join(','),
      ...cards.map(card => [
        card.quantity,
        card.name,
        formatCardNumber(card.number),
        card.set.name,
        card.rarity || 'Unknown'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pokemon-cards-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${showCollection ? 'mr-80' : ''}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Search Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for a Pokémon card..."
                  className="w-full px-4 py-3 pl-12 pr-16 text-gray-900 placeholder-gray-500 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={searchCard}
                  disabled={loading || !searchInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      <span className="hidden sm:inline">Searching...</span>
                    </>
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Searching for "{searchInput.trim()}"...
              </span>
            </div>
          )}

          {/* Search Results */}
          {cards.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Found {cards.length} cards
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cards.map((card) => (
                  <div 
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden touch-manipulation"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{card.name}</h3>
                        <button
                          onClick={(e) => addToCollection(card, e)}
                          className="ml-2 shrink-0 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex items-start space-x-4">
                        {card.images?.small && (
                          <div className="relative w-24 h-32 shrink-0 group-hover:scale-105 transition-transform duration-200">
                            <img
                              src={card.images.small}
                              alt={card.name}
                              className="w-full h-full object-cover rounded-lg shadow-sm"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            #{formatCardNumber(card.number)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{card.set.name}</p>
                          <p className={`text-sm ${getCardRarityColor(card.rarity)} truncate`}>
                            {card.rarity || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collection Sidebar */}
      <div 
        className={`fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] transform transition-transform duration-300 ease-in-out ${
          showCollection ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <Collection
          cards={collectedCards}
          onRemove={removeFromCollection}
          onUpdateQuantity={updateQuantity}
          onExport={exportToCSV}
          onCardClick={setSelectedCard}
        />
      </div>

      {/* Toggle Collection Button */}
      <button
        onClick={() => setShowCollection(!showCollection)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${showCollection ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCard(null)}
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
                  onClick={() => setSelectedCard(null)}
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
                      src={selectedCard.images.large || selectedCard.images.small}
                      alt={selectedCard.name}
                      className="w-full sm:w-72 h-auto rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {selectedCard.name}
                    </h3>

                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Number</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          #{formatCardNumber(selectedCard.number)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Set</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {selectedCard.set.name}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Rarity</dt>
                        <dd className={`mt-1 text-sm ${getCardRarityColor(selectedCard.rarity)}`}>
                          {selectedCard.rarity || 'Unknown'}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6">
                      <button
                        onClick={(e) => {
                          addToCollection(selectedCard, e)
                          setSelectedCard(null)
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
      )}
    </div>
  )
}
