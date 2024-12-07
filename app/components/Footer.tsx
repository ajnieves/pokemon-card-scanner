'use client'

export default function Footer() {
  return (
    <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* API Attribution */}
          <p className="text-sm text-gray-400">
            All data made available by the{' '}
            <a 
              href="https://pokemontcg.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Pokémon TCG API
            </a>
          </p>

          {/* Legal Disclaimer */}
          <p className="text-xs text-gray-500 max-w-2xl">
            This website is not produced, endorsed, supported, or affiliated with Nintendo or The Pokémon Company.
          </p>
        </div>
      </div>
    </footer>
  )
}
