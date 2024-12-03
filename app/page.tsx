import ClientWrapper from './components/ClientWrapper'
import CardScanner from './components/CardScanner'

export default function Home() {
  return (
    <ClientWrapper>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Search Your Pokémon Cards
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Enter a card name to search, view details, and add cards to your collection. 
                Export your collection to CSV for easy tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <CardScanner />
        </div>
      </div>
    </ClientWrapper>
  )
}
