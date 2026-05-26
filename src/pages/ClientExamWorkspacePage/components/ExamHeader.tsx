import React from 'react';
import { useExamTimer } from '@/hooks/useExamTimer';
import { useClientExamStore } from '@/store/useClientExamStore';

interface ExamHeaderProps {
  title: string;
  duration: number;
  onSubmit: (forceSubmit?: boolean) => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ title, duration, onSubmit }) => {
  const { isSubmitting } = useClientExamStore();
  const { formattedTime, isWarning } = useExamTimer(duration, () => onSubmit(true));

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 line-clamp-1">{title}</h1>

        <div className="flex items-center gap-6">
          <div className={`text-2xl font-mono font-bold tracking-wider ${isWarning ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
            ⏱ {formattedTime}
          </div>

          <button
            onClick={() => onSubmit(false)}
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded shadow-sm transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp Bài'}
          </button>
        </div>
      </div>
    </header>
  );
};
