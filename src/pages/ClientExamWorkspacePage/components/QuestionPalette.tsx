import React from 'react';
import { useClientExamStore } from '@/store/useClientExamStore';
import type { ClientQuestion } from '@/types/clientExam.type';

interface QuestionPaletteProps {
  questions: ClientQuestion[];
  activePart?: string;
  onNavigateToPart?: (part: string) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({ questions, activePart, onNavigateToPart }) => {
  const { answers, bookmarks } = useClientExamStore();

  const handleScrollToQuestion = (questionId: string) => {
    const el = document.getElementById(`question-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-yellow-50', 'transition-colors', 'duration-500');
      setTimeout(() => el.classList.remove('bg-yellow-50'), 1500);
    }
  };

  const handleQuestionClick = (q: ClientQuestion) => {
    if (onNavigateToPart && activePart && q.part && q.part !== activePart) {
      onNavigateToPart(q.part);
      // Đợi render DOM mới rồi cuộn
      setTimeout(() => handleScrollToQuestion(q.id), 150);
    } else {
      handleScrollToQuestion(q.id);
    }
  };

  // Group questions by part from backend data
  const groupedQuestions = questions.reduce((acc, q) => {
    // Ưu tiên dùng trường part thật từ database, nếu thiếu thì mới dùng hàm backup (mini tests)
    const part = q.part || 'Other';
    if (!acc[part]) acc[part] = [];
    acc[part].push(q);
    return acc;
  }, {} as Record<string, ClientQuestion[]>);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-md shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24 flex flex-col h-[calc(100vh-7rem)]">
      
      {/* Top Header Section (Sticky) */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Danh sách câu hỏi</h3>
        <p className="text-xs text-orange-500 italic mb-2">
          * Click vào câu hỏi để đánh dấu xem lại
        </p>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-1">
          <div 
            className="h-full bg-blue-500 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 text-right font-medium">Đã làm {answeredCount}/{questions.length}</p>
      </div>

      {/* Questions Scrollable List */}
      <div className="overflow-y-auto p-4 custom-scrollbar flex-1">
        {Object.entries(groupedQuestions).map(([part, qs]) => (
          <div key={part} className="mb-6 last:mb-0">
            <h4 className="font-bold text-gray-800 mb-3">{part}</h4>
            <div className="grid grid-cols-5 gap-2">
              {qs.map((q) => {
                const isAnswered = !!answers[q.id];
                const isBookmarked = bookmarks.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(q)}
                    className={`
                      w-full h-8 flex items-center justify-center text-xs font-semibold rounded border transition-all duration-200
                      hover:border-blue-300
                      ${isAnswered ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 border-gray-200'}
                      ${isBookmarked ? 'border-2 border-orange-400 bg-orange-50 text-orange-700' : ''}
                    `}
                    title={isBookmarked ? "Đã đánh dấu" : ""}
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
