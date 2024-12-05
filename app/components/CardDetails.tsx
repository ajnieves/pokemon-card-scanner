import { PokemonCard, getCardRarityColor, formatCardNumber } from '../utils/pokemon-tcg'

interface CardDetailsProps {
  card: PokemonCard
  compact?: boolean
}

export default function CardDetails({ card, compact = false }: CardDetailsProps) {
  return (
    <div className="flex-1 min-w-0">
      {!compact && (
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          #{formatCardNumber(card.number)}
        </p>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{card.set.name}</p>
      <p className={`text-sm ${getCardRarityColor(card.rarity)} truncate`}>
        {card.rarity || 'Unknown'}
      </p>
      {card.artist && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 truncate">
          {card.artist}
        </p>
      )}
    </div>
  )
}
