import CardScanner from './components/CardScanner'
import ClientWrapper from './components/ClientWrapper'

export default function Home() {
  return (
    <ClientWrapper>
      <CardScanner />
    </ClientWrapper>
  )
}
