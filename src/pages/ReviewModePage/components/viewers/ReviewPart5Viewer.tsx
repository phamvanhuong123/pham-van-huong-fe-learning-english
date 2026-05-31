import React from 'react';
import type { ReviewQuestion } from '@/types/result.type';
import { cn } from '@/lib/utils';
import { Check, X, FileText } from 'lucide-react';
import { AIExplanationBox } from '../AIExplanationBox';
import { QuestionNoteEditor } from '../QuestionNoteEditor';

interface ReviewPart5ViewerProps {
  question: ReviewQuestion;
}

export const ReviewPart5Viewer: React.FC<ReviewPart5ViewerProps> = ({ question }) => {
  const isAnsweredCorrectly = question.userAnswer?.isCorrect;
  const hasAnswer = !!question.userAnswer?.selectedLabel;

  return (
    <div id={`question-${question.order}`} className="max-w-2xl mx-auto bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 mb-6 scroll-mt-20">
      <div className="flex gap-3 mb-4">
        <div className={cn(
          "w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-bold text-xs shadow-sm mt-0.5",
          isAnsweredCorrectly ? "bg-green-100 text-green-700" : hasAnswer ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
        )}>
          {question.order}
        </div>
        <div className="flex-1 pt-0">
          <div
            className="font-semibold text-slate-800 text-sm md:text-[15px] leading-snug"
            dangerouslySetInnerHTML={{ __html: question.questionText || '' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pl-0 md:pl-9 mb-4">
        {question.options.map((opt) => {
          const isSelected = question.userAnswer?.selectedLabel === opt.label;
          const isCorrect = opt.isCorrect;

          let bgColor = "bg-white border-slate-200";
          let textColor = "text-slate-600";
          let circleColor = "bg-white border-slate-300 text-slate-500";
          let icon = null;

          if (isCorrect) {
            bgColor = "bg-green-50 border-green-300 shadow-sm";
            textColor = "text-green-800 font-medium";
            circleColor = "bg-green-600 border-green-600 text-white";
            icon = <Check className="w-4 h-4 text-green-600 shrink-0 ml-auto" />;
          } else if (isSelected && !isCorrect) {
            bgColor = "bg-red-50 border-red-300 shadow-sm";
            textColor = "text-red-800 font-medium";
            circleColor = "bg-red-600 border-red-600 text-white";
            icon = <X className="w-4 h-4 text-red-600 shrink-0 ml-auto" />;
          }

          return (
            <div
              key={opt.id}
              className={cn(
                "group flex items-center gap-2.5 p-2 rounded-md border transition-all duration-200",
                bgColor
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full border-[1.5px] text-[10px] font-bold shrink-0",
                circleColor
              )}>
                {opt.label}
              </div>
              <span className={cn(
                "font-medium text-[13px] md:text-sm",
                textColor
              )}>
                {opt.text}
              </span>
              {icon}
            </div>
          );
        })}
      </div>

      <div className="pl-0 md:pl-9 space-y-4">
        {question.explanation && (
          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 text-sm">
            <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
              <FileText className="w-4 h-4" /> Giải thích chi tiết
            </div>
            <div
              className="text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: question.explanation }}
            />
          </div>
        )}

        <AIExplanationBox question={question} />
        
        <QuestionNoteEditor questionId={question.id} initialNote={question.note} />
      </div>
    </div>
  );
};
