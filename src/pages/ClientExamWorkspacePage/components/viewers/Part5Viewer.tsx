import React from 'react';
import type { ClientQuestion } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';

interface Part5ViewerProps {
  question: ClientQuestion;
}

export const Part5Viewer: React.FC<Part5ViewerProps> = ({ question }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();
  const isBookmarked = bookmarks.includes(question.id);

  return (
    <div id={`question-${question.id}`} className="max-w-2xl mx-auto bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 mb-3 scroll-mt-20">
      <div className="flex gap-2 mb-3">
        <div className="w-5 h-5 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px] shadow-sm">
          {question.order}
        </div>
        <div className="flex-1 pt-0">
          <p className="font-semibold text-slate-800 text-[12px] md:text-[13px] leading-snug">
            {question.questionText}
          </p>
        </div>
        <button
          onClick={() => toggleBookmark(question.id)}
          className={cn(
            "p-2.5 h-fit shrink-0 rounded-full transition-all duration-200",
            isBookmarked 
              ? "bg-amber-100 text-amber-600 shadow-sm" 
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          )}
          title="Đánh dấu xem lại"
        >
          <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-col gap-3 pl-0 md:pl-14">
        {question.options.map((opt) => {
          const isSelected = answers[question.id] === opt.label;
          return (
            <label
              key={opt.id}
              className={cn(
                "group flex items-center gap-2 p-1 rounded-md border cursor-pointer transition-all duration-200",
                isSelected 
                  ? "bg-blue-50/50 border-blue-200 shadow-sm" 
                  : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300"
              )}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt.label}
                checked={isSelected}
                onChange={() => selectAnswer(question.id, opt.label)}
                className="sr-only"
              />
              <div className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full border-[1.5px] text-[10px] font-bold transition-all duration-200 shrink-0",
                isSelected 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "bg-white border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-500"
              )}>
                {opt.label}
              </div>
              <span className={cn(
                "font-medium text-[12px]",
                isSelected ? "text-slate-900" : "text-slate-600"
              )}>
                {opt.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
