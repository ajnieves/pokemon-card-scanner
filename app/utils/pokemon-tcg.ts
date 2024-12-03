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
  try {
    const response = await fetch(`/api/pokemon?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || getErrorMessage(response.status))
    }
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from API')
    }
    
    return data
  } catch (error: any) {
    console.error('Search cards error:', error)
    throw new Error(getErrorMessage(error))
  }
}

export function getCardRarityColor(rarity?: string): string {
  switch (rarity?.toLowerCase()) {
    case 'common':
      return 'text-gray-600 dark:text-gray-400'
    case 'uncommon':
      return 'text-green-600 dark:text-green-400'
    case 'rare':
      return 'text-blue-600 dark:text-blue-400'
    case 'rare holo':
      return 'text-purple-600 dark:text-purple-400'
    case 'rare ultra':
    case 'ultra rare':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'rare secret':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  
  if (error.message) return error.message
  
  switch (error) {
    case 400:
      return 'Please enter a valid search term'
    case 401:
      return 'Authentication failed. Please check the API key.'
    case 404:
      return 'No cards found matching your search'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'Server error. Please try again later.'
    default:
      return 'An error occurred while searching. Please try again.'
  }
}

export function formatCardNumber(number: string): string {
  const parts = number.split('/')
  if (parts.length === 2) {
    return `${parts[0].padStart(3, '0')}/${parts[1]}`
  }
  return number.padStart(3, '0')
}

export function validateSearchResponse(data: any): data is SearchResponse {
  return (
    data &&
    Array.isArray(data.data) &&
    data.data.every((card: any) => (
      card.id &&
      card.name &&
      card.number &&
      card.set?.name &&
      card.images?.small &&
      card.images?.large
    ))
  )
}
