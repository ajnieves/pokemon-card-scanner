export interface PokemonCard {
  id: string
  name: string
  supertype: string
  subtypes?: string[]
  level?: string
  hp?: string
  types?: string[]
  evolvesFrom?: string
  evolvesTo?: string[]
  rules?: string[]
  ancientTrait?: {
    name: string
    text: string
  }
  abilities?: Array<{
    name: string
    text: string
    type: string
  }>
  attacks?: Array<{
    cost: string[]
    name: string
    text: string
    damage: string
    convertedEnergyCost: number
  }>
  weaknesses?: Array<{
    type: string
    value: string
  }>
  resistances?: Array<{
    type: string
    value: string
  }>
  retreatCost?: string[]
  convertedRetreatCost?: number
  set: {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    legalities: {
      unlimited: string
      standard: string
      expanded: string
    }
    ptcgoCode?: string
    releaseDate: string
    updatedAt: string
    images: {
      symbol: string
      logo: string
    }
  }
  number: string
  artist?: string
  rarity: string
  flavorText?: string
  nationalPokedexNumbers?: number[]
  legalities: {
    unlimited: string
    standard: string
    expanded: string
  }
  regulationMark?: string
  images: {
    small: string
    large: string
  }
  tcgplayer?: {
    url: string
    updatedAt: string
    prices: {
      normal?: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
      holofoil?: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
      reverseHolofoil?: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
      '1stEditionHolofoil'?: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
      '1stEditionNormal'?: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
    }
  }
  language?: string
}

export function formatCardNumber(number: string): string {
  return number.padStart(3, '0')
}

export function validateSearchResponse(data: any): data is { data: PokemonCard[] } {
  return (
    data &&
    Array.isArray(data.data) &&
    data.data.every((card: any) =>
      typeof card === 'object' &&
      typeof card.id === 'string' &&
      typeof card.name === 'string' &&
      typeof card.supertype === 'string' &&
      typeof card.number === 'string' &&
      typeof card.rarity === 'string' &&
      typeof card.set === 'object' &&
      typeof card.set.name === 'string' &&
      typeof card.images === 'object' &&
      typeof card.images.small === 'string' &&
      typeof card.images.large === 'string'
    )
  )
}

interface JpnCard {
  id: string
  name: string
  cardNumber?: string
  setId?: string
  setName?: string
  rarity?: string
  image?: string
  imageUrl?: string
  images?: {
    small?: string
    large?: string
  }
  releaseDate?: string
  [key: string]: any
}

export function convertJpnCard(card: JpnCard): PokemonCard {
  // Log the incoming Japanese card data
  console.log('Converting JPN card:', card)

  // Extract image URL from various possible sources
  const imageUrl = card.image || card.imageUrl || card.images?.small || ''
  console.log('JPN card image URL:', imageUrl)

  return {
    id: `jpn-${card.id || Math.random().toString(36).substring(7)}`,
    name: card.name,
    supertype: 'Pokémon',
    number: card.cardNumber || '0',
    rarity: card.rarity || 'Unknown',
    set: {
      id: card.setId || 'unknown',
      name: card.setName || 'Japanese Set',
      series: 'Japanese Series',
      printedTotal: 0,
      total: 0,
      legalities: {
        unlimited: 'Legal',
        standard: 'Legal',
        expanded: 'Legal'
      },
      releaseDate: card.releaseDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: {
        symbol: '',
        logo: ''
      }
    },
    images: {
      small: imageUrl,
      large: imageUrl.replace(/\.(jpg|png)$/, '_large.$1')
    },
    legalities: {
      unlimited: 'Legal',
      standard: 'Legal',
      expanded: 'Legal'
    },
    language: 'JPN'
  }
}
