const API_BASE_URL = 'https://api.pokemontcg.io/v2'

export interface PokemonCard {
  id: string
  name: string
  number: string
  rarity?: string
  set: {
    name: string
    releaseDate?: string
  }
  images: {
    small: string
    large: string
  }
}

export interface SearchResponse {
  data: PokemonCard[]
  page: number
  pageSize: number
  count: number
  totalCount: number
}

export async function searchCards(query: string): Promise<SearchResponse> {
  const response = await fetch(`/api/pokemon?q=${encodeURIComponent(query)}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch card data')
  }
  
  return response.json()
}
