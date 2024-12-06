import { NextResponse } from 'next/server'
import { validateJpnSearchResponse, convertJpnCard } from '../../utils/pokemon-tcg'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const language = searchParams.get('language') || 'all'
  const searchType = searchParams.get('type') || 'name'
  const pageSize = 250

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.POKEMONTCG_API_KEY
  if (!apiKey) {
    console.error('Pokemon TCG API key is not configured')
    return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
  }

  let results: any[] = []

  try {
    // Search English cards if language is 'en' or 'all'
    if (language === 'en' || language === 'all') {
      const searchQuery = searchType === 'name' ? `name:"*${query}*"` :
                         searchType === 'set' ? `set.name:"*${query}*"` :
                         `artist:"*${query}*"`

      const cardApiUrl = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(searchQuery)}&orderBy=set.releaseDate,number&pageSize=${pageSize}`
      console.log('Searching EN cards:', cardApiUrl)

      const cardResponse = await fetch(cardApiUrl, {
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!cardResponse.ok) {
        console.error('EN API Error:', cardResponse.status, cardResponse.statusText)
        throw new Error(`Failed to fetch EN cards: ${cardResponse.status}`)
      }

      const cardData = await cardResponse.json()
      if (cardData.data) {
        results = cardData.data.map((card: any) => {
          // Convert image URLs to high-res format
          if (card.images?.small) {
            const baseUrl = card.images.small.replace('.png', '')
            card.images.large = `${baseUrl}_hires.png`
          }
          return { ...card, language: 'EN' }
        })
      }
    }

    // Search Japanese cards if language is 'jpn' or 'all'
    if (language === 'jpn' || language === 'all') {
      const encodedQuery = encodeURIComponent(query)
      const jpnApiUrl = searchType === 'name' ? `https://www.jpn-cards.com/v2/card/name=${encodedQuery}` :
                       searchType === 'set' ? `https://www.jpn-cards.com/v2/card/set_name=${encodedQuery}` :
                       `https://www.jpn-cards.com/v2/card/illustrator=${encodedQuery}`

      console.log('Searching JPN cards:', jpnApiUrl)

      const jpnResponse = await fetch(jpnApiUrl)

      if (!jpnResponse.ok) {
        console.error('JPN API Error:', jpnResponse.status, jpnResponse.statusText)
        throw new Error(`Failed to fetch JPN cards: ${jpnResponse.status}`)
      }

      try {
        const jpnData = await jpnResponse.json()
        if (jpnData.data && Array.isArray(jpnData.data)) {
          const convertedJpnCards = jpnData.data.map(convertJpnCard)
          results = [...results, ...convertedJpnCards]
        }
      } catch (error) {
        console.error('JPN API Parse Error:', error)
      }
    }

    // Sort combined results by release date
    results.sort((a, b) => {
      const dateA = new Date(a.set.releaseDate).getTime()
      const dateB = new Date(b.set.releaseDate).getTime()
      return dateB - dateA
    })

    // Log first result for debugging
    if (results.length > 0) {
      console.log('First result image URLs:', {
        small: results[0].images?.small,
        large: results[0].images?.large
      })
    }

    return NextResponse.json({ data: results })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
