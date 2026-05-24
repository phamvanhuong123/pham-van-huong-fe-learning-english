import React from 'react';
import { useExamTimer } from '@/hooks/useExamTimer';
import { useClientExamStore } from '@/store/useClientExamStore';

interface ExamHeaderProps {
  title: string;
  duration: number;
  onSubmit: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ title, duration, onSubmit }) => {
  const { isSubmitting } = useClientExamStore();
  const { formattedTime, isWarning } = useExamTimer(duration, onSubmit);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 line-clamp-1">{title}</h1>

        <div className="flex items-center gap-6">
          <div className={`text-2xl font-mono font-bold ${isWarning ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
            ⏱ {formattedTime}
          </div>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp Bài'}
          </button>
        </div>
      </div>
    </header>
  );
};
