'use client'

import { useState, useEffect, useCallback } from 'react'
import { PokemonCard } from '../utils/pokemon-tcg'

interface FiltersProps {
  cards: PokemonCard[]
  onFilterChange: (filteredCards: PokemonCard[]) => void
}

interface FilterState {
  artists: string[]
  sets: string[]
  rarities: string[]
}

interface FilterOptions {
  artists: string[]
  sets: string[]
  rarities: string[]
}

export default function Filters({ cards, onFilterChange }: FiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    artists: [],
    sets: [],
    rarities: []
  })

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    artists: [],
    sets: [],
    rarities: []
  })

  // Extract unique filter options from cards and sort them
  useEffect(() => {
    if (!cards.length) return

    const options: FilterOptions = {
      artists: Array.from(new Set(cards.filter(card => card.artist).map(card => card.artist!))).sort(),
      sets: Array.from(new Set(cards.map(card => card.set.name))).sort(),
      rarities: Array.from(new Set(cards.filter(card => card.rarity).map(card => card.rarity!))).sort()
    }

    setFilterOptions(options)
  }, [cards])

  // Memoize the filter function
  const applyFilters = useCallback((filters: FilterState, cardsToFilter: PokemonCard[]) => {
    let result = [...cardsToFilter]

    // Apply artist filters
    if (filters.artists.length > 0) {
      result = result.filter(card => 
        card.artist && filters.artists.includes(card.artist)
      )
    }

    // Apply set filters
    if (filters.sets.length > 0) {
      result = result.filter(card => 
        filters.sets.includes(card.set.name)
      )
    }

    // Apply rarity filters
    if (filters.rarities.length > 0) {
      result = result.filter(card => 
        card.rarity && filters.rarities.includes(card.rarity)
      )
    }

    return result
  }, [])

  // Apply filters when selection changes
  useEffect(() => {
    const filteredCards = applyFilters(selectedFilters, cards)
    onFilterChange(filteredCards)
  }, [selectedFilters, cards, applyFilters, onFilterChange])

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[type]
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value].sort()

      return {
        ...prev,
        [type]: updated
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({
      artists: [],
      sets: [],
      rarities: []
    })
  }

  if (!cards.length) return null

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {(selectedFilters.artists.length > 0 || 
        selectedFilters.sets.length > 0 || 
        selectedFilters.rarities.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Active Filters:</span>
          {selectedFilters.artists.map(artist => (
            <button
              key={`artist-${artist}`}
              onClick={() => toggleFilter('artists', artist)}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            >
              {artist}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          {selectedFilters.sets.map(set => (
            <button
              key={`set-${set}`}
              onClick={() => toggleFilter('sets', set)}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
            >
              {set}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          {selectedFilters.rarities.map(rarity => (
            <button
              key={`rarity-${rarity}`}
              onClick={() => toggleFilter('rarities', rarity)}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
            >
              {rarity}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Filter Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Artist Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Artists</h3>
          <div className="max-h-40 overflow-y-auto space-y-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
            {filterOptions.artists.map(artist => (
              <label
                key={artist}
                className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.artists.includes(artist)}
                  onChange={() => toggleFilter('artists', artist)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{artist}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Set Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sets</h3>
          <div className="max-h-40 overflow-y-auto space-y-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
            {filterOptions.sets.map(set => (
              <label
                key={set}
                className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.sets.includes(set)}
                  onChange={() => toggleFilter('sets', set)}
                  className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{set}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rarity Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Rarities</h3>
          <div className="max-h-40 overflow-y-auto space-y-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
            {filterOptions.rarities.map(rarity => (
              <label
                key={rarity}
                className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.rarities.includes(rarity)}
                  onChange={() => toggleFilter('rarities', rarity)}
                  className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{rarity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
