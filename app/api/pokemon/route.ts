import { NextResponse } from 'next/server'

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

    const API_KEY = process.env.POKEMONTCG_API_KEY
    const API_URL = 'https://api.pokemontcg.io/v2/cards'

    // Build search query
    const searchQuery = `name:*${query}*`
    const queryParams = new URLSearchParams({
      q: searchQuery,
      orderBy: 'number',
      pageSize: '20',
    })

    const searchUrl = `${API_URL}?${queryParams.toString()}`
    console.log('Searching with URL:', searchUrl)

    const response = await fetch(searchUrl, {
      headers: {
        'X-Api-Key': API_KEY!
      }
    })

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      })

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check the API key.' },
          { status: 401 }
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to fetch from Pokemon TCG API' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Transform and validate the response
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from Pokemon TCG API')
    }

    // Transform the response to match our interface
    const transformedData = {
      data: data.data.map((card: any) => ({
        id: card.id,
        name: card.name,
        number: card.number,
        rarity: card.rarity,
        set: {
          name: card.set.name,
          releaseDate: card.set.releaseDate,
        },
        images: {
          small: card.images.small,
          large: card.images.large,
        },
      })),
      page: data.page || 1,
      pageSize: data.pageSize || 20,
      count: data.count || data.data.length,
      totalCount: data.totalCount || data.data.length,
    }

    console.log('API Response:', {
      totalCards: transformedData.data.length,
      firstCard: transformedData.data[0]?.name
    })

    return NextResponse.json(transformedData)

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to search cards',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
