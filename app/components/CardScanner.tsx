'use client'

import { useState, useCallback } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import Collection from './Collection'
import Filters from './Filters'
import CardDetails from './CardDetails'
import CardModal from './CardModal'
import SearchControls from './SearchControls'
import ImageLoader from './ImageLoader'
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

  const searchCard = useCallback(async () => {
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

      const processedCards = data.data.map((card: PokemonCard) => {
        if (card.images) {
          if (card.images.large && !card.images.large.endsWith('_hires.png')) {
            card.images.large = card.images.large.replace('.png', '_hires.png')
          }
        }
        return card
      })

      setCards(processedCards)
      setFilteredCards(processedCards)

      if (processedCards.length === 0) {
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
  }, [searchInput, language, searchType])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      e.preventDefault()
      searchCard()
    }
  }, [searchInput, searchCard])

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    if (error) setError('')
  }, [error])

  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language)
    if (error) setError('')
  }, [error])

  const handleSearchTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as SearchType)
    if (error) setError('')
  }, [error])

  const handleFilterChange = useCallback((filtered: PokemonCard[]) => {
    setFilteredCards(filtered)
  }, [])

  const addToCollection = useCallback((card: PokemonCard, e?: React.MouseEvent<Element, MouseEvent>) => {
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
  }, [showCollection])

  const updateQuantity = useCallback((cardId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCollectedCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, quantity: newQuantity }
          : card
      )
    )
  }, [])

  const removeFromCollection = useCallback((cardId: string) => {
    setCollectedCards(prev => prev.filter(card => card.id !== cardId))
  }, [])

  const exportToCSV = useCallback((cards: CollectedCard[]) => {
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
  }, [])

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${showCollection ? 'lg:mr-80' : ''}`}>
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Search Controls */}
          <div className="card p-6">
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="slide-up rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-center text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && !error && (
            <div className="fade-in flex justify-center items-center py-12">
              <LoadingSpinner />
              <span className="ml-3 text-gray-400">
                Searching for "{searchInput.trim()}"...
              </span>
            </div>
          )}

          {/* Filters */}
          {cards.length > 0 && (
            <div className="card p-6">
              <Filters cards={cards} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Search Results */}
          {filteredCards.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Found {filteredCards.length} cards
                  {filteredCards.length !== cards.length && (
                    <span className="text-sm text-gray-400 ml-2">
                      (filtered from {cards.length})
                    </span>
                  )}
                </h2>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCards.map((card) => (
                  <div 
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="card card-hover group cursor-pointer"
                  >
                    <div className="p-4">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 min-w-0">
                          <h3 className="font-bold text-white truncate">
                            {card.name}
                          </h3>
                          {card.language && (
                            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                              card.language === 'JPN' 
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {card.language}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => addToCollection(card, e)}
                          className="btn btn-primary ml-2 !p-2"
                        >
                          <svg 
                            className="h-5 w-5" 
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
                          <span className="sr-only">Add to Collection</span>
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="flex items-start space-x-4">
                        <div className="relative group-hover:scale-105 transition-transform duration-300">
                          {card.images?.small && (
                            <ImageLoader
                              src={card.images.small}
                              alt={card.name}
                              className="w-24 h-32 rounded-lg shadow-lg object-cover"
                            />
                          )}
                        </div>
                        <CardDetails card={card} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Collection Sidebar */}
      <aside 
        className={`fixed inset-y-0 right-0 w-80 bg-slate-800/95 backdrop-blur-sm border-l border-slate-700/50 transform transition-transform duration-300 ease-in-out ${
          showCollection ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:relative lg:${showCollection ? 'w-80' : 'w-0'}`}
      >
        <Collection
          cards={collectedCards}
          onRemove={removeFromCollection}
          onUpdateQuantity={updateQuantity}
          onExport={exportToCSV}
          onCardClick={setSelectedCard}
        />
      </aside>

      {/* Toggle Collection Button */}
      <button
        onClick={() => setShowCollection(!showCollection)}
        className="fixed bottom-4 right-4 z-50 btn btn-primary rounded-full lg:hidden"
        aria-label="Toggle Collection"
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${showCollection ? 'rotate-45' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d={showCollection ? "M6 18L18 6M6 6l12 12" : "M19 9l-7 7-7-7"} 
          />
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
