import React from 'react';
import { useClientExamStore } from '@/store/useClientExamStore';
import type { ClientQuestion } from '@/types/clientExam.type';

interface QuestionPaletteProps {
  questions: ClientQuestion[];
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({ questions }) => {
  const { answers, bookmarks } = useClientExamStore();

  const handleScrollToQuestion = (questionId: string) => {
    const el = document.getElementById(`question-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight effect
      el.classList.add('bg-yellow-50', 'transition-colors', 'duration-500');
      setTimeout(() => el.classList.remove('bg-yellow-50'), 1500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-20 max-h-[calc(100vh-6rem)] flex flex-col">
      <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Danh sách câu hỏi</h3>

      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-white border inline-block rounded-sm"></span> Chưa làm</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 inline-block rounded-sm"></span> Đã làm</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-white border-2 border-orange-500 inline-block rounded-sm"></span> Đánh dấu</div>
      </div>

      <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q) => {
            const isAnswered = !!answers[q.id];
            const isBookmarked = bookmarks.includes(q.id);

            return (
              <button
                key={q.id}
                onClick={() => handleScrollToQuestion(q.id)}
                className={`
                  w-full aspect-square flex items-center justify-center text-sm font-medium rounded-md border transition-all
                  hover:scale-105 active:scale-95
                  ${isAnswered ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}
                  ${isBookmarked ? 'border-2 border-orange-500 shadow-[0_0_0_1px_rgba(249,115,22,1)]' : ''}
                `}
                title={isBookmarked ? "Đã đánh dấu" : ""}
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
