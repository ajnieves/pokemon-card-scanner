'use client'

import { useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

interface PokemonCard {
  id: string
  name: string
  number: string
  rarity?: string
  set: {
    name: string
    releaseDate?: string
  }
  images: {
    small: string
    large: string
  }
}

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

  const searchCard = async () => {
    if (!searchInput.trim()) return
    
    setLoading(true)
    setError('')
    setCards([])
    setSelectedCard(null)

    try {
      const response = await fetch(`/api/pokemon?q=${encodeURIComponent(searchInput.trim())}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch card data')
      }
      
      if (data.data && data.data.length > 0) {
        setCards(data.data)
      } else {
        setError('No cards found')
      }
    } catch (err: any) {
      console.error('Search error:', err)
      setError(err.message || 'Error searching for card')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchCard()
    }
  }

  const addToCollection = (card: PokemonCard) => {
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

  const updateQuantity = (cardId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCollectedCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, quantity: newQuantity }
          : card
      )
    )
  }

  const removeFromCollection = (cardId: string) => {
    setCollectedCards(prev => prev.filter(card => card.id !== cardId))
  }

  const getYearFromReleaseDate = (releaseDate?: string) => {
    if (!releaseDate) return 'Unknown'
    const match = releaseDate.match(/^\d{4}/)
    return match ? match[0] : 'Unknown'
  }

  const exportToCSV = (cards: CollectedCard[]) => {
    const csvData = [
      ['Qty', 'Year', 'Brand', 'Card Number', 'Character Name', 'Language', 'Set Name', 'Rarity'].join(','),
      ...cards.map(card => [
        card.quantity,
        getYearFromReleaseDate(card.set.releaseDate),
        'Pokemon',
        card.number,
        card.name,
        'English',
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
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter card name or number (e.g., 'Charizard' or '25/102')"
            className="w-full px-4 py-3 pl-5 pr-16 text-gray-900 placeholder-gray-500 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 outline-none"
          />
          <button
            onClick={searchCard}
            disabled={loading || !searchInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
          >
            {loading ? <LoadingSpinner /> : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Searching for cards...</span>
        </div>
      )}

      {collectedCards.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Collection ({collectedCards.length})
            </h2>
            <button
              onClick={() => exportToCSV(collectedCards)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export to CSV
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectedCards.map((card) => (
              <div 
                key={card.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">{card.name}</h3>
                  <button
                    onClick={() => removeFromCollection(card.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-start space-x-4">
                  {card.images?.small && (
                    <img
                      src={card.images.small}
                      alt={card.name}
                      className="w-24 h-auto rounded-lg shadow-sm"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">#{card.number}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{card.set.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{card.rarity || 'Unknown'}</p>
                    <div className="flex items-center mt-3">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">Qty:</label>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(card.id, card.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-l transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={card.quantity}
                          onChange={(e) => updateQuantity(card.id, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 text-center border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                        <button
                          onClick={() => updateQuantity(card.id, card.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-r transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div 
              key={card.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
              onClick={() => setSelectedCard(card)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">{card.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCollection(card)
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add to Collection
                  </button>
                </div>
                <div className="flex items-start space-x-4">
                  {card.images?.small && (
                    <img
                      src={card.images.small}
                      alt={card.name}
                      className="w-24 h-auto rounded-lg shadow-sm"
                    />
                  )}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">#{card.number}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{card.set.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{card.rarity || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setSelectedCard(null)}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to results
              </button>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCard.name}</h2>
                    <button
                      onClick={() => addToCollection(selectedCard)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add to Collection
                    </button>
                  </div>
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600 dark:text-gray-400">Year</dt>
                      <dd className="text-gray-900 dark:text-white">{getYearFromReleaseDate(selectedCard.set.releaseDate)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600 dark:text-gray-400">Brand</dt>
                      <dd className="text-gray-900 dark:text-white">Pokemon</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600 dark:text-gray-400">Card Number</dt>
                      <dd className="text-gray-900 dark:text-white">{selectedCard.number}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600 dark:text-gray-400">Language</dt>
                      <dd className="text-gray-900 dark:text-white">English</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600 dark:text-gray-400">Set Name</dt>
                      <dd className="text-gray-900 dark:text-white">{selectedCard.set.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600 dark:text-gray-400">Rarity</dt>
                      <dd className="text-gray-900 dark:text-white">{selectedCard.rarity || 'Unknown'}</dd>
                    </div>
                  </dl>
                  <button
                    onClick={() => exportToCSV([{ ...selectedCard, quantity: 1 }])}
                    className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export to CSV
                  </button>
                </div>
                {selectedCard.images?.large && (
                  <div className="flex justify-center items-start">
                    <img
                      src={selectedCard.images.large}
                      alt={selectedCard.name}
                      className="rounded-lg shadow-lg max-w-full h-auto hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
