import ClientWrapper from './components/ClientWrapper'
import CardScanner from './components/CardScanner'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Create Your CG Submission
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Search and export your Pokemon card CG card grading submission with ease. 
          Simply enter a card name or number to get started.
        </p>
      </div>
      <ClientWrapper>
        <CardScanner />
      </ClientWrapper>
    </div>
  )
}
