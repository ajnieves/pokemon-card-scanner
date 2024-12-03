import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.POKEMONTCG_API_KEY
  const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:*${query}*&orderBy=number&pageSize=20`

  console.log('Searching with URL:', apiUrl)

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Api-Key': apiKey || ''
      }
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Log the full first card data to check the artist field
    if (data.data && data.data.length > 0) {
      console.log('First Card Data:', {
        name: data.data[0].name,
        artist: data.data[0].artist,
        set: data.data[0].set.name,
        number: data.data[0].number
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Pokemon TCG API' },
      { status: 500 }
    )
  }
}
