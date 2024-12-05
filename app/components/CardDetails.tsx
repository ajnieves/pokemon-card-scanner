import { PokemonCard, getCardRarityColor } from '../utils/pokemon-tcg'

interface CardDetailsProps {
  card: PokemonCard
  compact?: boolean
  hideRarity?: boolean
}

export default function CardDetails({ card, compact = false, hideRarity = false }: CardDetailsProps) {
  return (
    <div className="flex-1 min-w-0">
      {!compact && (
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          #{card.number.padStart(3, '0')}
        </p>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{card.set.name}</p>
      {!hideRarity && card.rarity && (
        <p className={`text-sm ${getCardRarityColor(card.rarity)} truncate`}>
          {card.rarity}
        </p>
      )}
      {card.artist && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 truncate">
          {card.artist}
        </p>
      )}
    </div>
  )
}
