import React from 'react';
import type { ClientPassageGroup, ClientQuestion } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';

interface Part2ViewerProps {
  passageGroup?: ClientPassageGroup;
  question: ClientQuestion;
}

export const Part2Viewer: React.FC<Part2ViewerProps> = ({ passageGroup, question }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();

  const audioPassage = passageGroup?.passages.find(p => p.mediaType === 'AUDIO' || p.mediaType === 'audio' || p.mediaType === 'VIDEO' || p.mediaType === 'video');
  const isBookmarked = bookmarks.includes(question.id);

  return (
    <div id={`question-${question.id}`} className="max-w-2xl mx-auto bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 mb-3 scroll-mt-20">
      <div className="flex items-start justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px] shadow-sm">
            {question.order}
          </div>
          <span className="text-slate-500 font-medium text-[11px]">Part 2: Question-Response</span>
        </div>
        <button
          onClick={() => toggleBookmark(question.id)}
          className={cn(
            "p-2.5 rounded-full transition-all duration-200",
            isBookmarked 
              ? "bg-amber-100 text-amber-600 shadow-sm" 
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          )}
          title="Đánh dấu xem lại"
        >
          <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {audioPassage?.mediaUrl && (
        <div className="mb-4 w-full bg-slate-50 p-1.5 rounded-lg border border-slate-100 shadow-inner overflow-hidden">
          {audioPassage.mediaType?.toUpperCase() === 'VIDEO' ? (
            <audio
              controls
              controlsList="nodownload noplaybackrate"
              className="w-full"
              src={audioPassage.mediaUrl}
            />
          ) : (
            <audio
              controls
              controlsList="nodownload noplaybackrate"
              className="w-full"
              src={audioPassage.mediaUrl}
            />
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5 w-full">
        {question.options.map((opt) => {
          const isSelected = answers[question.id] === opt.label;
          return (
            <label
              key={opt.id}
              className={cn(
                "group flex items-center gap-1.5 p-1 rounded-md border cursor-pointer transition-all duration-200 w-full",
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
              {/* Trong Part 2 thực tế không hiển thị text của đáp án */}
            </label>
          );
        })}
      </div>
    </div>
  );
};
