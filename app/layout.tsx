import './globals.css'
import type { Metadata } from 'next'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'CG Pokemon Submission Creator',
  description: 'Build CG Grading Submission list with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <img src="/file.svg" alt="Logo" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-2">CG Grading Submission Builder</h1>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
