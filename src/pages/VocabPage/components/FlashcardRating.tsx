import { Button } from '@/components/ui/button'

interface PreviewIntervals {
  again: string
  hard: string
  good: string
  easy: string
}

interface FlashcardRatingProps {
  onRate: (rating: number) => void
  disabled?: boolean
  previewIntervals?: PreviewIntervals
}

const RATING_BUTTONS = [
  { rating: 1, label: 'Lại', color: 'bg-red-500 hover:bg-red-600', key: 'again' as const },
  { rating: 2, label: 'Khó', color: 'bg-orange-500 hover:bg-orange-600', key: 'hard' as const },
  { rating: 3, label: 'Tốt', color: 'bg-green-500 hover:bg-green-600', key: 'good' as const },
  { rating: 4, label: 'Dễ', color: 'bg-blue-500 hover:bg-blue-600', key: 'easy' as const },
]

function formatInterval(targetDate: string): string {
  if (!targetDate) return '-'
  const now = new Date()
  const target = new Date(targetDate)

  const diffMs = target.getTime() - now.getTime()
  const diffMins = Math.round(diffMs / (60 * 1000))

  if (diffMins < 1) return '< 1m'
  if (diffMins < 60) return `${diffMins}m`

  const diffHours = Math.round(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d`

  const diffMonths = Math.round(diffDays / 30.44)
  if (diffMonths < 12) return `${diffMonths}mo`

  const diffYears = Math.round(diffDays / 365)
  return `${diffYears}y`
}

export default function FlashcardRating({
  onRate,
  disabled,
  previewIntervals,
}: FlashcardRatingProps) {
  return (
    <div className="flex justify-center gap-2 sm:gap-4 mt-8">
      {RATING_BUTTONS.map((btn) => (
        <Button
          key={btn.rating}
          className={`h-auto py-3 px-4 sm:px-8 flex-col gap-1 text-white ${btn.color}`}
          onClick={() => onRate(btn.rating)}
          disabled={disabled}
        >
          <span className="text-xs opacity-90 font-normal">
            {previewIntervals ? formatInterval(previewIntervals[btn.key]) : '-'}
          </span>
          <span className="font-bold text-lg">{btn.label}</span>
        </Button>
      ))}
    </div>
  )
}
