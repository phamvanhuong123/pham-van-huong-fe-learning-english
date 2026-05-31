import React from 'react';
import type { ReviewPassageGroup, ReviewQuestion } from '@/types/result.type';
import { cn } from '@/lib/utils';
import { Check, X, FileText } from 'lucide-react';
import { QuestionNoteEditor } from '../QuestionNoteEditor';

interface ReviewPart1ViewerProps {
  passageGroup?: ReviewPassageGroup;
  question: ReviewQuestion;
}

export const ReviewPart1Viewer: React.FC<ReviewPart1ViewerProps> = ({ passageGroup, question }) => {
  const audioPassage = passageGroup?.passages.find(p => p.mediaType === 'AUDIO' || p.mediaType === 'VIDEO');
  const imagePassage = passageGroup?.passages.find(p => p.mediaType === 'IMAGE');
  const videoPassage = passageGroup?.passages.find(p => p.mediaType === 'VIDEO');

  const isAnsweredCorrectly = question.userAnswer?.isCorrect;
  const hasAnswer = !!question.userAnswer?.selectedLabel;

  return (
    <div id={`question-${question.order}`} className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 mb-6 scroll-mt-20">
      <div className="flex items-start justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-sm",
            isAnsweredCorrectly ? "bg-green-100 text-green-700" : hasAnswer ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
          )}>
            {question.order}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Video/Image Area */}
        {videoPassage?.mediaUrl && (
          <div className="rounded-lg overflow-hidden bg-slate-50 max-w-lg mx-auto shadow-sm border border-slate-200/60 p-1.5">
            <video
              className="w-full h-auto object-contain max-h-[300px] rounded-md pointer-events-none"
              src={videoPassage.mediaUrl}
            />
          </div>
        )}

        {!videoPassage && imagePassage?.mediaUrl && (
          <div className="rounded-lg overflow-hidden bg-slate-50 max-w-lg mx-auto shadow-sm border border-slate-200/60 p-1.5">
            <img
              src={imagePassage.mediaUrl}
              alt="Part 1"
              className="w-full h-auto object-contain max-h-[300px] rounded-md pointer-events-none"
            />
          </div>
        )}

        {/* Audio Controls Area */}
        {(videoPassage?.mediaUrl || audioPassage?.mediaUrl) && (
          <div className="max-w-lg mx-auto w-full bg-slate-50 p-1.5 rounded-lg border border-slate-100 shadow-inner overflow-hidden">
            <audio
              controls
              controlsList="nodownload noplaybackrate"
              className="w-full"
              src={videoPassage?.mediaUrl || audioPassage?.mediaUrl || ''}
            />
          </div>
        )}

        {/* Answer Options */}
        <div className="flex flex-col gap-2 max-w-lg mx-auto w-full mt-2">
          {question.options.map((opt) => {
            const isSelected = question.userAnswer?.selectedLabel === opt.label;
            const isCorrect = opt.isCorrect;

            let bgColor = "bg-white border-slate-200";
            let textColor = "text-slate-500";
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
                  "flex items-center gap-3 p-2.5 rounded-md border transition-all duration-200 w-full",
                  bgColor
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] text-xs font-bold shrink-0",
                  circleColor
                )}>
                  {opt.label}
                </div>
                <div className={cn("text-sm flex-1", textColor)}>
                  {opt.text || <span className="italic text-slate-400">Audio Option</span>}
                </div>
                {icon}
              </div>
            );
          })}
        </div>

        {/* Transcript / Explanation Area */}
        <div className="max-w-lg mx-auto w-full space-y-4 mt-4">
          {audioPassage?.transcript && (
            <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-100 text-sm">
              <h5 className="font-bold text-yellow-800 mb-2">Transcript / Dịch nghĩa:</h5>
              <div
                className="text-yellow-900/80 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: audioPassage.transcript }}
              />
            </div>
          )}

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

          <QuestionNoteEditor questionId={question.id} initialNote={question.note} />
        </div>
      </div>
    </div>
  );
};
