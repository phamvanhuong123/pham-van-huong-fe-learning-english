import React from 'react';
import type { ReviewQuestion } from '@/types/result.type';

interface ReviewQuestionPaletteProps {
  questions: ReviewQuestion[];
  activePart?: string;
  onNavigateToPart?: (part: string) => void;
}

export const ReviewQuestionPalette: React.FC<ReviewQuestionPaletteProps> = ({ questions, activePart, onNavigateToPart }) => {
  const handleScrollToQuestion = (order: number) => {
    const el = document.getElementById(`question-${order}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight effect
      el.classList.add('bg-yellow-50', 'transition-colors', 'duration-500');
      setTimeout(() => el.classList.remove('bg-yellow-50'), 1500);
    }
  };

  const handleQuestionClick = (q: ReviewQuestion) => {
    if (onNavigateToPart && activePart && q.part && q.part !== activePart) {
      onNavigateToPart(q.part);
      setTimeout(() => handleScrollToQuestion(q.order), 150);
    } else {
      handleScrollToQuestion(q.order);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col h-[calc(100vh-140px)]">
      <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Danh sách câu hỏi</h3>

      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 inline-block rounded-sm"></span> Đúng</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 inline-block rounded-sm"></span> Sai</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 border inline-block rounded-sm"></span> Bỏ qua</div>
      </div>

      <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
        <div className="grid grid-cols-6 gap-2">
          {questions.map((q) => {
            const hasAnswer = !!q.userAnswer?.selectedLabel;
            const isCorrect = q.userAnswer?.isCorrect;

            let btnClass = "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"; // Missed
            if (hasAnswer) {
              if (isCorrect) {
                btnClass = "bg-green-500 text-white border-green-600 hover:bg-green-600";
              } else {
                btnClass = "bg-red-500 text-white border-red-600 hover:bg-red-600";
              }
            }

            return (
              <button
                key={q.id}
                onClick={() => handleQuestionClick(q)}
                className={`
                  w-full h-9 flex items-center justify-center text-xs font-medium rounded-md border transition-all
                  hover:scale-105 active:scale-95
                  ${btnClass}
                `}
              >
                {q.order}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
