import { Progress } from '@/components/ui/progress'

interface FlashcardProgressProps {
  current: number
  total: number
}

export default function FlashcardProgress({ current, total }: FlashcardProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground font-medium">
        <span>Tiến độ bài học</span>
        <span>
          {current} / {total} thẻ ({Math.round(percentage)}%)
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
}
