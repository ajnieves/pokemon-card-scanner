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
  language?: 'EN' | 'JPN'
}

export interface JpnPokemonCard {
  id: number
  name: string
  printedNumber: string
  rarity?: string
  imageUrl: string
  setData: {
    name: string
    printedTotal: string
    total: number
    year: string
    image_url: string
    set_url: string
  }
  artist?: string
}

export function convertJpnCard(card: JpnPokemonCard): PokemonCard {
  return {
    id: card.id.toString(),
    name: card.name,
    number: card.printedNumber,
    rarity: card.rarity,
    images: {
      small: card.imageUrl,
      large: card.imageUrl
    },
    set: {
      id: '0',
      name: card.setData.name,
      series: '',
      printedTotal: parseInt(card.setData.printedTotal),
      total: card.setData.total,
      releaseDate: card.setData.year,
      updatedAt: ''
    },
    artist: card.artist,
    language: 'JPN'
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
    case 'rare holo lv.x':
      return 'text-indigo-600 dark:text-indigo-400'
    case 'rare ultra':
    case 'ultra rare':
      return 'text-purple-600 dark:text-purple-400'
    case 'rare secret':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'rare rainbow':
      return 'text-pink-600 dark:text-pink-400'
    case 'prism rare':
      return 'text-orange-600 dark:text-orange-400'
    case 'shiny':
    case 'shiny super rare':
      return 'text-teal-600 dark:text-teal-400'
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

export function validateJpnSearchResponse(data: any): data is { data: JpnPokemonCard[] } {
  return (
    data &&
    Array.isArray(data.data) &&
    data.data.every((card: any) =>
      card &&
      typeof card.id === 'number' &&
      typeof card.name === 'string' &&
      typeof card.printedNumber === 'string' &&
      typeof card.imageUrl === 'string' &&
      card.setData &&
      typeof card.setData.name === 'string'
    )
  )
}
