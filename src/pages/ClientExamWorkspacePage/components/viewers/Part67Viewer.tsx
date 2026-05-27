import React from 'react';
import type { ClientPassageGroup } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';
import { cn } from '@/lib/utils';
import { Bookmark, FileText } from 'lucide-react';

interface Part67ViewerProps {
  passageGroup: ClientPassageGroup;
  part: string; // 'PART6' | 'PART7'
}

export const Part67Viewer: React.FC<Part67ViewerProps> = ({ passageGroup, part }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();
  const isPart6 = part === 'PART6';
  const questionNumbers = passageGroup.questions.map(q => q.order).join(' - ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-4 overflow-hidden">
      
      {/* Container - Split View for Large Screens */}
      <div className="flex flex-col xl:flex-row h-full">
        
        {/* Left Column: Passage Content */}
        <div className="w-full xl:w-[55%] flex flex-col xl:border-r border-slate-100 xl:max-h-[calc(100vh-6rem)] xl:sticky xl:top-20">
          <div className="p-2.5 md:p-3 border-b border-slate-50 bg-slate-50/50 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <h3 className="font-bold text-slate-800 text-[11px] md:text-[12px]">
              Questions <span className="text-blue-600">{questionNumbers}</span> refer to the following {isPart6 ? 'text' : 'passage'}.
            </h3>
          </div>
          
          <div className="p-3 md:p-4 overflow-y-auto custom-scrollbar flex-1 bg-white">
            {passageGroup.passages.map((passage, idx) => (
              <div key={passage.id} className="passage-content mb-4 last:mb-0">
                {passage.mediaType === 'IMAGE' && passage.mediaUrl && (
                  <img 
                    src={passage.mediaUrl} 
                    alt={`Passage ${idx + 1}`} 
                    className="w-full h-auto rounded-md border border-slate-200 mb-3 shadow-sm max-h-[300px] object-contain" 
                  />
                )}
                {passage.content && (
                  <div
                    className="prose prose-slate prose-blue max-w-none text-slate-800 leading-relaxed bg-slate-50/50 border border-slate-100 shadow-inner p-3 md:p-4 rounded-lg font-medium text-[12px] md:text-[13px]"
                    dangerouslySetInnerHTML={{ __html: passage.content }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Questions List */}
        <div className="w-full xl:w-[45%] flex flex-col bg-slate-50/30 xl:max-h-[calc(100vh-6rem)]">
          <div className="p-3 md:p-4 overflow-y-auto custom-scrollbar flex-1">
            <div className="flex flex-col gap-4">
              {passageGroup.questions.map((question) => {
                const isBookmarked = bookmarks.includes(question.id);

                return (
                  <div id={`question-${question.id}`} key={question.id} className="scroll-mt-20 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex gap-2 mb-2.5">
                      <div className="w-5 h-5 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-[10px] border border-slate-200 mt-0.5">
                        {question.order}
                      </div>
                      <div className="flex-1 pt-0">
                        {!isPart6 && question.questionText && (
                          <p className="font-semibold text-slate-800 text-[12px] md:text-[13px] leading-snug">
                            {question.questionText}
                          </p>
                        )}
                        {isPart6 && (
                          <p className="text-slate-400 italic text-[11px] md:text-[12px] font-medium">
                            Chọn từ thích hợp điền vào chỗ trống số {question.order}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleBookmark(question.id)}
                        className={cn(
                          "p-1.5 h-fit shrink-0 rounded-md transition-all duration-200",
                          isBookmarked 
                            ? "bg-amber-100 text-amber-600" 
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
                                ? "bg-blue-50/80 border-blue-200 shadow-sm" 
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
        </div>

      </div>
    </div>
  );
};
