'use client'

import { LoadingSpinner } from './LoadingSpinner'

type Language = 'en' | 'jpn' | 'all'
type SearchType = 'name' | 'set' | 'artist'

interface SearchControlsProps {
  loading: boolean
  searchInput: string
  language: Language
  searchType: SearchType
  onSearch: () => void
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onSearchTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onKeyPress: (e: React.KeyboardEvent) => void
}

export default function SearchControls({
  loading,
  searchInput,
  language,
  searchType,
  onSearch,
  onSearchInputChange,
  onLanguageChange,
  onSearchTypeChange,
  onKeyPress
}: SearchControlsProps) {
  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'name':
        return 'Search for a Pokémon card...'
      case 'set':
        return 'Search by set name (e.g., Base Set, Sword & Shield)...'
      case 'artist':
        return 'Search by illustrator name...'
      default:
        return 'Search...'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Language Selector */}
          <div className="flex items-center space-x-4">
            <label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Search in:
            </label>
            <select
              id="language"
              value={language}
              onChange={onLanguageChange}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="jpn">Japanese</option>
            </select>
          </div>

          {/* Search Type Selector */}
          <div className="flex items-center space-x-4">
            <label htmlFor="searchType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Search by:
            </label>
            <select
              id="searchType"
              value={searchType}
              onChange={onSearchTypeChange}
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="name">Card Name</option>
              <option value="set">Set Name</option>
              <option value="artist">Illustrator</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={onSearchInputChange}
            onKeyPress={onKeyPress}
            placeholder={getSearchPlaceholder()}
            className="w-full px-4 py-3 pl-12 pr-16 text-gray-900 placeholder-gray-500 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={onSearch}
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
  )
}
