import './globals.css'
import type { Metadata } from 'next'
import Footer from './components/Footer'
import { generateMetadata } from './config/metadata'

export const metadata: Metadata = generateMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and title */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-500 shrink-0">
                  <img 
                    src="/file.svg" 
                    alt="Logo" 
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Pokémon Card Scanner
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                    Search and catalog your collection
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex items-center space-x-4">
                <a 
                  href="https://pokemontcg.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  API Docs
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow">
          <div className="py-6 sm:py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  )
}
