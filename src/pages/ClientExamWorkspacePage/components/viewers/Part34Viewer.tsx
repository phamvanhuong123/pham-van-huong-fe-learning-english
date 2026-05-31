import React from 'react';
import type { ClientPassageGroup } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';
import { cn } from '@/lib/utils';
import { Bookmark, Headphones } from 'lucide-react';

interface Part34ViewerProps {
  passageGroup: ClientPassageGroup;
}

export const Part34Viewer: React.FC<Part34ViewerProps> = ({ passageGroup }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();

  const audioPassage = passageGroup?.passages.find(p => p.mediaType === 'AUDIO' || p.mediaType === 'audio' || p.mediaType === 'VIDEO' || p.mediaType === 'video');
  const imagePassage = passageGroup.passages.find(p => p.mediaType === 'IMAGE' || p.mediaType === 'image');

  // Lấy ra danh sách các câu hỏi trong nhóm này (ví dụ: 32-34)
  const questionNumbers = passageGroup.questions.map(q => q.order).join(' - ');

  return (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
      {/* Passage Header / Audio Player */}
      <div className="mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 mb-3">
          <Headphones className="w-3.5 h-3.5 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-800">
            Questions <span className="text-blue-600">{questionNumbers}</span> refer to the following conversation.
          </h3>
        </div>

        {imagePassage?.mediaUrl && (
          <div className="rounded-lg overflow-hidden border border-slate-200/60 bg-slate-50 max-w-sm mx-auto mb-3 p-1">
            <img src={imagePassage.mediaUrl} alt="Passage Image" className="w-full h-auto object-contain rounded-md" />
          </div>
        )}

        {audioPassage?.mediaUrl && (
          <div className="max-w-sm mx-auto w-full bg-slate-50 p-1 rounded-lg border border-slate-100 shadow-inner overflow-hidden">
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
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-4">
        {passageGroup.questions.map((question) => {
          const isBookmarked = bookmarks.includes(question.id);

          return (
            <div id={`question-${question.id}`} key={question.id} className="scroll-mt-20">
              <div className="flex gap-2 mb-2">
                <div className="w-5 h-5 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-[10px] border border-slate-200">
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
                    "p-2 h-fit shrink-0 rounded-full transition-all duration-200",
                    isBookmarked 
                      ? "bg-amber-100 text-amber-600 shadow-sm" 
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  )}
                  title="Đánh dấu xem lại"
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex flex-col gap-1 pl-0 md:pl-7">
                {question.options.map((opt) => {
                  const isSelected = answers[question.id] === opt.label;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "group flex items-center gap-1.5 p-1 rounded-md border cursor-pointer transition-all duration-200",
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
                        "flex items-center justify-center w-4 h-4 rounded-full border-[1.2px] text-[9px] font-bold transition-all duration-200 shrink-0",
                        isSelected 
                          ? "bg-blue-600 border-blue-600 text-white" 
                          : "bg-white border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-500"
                      )}>
                        {opt.label}
                      </div>
                      <span className={cn(
                        "font-medium text-[11px] md:text-[12px]",
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
        })}
      </div>
    </div>
  );
};
