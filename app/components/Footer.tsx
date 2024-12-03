export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Attribution */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All data made available by the{' '}
            <a 
              href="https://pokemontcg.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Pokémon TCG API
            </a>
          </p>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 dark:text-gray-500 max-w-lg">
            This website is not produced, endorsed, supported, or affiliated with Nintendo or The Pokémon Company.
          </p>
        </div>
      </div>
    </footer>
  )
}
