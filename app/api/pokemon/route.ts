import { NextResponse } from 'next/server'
import { validateJpnSearchResponse, convertJpnCard } from '../../utils/pokemon-tcg'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const language = searchParams.get('language') || 'all' // 'en', 'jpn', or 'all'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.POKEMONTCG_API_KEY
  let results: any[] = []

  try {
    // Search English cards if language is 'en' or 'all'
    if (language === 'en' || language === 'all') {
      const enApiUrl = `https://api.pokemontcg.io/v2/cards?q=name:*${query}*&orderBy=number&pageSize=20`
      console.log('Searching EN API:', enApiUrl)

      const enResponse = await fetch(enApiUrl, {
        headers: {
          'X-Api-Key': apiKey || ''
        }
      })

      if (!enResponse.ok) {
        throw new Error(`EN API responded with status: ${enResponse.status}`)
      }

      const enData = await enResponse.json()
      if (enData.data) {
        // Add language flag to English cards
        results = enData.data.map((card: any) => ({ ...card, language: 'EN' }))
      }
    }

    // Search Japanese cards if language is 'jpn' or 'all'
    if (language === 'jpn' || language === 'all') {
      const jpnApiUrl = `https://www.jpn-cards.com/v2/card/name=${query}`
      console.log('Searching JPN API:', jpnApiUrl)

      const jpnResponse = await fetch(jpnApiUrl)

      if (!jpnResponse.ok) {
        throw new Error(`JPN API responded with status: ${jpnResponse.status}`)
      }

      const jpnData = await jpnResponse.json()
      if (validateJpnSearchResponse(jpnData)) {
        // Convert Japanese cards to match English card format
        const convertedJpnCards = jpnData.data.map(convertJpnCard)
        results = [...results, ...convertedJpnCards]
      }
    }

    // Log the first card from results for debugging
    if (results.length > 0) {
      console.log('First Card Data:', {
        name: results[0].name,
        artist: results[0].artist,
        set: results[0].set.name,
        number: results[0].number,
        language: results[0].language
      })
    }

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Pokemon TCG API' },
      { status: 500 }
    )
  }
}
