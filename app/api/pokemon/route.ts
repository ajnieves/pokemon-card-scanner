import { NextResponse } from 'next/server'
import { PokemonCard } from '../../utils/pokemon-tcg'

interface JpnCard {
  id: number
  name: string
  setData: {
    name: string
    printedTotal: string
    total: number
    year: string
    image_url: string
    set_url: string
  }
  types: string[]
  hp: number
  evolvesFrom: string | null
  effect: Array<{
    name: string
    text: string
    type: string
  }>
  attacks: Array<{
    name: string
    cost: string[]
    convertedEnergyCost: number
    damage: string
    text: string
  }>
  weaknesses: Array<{
    type: string
    value: string
  }> | null
  resistances: Array<{
    type: string
    value: string
  }> | null
  retreatCost: string[]
  convertedRetreatCost: number
  supertype: string
  subtypes: string[]
  rarity: string
  artist: string
  imageUrl: string
  cardUrl: string
  sequenceNumber: number
  printedNumber: string
}

interface JpnApiResponse {
  data: JpnCard[]
  page: number
  pageSize: number
  count: number
  totalCount: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const language = searchParams.get('language') || 'all'
  const type = searchParams.get('type') || 'name'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const cards: PokemonCard[] = []

  // Search English cards if language is 'all' or 'en'
  if (language === 'all' || language === 'en') {
    try {
      console.log(`Searching EN cards: https://api.pokemontcg.io/v2/cards?q=${type}:"*${query}*"&orderBy=set.releaseDatenumber&pageSize=250`)
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=${type}:"*${query}*"&orderBy=set.releaseDatenumber&pageSize=250`,
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
      cards.push(...data.data)
    } catch (error) {
      console.error('Error fetching from Pokemon TCG API:', error)
    }
  }

  // Search Japanese cards if language is 'all' or 'jpn'
  if (language === 'all' || language === 'jpn') {
    try {
      // Use the correct endpoint format from the documentation
      const jpnApiUrl = `https://www.jpn-cards.com/v2/card/name=${encodeURIComponent(query)}`
      console.log(`Searching JPN cards: ${jpnApiUrl}`)
      
      const response = await fetch(jpnApiUrl, {
        headers: {
          'Accept': 'application/json'
        }
      })

      console.log('JPN API response status:', response.status)
      console.log('JPN API response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('JPN API error response:', errorText)
        throw new Error(`JPN Cards API responded with ${response.status}: ${errorText}`)
      }

      const data: JpnApiResponse = await response.json()
      console.log('JPN API response:', JSON.stringify(data, null, 2))

      // Convert Japanese cards to match Pokemon TCG API format
      if (data.data && Array.isArray(data.data)) {
        const jpnCards = data.data.map(card => ({
          id: `jpn-${card.id}`,
          name: card.name,
          supertype: card.supertype,
          subtypes: card.subtypes,
          hp: card.hp?.toString(),
          types: card.types,
          evolvesFrom: card.evolvesFrom || undefined,
          attacks: card.attacks,
          weaknesses: card.weaknesses || undefined,
          resistances: card.resistances || undefined,
          retreatCost: card.retreatCost,
          convertedRetreatCost: card.convertedRetreatCost,
          set: {
            id: `jpn-set-${card.id}`,
            name: card.setData.name,
            series: 'Japanese Series',
            printedTotal: parseInt(card.setData.printedTotal),
            total: card.setData.total,
            legalities: {
              unlimited: 'Legal',
              standard: 'Legal',
              expanded: 'Legal'
            },
            ptcgoCode: '',
            releaseDate: card.setData.year || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            images: {
              symbol: card.setData.image_url,
              logo: card.setData.image_url
            }
          },
          number: card.printedNumber,
          artist: card.artist,
          rarity: card.rarity,
          flavorText: '',
          images: {
            small: card.imageUrl,
            large: card.imageUrl
          },
          legalities: {
            unlimited: 'Legal',
            standard: 'Legal',
            expanded: 'Legal'
          },
          language: 'JPN'
        } as PokemonCard))
        cards.push(...jpnCards)
      }
    } catch (error) {
      console.error('Error fetching from JPN Cards API:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
    }
  }

  // Sort cards by release date (newest first)
  cards.sort((a, b) => {
    const dateA = new Date(a.set.releaseDate)
    const dateB = new Date(b.set.releaseDate)
    return dateB.getTime() - dateA.getTime()
  })

  // Log final cards array for debugging
  console.log(`Found ${cards.length} total cards`)
  if (cards.length > 0) {
    console.log('First card in results:', {
      name: cards[0].name,
      set: cards[0].set.name,
      images: cards[0].images,
      language: cards[0].language
    })
  }

  return NextResponse.json({ data: cards })
}
