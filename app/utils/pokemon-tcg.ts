export interface PokemonCard {
  id: string
  name: string
  number: string
  rarity?: string
  images: {
    small: string
    large: string
  }
  set: {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    releaseDate: string
    updatedAt: string
  }
  artist?: string
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
      return 'text-indigo-600 dark:text-indigo-400'
    case 'rare ultra':
      return 'text-purple-600 dark:text-purple-400'
    case 'rare secret':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'rare rainbow':
      return 'text-pink-600 dark:text-pink-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

export function formatCardNumber(number: string): string {
  return number.padStart(3, '0')
}

export function validateSearchResponse(data: any): data is { data: PokemonCard[] } {
  return (
    data &&
    Array.isArray(data.data) &&
    data.data.every((card: any) =>
      card &&
      typeof card.id === 'string' &&
      typeof card.name === 'string' &&
      typeof card.number === 'string' &&
      card.images &&
      typeof card.images.small === 'string' &&
      typeof card.images.large === 'string' &&
      card.set &&
      typeof card.set.name === 'string'
    )
  )
}
