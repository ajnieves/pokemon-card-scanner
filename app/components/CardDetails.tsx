'use client'

interface CardDetailsProps {
  card: {
    name: string
    number: string
    set: {
      name: string
      printedTotal: number
    }
    rarity?: string
    artist?: string
    tcgplayer?: {
      prices: {
        normal?: {
          market: number
          directLow: number
        }
        holofoil?: {
          market: number
          directLow: number
        }
        reverseHolofoil?: {
          market: number
          directLow: number
        }
      }
    }
  }
}

export default function CardDetails({ card }: CardDetailsProps) {
  const price = card.tcgplayer?.prices?.normal?.market || 
                card.tcgplayer?.prices?.holofoil?.market || 
                card.tcgplayer?.prices?.reverseHolofoil?.market

  const directLow = card.tcgplayer?.prices?.normal?.directLow || 
                   card.tcgplayer?.prices?.holofoil?.directLow || 
                   card.tcgplayer?.prices?.reverseHolofoil?.directLow

  return (
    <div className="flex-1 min-w-0">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {card.set.name} · {card.number}/{card.set.printedTotal}
          </div>
          {price && (
            <div className="text-sm text-gray-400">
              ${price.toFixed(2)}
            </div>
          )}
        </div>
        {card.rarity && (
          <div className="text-sm text-gray-400">
            {card.rarity}
          </div>
        )}
        {card.artist && (
          <div className="text-sm text-gray-400">
            Illustrated by {card.artist}
          </div>
        )}
      </div>
    </div>
  )
}
