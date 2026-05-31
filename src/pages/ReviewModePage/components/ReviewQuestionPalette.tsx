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

  const groupedQuestions = questions.reduce((acc, q) => {
    const part = q.part || 'Other';
    if (!acc[part]) acc[part] = [];
    acc[part].push(q);
    return acc;
  }, {} as Record<string, ReviewQuestion[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col h-[calc(100vh-140px)]">
      <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Danh sách câu hỏi</h3>

      <div className="flex items-center justify-between mb-4 text-xs font-medium text-slate-600 px-1">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 inline-block rounded-full"></span> Đúng</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 inline-block rounded-full"></span> Sai</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-white border-2 border-slate-300 inline-block rounded-full"></span> Bỏ qua</div>
      </div>

      <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
        {Object.entries(groupedQuestions).map(([part, qs]) => (
          <div key={part} className="mb-5 last:mb-0">
            <h4 className="font-semibold text-slate-700 mb-2.5 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              {part.replace('PART', 'Part ')}
            </h4>
            <div className="grid grid-cols-5 gap-1.5">
              {qs.map((q) => {
                const hasAnswer = !!q.userAnswer?.selectedLabel;
                const isCorrect = q.userAnswer?.isCorrect;

                let btnClass = "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"; // Missed
                if (hasAnswer) {
                  if (isCorrect) {
                    btnClass = "bg-green-500 text-white border-green-600 hover:bg-green-600 shadow-sm";
                  } else {
                    btnClass = "bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-sm";
                  }
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(q)}
                    className={`
                      w-full h-7 flex items-center justify-center text-[10px] font-bold rounded-sm border transition-all duration-200
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
        ))}
      </div>
    </div>
  );
};
