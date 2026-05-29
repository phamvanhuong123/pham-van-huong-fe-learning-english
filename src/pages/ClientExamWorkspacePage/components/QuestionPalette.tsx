import React from 'react';
import { useClientExamStore } from '@/store/useClientExamStore';
import type { ClientQuestion } from '@/types/clientExam.type';
import { cn } from '@/lib/utils';
import { CheckCircle2, CircleDashed, Bookmark } from 'lucide-react';

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
      // Remove old classes if they exist
      el.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-4', 'transition-all');
      // Force reflow
      void el.offsetWidth;
      // Add highlight effect
      el.classList.add('ring-2', 'ring-blue-400', 'ring-offset-4', 'transition-all', 'duration-500');
      setTimeout(() => el.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-4'), 1500);
    }
  };

  const handleQuestionClick = (q: ClientQuestion) => {
    if (onNavigateToPart && activePart && q.part && q.part !== activePart) {
      onNavigateToPart(q.part);
      setTimeout(() => handleScrollToQuestion(q.id), 150);
    } else {
      handleScrollToQuestion(q.id);
    }
  };

  const groupedQuestions = questions.reduce((acc, q) => {
    const part = q.part || 'Other';
    if (!acc[part]) acc[part] = [];
    acc[part].push(q);
    return acc;
  }, {} as Record<string, ClientQuestion[]>);

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-20 flex flex-col h-[calc(100vh-6.5rem)] overflow-hidden">
      
      {/* Top Header Section */}
      <div className="p-3 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800 text-xs">Tiến độ</h3>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700">
            {answeredCount}/{questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 justify-center">
          <div className="flex items-center gap-1.5">
            <CircleDashed className="w-3.5 h-3.5 text-slate-300" />
            <span>Chưa làm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Đã làm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Đánh dấu</span>
          </div>
        </div>
      </div>

      {/* Questions Scrollable List */}
      <div className="overflow-y-auto p-3 custom-scrollbar flex-1 bg-white">
        {Object.entries(groupedQuestions).map(([part, qs]) => (
          <div key={part} className="mb-4 last:mb-0">
            <h4 className="font-semibold text-slate-800 mb-2 text-xs flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              {part.replace('PART', 'Part ')}
            </h4>
            <div className="grid grid-cols-5 gap-1">
              {qs.map((q) => {
                const isAnswered = !!answers[q.id];
                const isBookmarked = bookmarks.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(q)}
                    className={cn(
                      "relative w-full h-6 flex items-center justify-center text-[10px] font-bold rounded-sm border transition-all duration-200",
                      isAnswered 
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50",
                      isBookmarked && !isAnswered && "border-amber-400 bg-amber-50 text-amber-700",
                      isBookmarked && isAnswered && "ring-1 ring-amber-400 ring-offset-1"
                    )}
                    title={isBookmarked ? "Đã đánh dấu" : ""}
                  >
                    {q.order}
                    {/* Small bookmark indicator for answered questions */}
                    {isBookmarked && isAnswered && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
                    )}
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
