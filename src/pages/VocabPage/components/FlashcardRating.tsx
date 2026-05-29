import { Button } from '@/components/ui/button';

interface FlashcardRatingProps {
  onRate: (rating: number) => void;
  disabled?: boolean;
}

const RATING_BUTTONS = [
  { rating: 1, label: 'Quên', subLabel: 'Reset', color: 'bg-red-500 hover:bg-red-600' },
  { rating: 3, label: 'Khó', subLabel: 'Chậm', color: 'bg-orange-500 hover:bg-orange-600' },
  { rating: 4, label: 'Tốt', subLabel: 'Bình thường', color: 'bg-green-500 hover:bg-green-600' },
  { rating: 5, label: 'Dễ', subLabel: 'Nhanh', color: 'bg-blue-500 hover:bg-blue-600' },
];

export default function FlashcardRating({ onRate, disabled }: FlashcardRatingProps) {
  return (
    <div className="flex justify-center gap-2 sm:gap-4 mt-8">
      {RATING_BUTTONS.map((btn) => (
        <Button
          key={btn.rating}
          className={`h-auto py-3 px-4 sm:px-8 flex-col gap-1 text-white ${btn.color}`}
          onClick={() => onRate(btn.rating)}
          disabled={disabled}
        >
          <span className="font-bold text-lg">{btn.label}</span>
          <span className="text-xs opacity-90 font-normal">{btn.subLabel}</span>
        </Button>
      ))}
    </div>
  );
}
