'use client'

interface SearchControlsProps {
  loading: boolean
  searchInput: string
  language: string
  searchType: string
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSearch()
    }
  }

  return (
    <div className="slide-up space-y-4 md:space-y-0 md:flex md:gap-6">
      {/* Search Options */}
      <div className="flex flex-col sm:flex-row gap-4 md:w-auto">
        {/* Language Select */}
        <div className="w-full sm:w-auto">
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1.5">
            Search in:
          </label>
          <select
            id="language"
            value={language}
            onChange={onLanguageChange}
            className="input w-full sm:w-40"
          >
            <option value="all">All Languages</option>
            <option value="en">English Only</option>
            <option value="jpn">Japanese Only</option>
          </select>
        </div>

        {/* Search Type Select */}
        <div className="w-full sm:w-auto">
          <label htmlFor="searchType" className="block text-sm font-medium text-gray-300 mb-1.5">
            Search by:
          </label>
          <select
            id="searchType"
            value={searchType}
            onChange={onSearchTypeChange}
            className="input w-full sm:w-40"
          >
            <option value="name">Card Name</option>
            <option value="set">Set Name</option>
            <option value="artist">Illustrator</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            {/* Search Icon */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg 
                className="h-5 w-5 text-gray-400" 
                viewBox="0 0 20 20" 
                fill="none" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                />
              </svg>
            </div>

            {/* Search Input */}
            <input
              type="text"
              id="searchInput"
              name="searchInput"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              value={searchInput}
              onChange={onSearchInputChange}
              onKeyDown={onKeyPress}
              className="block w-full rounded-lg border bg-slate-800/50 p-3 pl-11 pr-20 text-white border-slate-700/50 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors"
              placeholder="Search for a Pokémon card..."
              minLength={2}
              required
            />

            {/* Search Button */}
            <div className="absolute inset-y-1 right-1">
              <button
                type="submit"
                disabled={loading || !searchInput.trim()}
                className="h-full px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Searching...</span>
                  </div>
                ) : (
                  <>
                    <span className="hidden sm:inline">Search</span>
                    <svg 
                      className="sm:hidden h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
