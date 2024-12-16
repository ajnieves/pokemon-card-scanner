'use client'

import { useState, useEffect } from 'react'
import { PokemonCard } from '../utils/pokemon-tcg'

interface FiltersProps {
  cards: PokemonCard[]
  onFilterChange: (filtered: PokemonCard[]) => void
}

interface FilterSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  selectedCount: number
  children: React.ReactNode
}

function FilterSection({ title, isOpen, onToggle, selectedCount, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-4 flex items-center justify-between text-left hover:bg-gray-800/50 active:bg-gray-800/75 transition-colors rounded-lg touch-manipulation"
      >
        <div className="flex items-center space-x-2">
          <h4 className="text-base font-medium text-gray-400">{title}</h4>
          {selectedCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full min-w-[1.5rem] text-center">
              {selectedCount}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="py-2 px-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Filters({ cards, onFilterChange }: FiltersProps) {
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set())
  const [selectedRarities, setSelectedRarities] = useState<Set<string>>(new Set())
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set())
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set())
  
  // Track which sections are open
  const [openSections, setOpenSections] = useState({
    languages: true,
    sets: false,
    rarities: false,
    artists: false
  })

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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearFilters = () => {
    setSelectedSets(new Set())
    setSelectedRarities(new Set())
    setSelectedArtists(new Set())
    setSelectedLanguages(new Set())
  }

  const hasActiveFilters = selectedSets.size > 0 || selectedRarities.size > 0 || 
    selectedArtists.size > 0 || selectedLanguages.size > 0

  return (
    <div className="bg-gray-900/50 rounded-xl backdrop-blur-sm overflow-hidden">
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-white active:text-gray-300 transition-colors rounded-lg hover:bg-gray-800/50 active:bg-gray-800/75"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-800">
        {/* Languages */}
        <FilterSection
          title="Languages"
          isOpen={openSections.languages}
          onToggle={() => toggleSection('languages')}
          selectedCount={selectedLanguages.size}
        >
          <div className="space-y-3">
            {Array.from(uniqueLanguages).map(language => (
              <label
                key={language}
                className="flex items-center space-x-3 cursor-pointer group min-h-[2.75rem] touch-manipulation"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.has(language)}
                  onChange={() => toggleLanguage(language)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-base text-gray-400 group-hover:text-white transition-colors">
                  {language === 'JPN' ? 'Japanese' : 'English'}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Sets */}
        <FilterSection
          title="Sets"
          isOpen={openSections.sets}
          onToggle={() => toggleSection('sets')}
          selectedCount={selectedSets.size}
        >
          <div className="space-y-3 max-h-[60vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
            {Array.from(uniqueSets).map(set => (
              <label
                key={set}
                className="flex items-center space-x-3 cursor-pointer group min-h-[2.75rem] touch-manipulation"
              >
                <input
                  type="checkbox"
                  checked={selectedSets.has(set)}
                  onChange={() => toggleSet(set)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-base text-gray-400 group-hover:text-white transition-colors truncate">
                  {set}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Rarities */}
        <FilterSection
          title="Rarities"
          isOpen={openSections.rarities}
          onToggle={() => toggleSection('rarities')}
          selectedCount={selectedRarities.size}
        >
          <div className="space-y-3">
            {Array.from(uniqueRarities).map(rarity => (
              <label
                key={rarity}
                className="flex items-center space-x-3 cursor-pointer group min-h-[2.75rem] touch-manipulation"
              >
                <input
                  type="checkbox"
                  checked={selectedRarities.has(rarity)}
                  onChange={() => toggleRarity(rarity)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-base text-gray-400 group-hover:text-white transition-colors">
                  {rarity}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Artists */}
        <FilterSection
          title="Artists"
          isOpen={openSections.artists}
          onToggle={() => toggleSection('artists')}
          selectedCount={selectedArtists.size}
        >
          <div className="space-y-3 max-h-[60vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pr-2">
            {Array.from(uniqueArtists).map(artist => (
              <label
                key={artist}
                className="flex items-center space-x-3 cursor-pointer group min-h-[2.75rem] touch-manipulation"
              >
                <input
                  type="checkbox"
                  checked={selectedArtists.has(artist)}
                  onChange={() => toggleArtist(artist)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-base text-gray-400 group-hover:text-white transition-colors truncate">
                  {artist}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  )
}
