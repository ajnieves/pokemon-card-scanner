import { NextResponse } from 'next/server'
import { validateJpnSearchResponse, convertJpnCard } from '../../utils/pokemon-tcg'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const language = searchParams.get('language') || 'all'
  const searchType = searchParams.get('type') || 'name'
  const pageSize = 250 // Maximum allowed by the API

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.POKEMONTCG_API_KEY
  if (!apiKey) {
    console.error('Pokemon TCG API key is not configured')
    return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
  }

  console.log('Search params:', { query, language, searchType, apiKey: apiKey ? 'present' : 'missing' })
  let results: any[] = []

  try {
    // Search English cards if language is 'en' or 'all'
    if (language === 'en' || language === 'all') {
      // Build query based on search type
      const searchQuery = searchType === 'name' ? `name:"*${query}*"` :
                         searchType === 'set' ? `set.name:"*${query}*"` :
                         `artist:"*${query}*"`

      const cardApiUrl = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(searchQuery)}&orderBy=set.releaseDate,number&pageSize=${pageSize}`
      console.log('EN API URL:', cardApiUrl)

      try {
        const cardResponse = await fetch(cardApiUrl, {
          headers: {
            'X-Api-Key': apiKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        const responseText = await cardResponse.text()
        console.log('EN API Response:', {
          status: cardResponse.status,
          statusText: cardResponse.statusText,
          headers: Object.fromEntries(cardResponse.headers),
          body: responseText.substring(0, 1000) // Log first 1000 chars
        })

        if (!cardResponse.ok) {
          throw new Error(`EN API error: ${cardResponse.status} - ${responseText}`)
        }

        const cardData = JSON.parse(responseText)
        if (cardData.data) {
          results = cardData.data.map((card: any) => ({ ...card, language: 'EN' }))
        }
      } catch (enError: any) {
        console.error('EN API Error:', enError)
        // Continue to Japanese search even if English search fails
      }
    }

    // Search Japanese cards if language is 'jpn' or 'all'
    if (language === 'jpn' || language === 'all') {
      const encodedQuery = encodeURIComponent(query)
      const jpnApiUrl = searchType === 'name' ? `https://www.jpn-cards.com/v2/card/name=${encodedQuery}` :
                       searchType === 'set' ? `https://www.jpn-cards.com/v2/card/set_name=${encodedQuery}` :
                       `https://www.jpn-cards.com/v2/card/illustrator=${encodedQuery}`

      console.log('JPN API URL:', jpnApiUrl)

      try {
        const jpnResponse = await fetch(jpnApiUrl)
        const responseText = await jpnResponse.text()
        console.log('JPN API Response:', {
          status: jpnResponse.status,
          statusText: jpnResponse.statusText,
          headers: Object.fromEntries(jpnResponse.headers),
          body: responseText.substring(0, 1000) // Log first 1000 chars
        })

        if (!jpnResponse.ok) {
          throw new Error(`JPN API error: ${jpnResponse.status} - ${responseText}`)
        }

        const jpnData = JSON.parse(responseText)
        if (jpnData.data && Array.isArray(jpnData.data)) {
          const convertedJpnCards = jpnData.data.map(convertJpnCard)
          results = [...results, ...convertedJpnCards]
        }
      } catch (jpnError: any) {
        console.error('JPN API Error:', jpnError)
        // Continue even if Japanese search fails
      }
    }

    // Sort combined results by release date
    results.sort((a, b) => {
      const dateA = new Date(a.set.releaseDate).getTime()
      const dateB = new Date(b.set.releaseDate).getTime()
      return dateB - dateA // Sort by newest first
    })

    // Log search results summary
    console.log('Search results:', {
      query,
      searchType,
      language,
      resultCount: results.length,
      firstResult: results[0] ? {
        name: results[0].name,
        set: results[0].set.name,
        language: results[0].language,
        releaseDate: results[0].set.releaseDate
      } : null
    })

    return NextResponse.json({ data: results })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
