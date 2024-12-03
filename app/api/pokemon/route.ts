import { NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.pokemontcg.io/v2'
const API_KEY = process.env.POKEMONTCG_API_KEY

const headers = {
  'Content-Type': 'application/json',
  ...(API_KEY && { 'X-Api-Key': API_KEY })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Check if the query is a card number (e.g., "136/198" or just "136")
    const cardNumberMatch = query.match(/^(\d+)(\/\d+)?$/)
    let searchQuery = ''
    
    if (cardNumberMatch) {
      // If it's a full number with set (e.g., "25/102"), search exactly
      if (cardNumberMatch[2]) {
        searchQuery = `number:"${cardNumberMatch[0]}"`
      } else {
        // If it's just a number, search for cards with that number
        searchQuery = `number:"${cardNumberMatch[1]}"`
      }
    } else {
      // For name searches, make it case-insensitive and allow partial matches
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      searchQuery = `name:"${escapedQuery}"`
    }

    console.log('Searching with query:', searchQuery)

    const response = await fetch(
      `${API_BASE_URL}/cards?q=${encodeURIComponent(searchQuery)}&pageSize=10&orderBy=number`,
      { 
        headers,
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      console.error('API response error:', response.status, await response.text())
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API key is invalid or missing' },
          { status: 401 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch cards from Pokemon TCG API' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Log the response data for debugging
    console.log('API Response:', JSON.stringify(data, null, 2))
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
