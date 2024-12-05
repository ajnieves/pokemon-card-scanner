'use client'

import { useState, useCallback } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import Collection from './Collection'
import Filters from './Filters'
import CardDetails from './CardDetails'
import CardModal from './CardModal'
import SearchControls from './SearchControls'
import { 
  PokemonCard, 
  formatCardNumber,
  validateSearchResponse
} from '../utils/pokemon-tcg'

interface CollectedCard extends PokemonCard {
  quantity: number
}

type Language = 'en' | 'jpn' | 'all'
type SearchType = 'name' | 'set' | 'artist'

export default function CardScanner() {
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [filteredCards, setFilteredCards] = useState<PokemonCard[]>([])
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null)
  const [collectedCards, setCollectedCards] = useState<CollectedCard[]>([])
  const [showCollection, setShowCollection] = useState(false)
  const [language, setLanguage] = useState<Language>('all')
  const [searchType, setSearchType] = useState<SearchType>('name')

  const searchCard = async () => {
    const query = searchInput.trim()
    if (!query) return
    
    setLoading(true)
    setError('')
    setCards([])
    setFilteredCards([])
    setSelectedCard(null)

    try {
      const params = new URLSearchParams({
        q: query,
        language,
        type: searchType
      })

      const response = await fetch(`/api/pokemon?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search cards')
      }

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format')
      }

      setCards(data.data)
      setFilteredCards(data.data)

      if (data.data.length === 0) {
        const langText = language === 'all' ? '' : 
          language === 'en' ? ' in English cards' : ' in Japanese cards'
        const typeText = searchType === 'name' ? 'card name' :
          searchType === 'set' ? 'set name' : 'illustrator'
        setError(`No cards found matching ${typeText} "${query}"${langText}. Try a different search term.`)
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search cards. Please try again.')
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language)
    if (error) setError('')
    if (searchInput.trim()) {
      searchCard()
    }
  }

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as SearchType)
    if (error) setError('')
  }

  const handleFilterChange = useCallback((filtered: PokemonCard[]) => {
    setFilteredCards(filtered)
  }, [])

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

    if (!showCollection) {
      setShowCollection(true)
    }
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

  const exportToCSV = (cards: CollectedCard[]) => {
    const csvData = [
      ['Qty', 'Name', 'Number', 'Set', 'Rarity', 'Language'].join(','),
      ...cards.map(card => [
        card.quantity,
        card.name,
        formatCardNumber(card.number),
        card.set.name,
        card.rarity || 'Unknown',
        card.language || 'EN'
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
          {/* Search Controls */}
          <SearchControls
            loading={loading}
            searchInput={searchInput}
            language={language}
            searchType={searchType}
            onSearch={searchCard}
            onSearchInputChange={handleSearchInputChange}
            onLanguageChange={handleLanguageChange}
            onSearchTypeChange={handleSearchTypeChange}
            onKeyPress={handleKeyPress}
          />

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

          {/* Filters */}
          {cards.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
              <Filters cards={cards} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Search Results */}
          {filteredCards.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Found {filteredCards.length} cards
                  {filteredCards.length !== cards.length && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      (filtered from {cards.length})
                    </span>
                  )}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCards.map((card) => (
                  <div 
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden touch-manipulation"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate">{card.name}</h3>
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
                        <CardDetails card={card} />
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

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onAdd={(card) => {
            addToCollection(card)
            setSelectedCard(null)
          }}
        />
      )}
    </div>
  )
}
