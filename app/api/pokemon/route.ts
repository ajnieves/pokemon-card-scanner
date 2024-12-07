import { NextResponse } from 'next/server'
import { PokemonCard, convertJpnCard } from '../../utils/pokemon-tcg'

const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2/cards'
const JPN_CARDS_API = 'https://www.jpn-cards.com/v2/card'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const language = searchParams.get('language') || 'all'
  const type = searchParams.get('type') || 'name'

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  let results: PokemonCard[] = []

  try {
    // Search English cards
    if (language === 'all' || language === 'en') {
      console.log(`Searching EN cards: ${POKEMON_TCG_API}?q=${type}:"*${query}*"&orderBy=set.releaseDatenumber&pageSize=250`)
      
      const response = await fetch(
        `${POKEMON_TCG_API}?q=${type}:"*${query}*"&orderBy=set.releaseDatenumber&pageSize=250`,
        {
          headers: {
            'X-Api-Key': process.env.POKEMON_TCG_API_KEY || ''
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Pokemon TCG API responded with ${response.status}`)
      }

      const data = await response.json()
      if (data.data && Array.isArray(data.data)) {
        results = data.data
      }

      // Log first result image URLs for debugging
      if (results.length > 0 && results[0].images) {
        console.log('First result image URLs:', {
          small: results[0].images.small,
          large: results[0].images.large
        })
      }
    }

    // Search Japanese cards
    if (language === 'all' || language === 'jpn') {
      console.log(`Searching JPN cards: ${JPN_CARDS_API}/name=${query}`)
      
      try {
        const jpnResponse = await fetch(`${JPN_CARDS_API}/name=${query}`)
        
        if (!jpnResponse.ok) {
          console.error(`JPN API responded with ${jpnResponse.status}`)
          return
        }

        const jpnData = await jpnResponse.json()
        
        if (jpnData && Array.isArray(jpnData.data)) {
          const convertedJpnCards = jpnData.data.map((card: any) => ({
            id: card.id,
            name: card.name,
            number: card.number,
            images: {
              small: card.images?.small,
              large: card.images?.large
            },
            set: {
              name: card.set?.name || 'Unknown Set',
              printedTotal: card.set?.total || 0,
              releaseDate: card.set?.releaseDate
            },
            rarity: card.rarity,
            artist: card.artist,
            language: 'JPN'
          }))
          
          results = [...results, ...convertedJpnCards]
        }
      } catch (error) {
        console.error('JPN API Parse Error:', error)
      }
    }

    // Sort results by release date (newest first)
    results.sort((a, b) => {
      const dateA = a.set.releaseDate ? new Date(a.set.releaseDate) : new Date(0)
      const dateB = b.set.releaseDate ? new Date(b.set.releaseDate) : new Date(0)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search cards' },
      { status: 500 }
    )
  }
}
