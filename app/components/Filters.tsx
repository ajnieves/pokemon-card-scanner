'use client'

import { useState, useEffect } from 'react'
import { PokemonCard } from '../utils/pokemon-tcg'

interface FiltersProps {
  cards: PokemonCard[]
  onFilterChange: (filtered: PokemonCard[]) => void
}

export default function Filters({ cards, onFilterChange }: FiltersProps) {
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set())
  const [selectedRarities, setSelectedRarities] = useState<Set<string>>(new Set())
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set())
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set())

  // Extract unique values and filter out undefined values
  const uniqueSets = new Set(cards.map(card => card.set.name))
  const uniqueRarities = new Set(cards.map(card => card.rarity).filter((rarity): rarity is string => rarity !== undefined))
  const uniqueArtists = new Set(cards.map(card => card.artist).filter((artist): artist is string => artist !== undefined))
  const uniqueLanguages = new Set(cards.map(card => card.language || 'ENG').filter(Boolean))

  useEffect(() => {
    let filtered = [...cards]

    if (selectedSets.size > 0) {
      filtered = filtered.filter(card => selectedSets.has(card.set.name))
    }

    if (selectedRarities.size > 0) {
      filtered = filtered.filter(card => card.rarity && selectedRarities.has(card.rarity))
    }

    if (selectedArtists.size > 0) {
      filtered = filtered.filter(card => card.artist && selectedArtists.has(card.artist))
    }

    if (selectedLanguages.size > 0) {
      filtered = filtered.filter(card => selectedLanguages.has(card.language || 'ENG'))
    }

    onFilterChange(filtered)
  }, [selectedSets, selectedRarities, selectedArtists, selectedLanguages, cards, onFilterChange])

  const toggleSet = (set: string) => {
    setSelectedSets(prev => {
      const next = new Set(prev)
      if (next.has(set)) {
        next.delete(set)
      } else {
        next.add(set)
      }
      return next
    })
  }

  const toggleRarity = (rarity: string) => {
    setSelectedRarities(prev => {
      const next = new Set(prev)
      if (next.has(rarity)) {
        next.delete(rarity)
      } else {
        next.add(rarity)
      }
      return next
    })
  }

  const toggleArtist = (artist: string) => {
    setSelectedArtists(prev => {
      const next = new Set(prev)
      if (next.has(artist)) {
        next.delete(artist)
      } else {
        next.add(artist)
      }
      return next
    })
  }

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => {
      const next = new Set(prev)
      if (next.has(language)) {
        next.delete(language)
      } else {
        next.add(language)
      }
      return next
    })
  }

  const clearFilters = () => {
    setSelectedSets(new Set())
    setSelectedRarities(new Set())
    setSelectedArtists(new Set())
    setSelectedLanguages(new Set())
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {(selectedSets.size > 0 || selectedRarities.size > 0 || selectedArtists.size > 0 || selectedLanguages.size > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Languages */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Languages</h4>
          <div className="space-y-1">
            {Array.from(uniqueLanguages).map(language => (
              <label
                key={language}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.has(language)}
                  onChange={() => toggleLanguage(language)}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {language === 'JPN' ? 'Japanese' : 'English'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sets */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Sets</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
            {Array.from(uniqueSets).map(set => (
              <label
                key={set}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedSets.has(set)}
                  onChange={() => toggleSet(set)}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">
                  {set}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rarities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Rarities</h4>
          <div className="space-y-1">
            {Array.from(uniqueRarities).map(rarity => (
              <label
                key={rarity}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedRarities.has(rarity)}
                  onChange={() => toggleRarity(rarity)}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {rarity}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Artists */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Artists</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
            {Array.from(uniqueArtists).map(artist => (
              <label
                key={artist}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedArtists.has(artist)}
                  onChange={() => toggleArtist(artist)}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">
                  {artist}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
