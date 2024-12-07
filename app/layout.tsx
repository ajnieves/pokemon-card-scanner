import './globals.css'
import { Inter } from 'next/font/google'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CG Grading Submission Tool',
  description: 'Search and catalog your Pokémon card collection.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-900 text-white antialiased`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  CG Grading Submission Tool
                </h1>
                <p className="text-sm text-gray-400">
                  Search and catalog your collection
                </p>
              </div>
            </div>

            {/* API Docs Link */}
            <a
              href="https://docs.pokemontcg.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              API Docs
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  )
}
