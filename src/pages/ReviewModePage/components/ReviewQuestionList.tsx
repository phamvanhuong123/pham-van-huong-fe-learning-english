import React from 'react';
import type { ReviewPassageGroup, ReviewQuestion, ReviewOption } from '@/types/result.type';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, FileText, Check, X } from 'lucide-react';
import { QuestionNoteEditor } from './QuestionNoteEditor';

interface ReviewQuestionListProps {
  passageGroups: ReviewPassageGroup[];
  standaloneQuestions: ReviewQuestion[];
}

export const ReviewQuestionList: React.FC<ReviewQuestionListProps> = ({ passageGroups, standaloneQuestions }) => {

  const renderOption = (opt: ReviewOption, userAnswer: ReviewQuestion['userAnswer']) => {
    const isSelected = userAnswer?.selectedLabel === opt.label;
    const isCorrect = opt.isCorrect;

    let bgColor = "bg-white hover:bg-gray-50 border-gray-200";
    let textColor = "text-gray-700";
    let icon = null;

    if (isCorrect) {
      bgColor = "bg-green-50 border-green-300";
      textColor = "text-green-800 font-medium";
      icon = <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />;
    } else if (isSelected && !isCorrect) {
      bgColor = "bg-red-50 border-red-300";
      textColor = "text-red-800 font-medium";
      icon = <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />;
    }

    return (
      <div key={opt.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${bgColor}`}>
        <span className={`flex items-center justify-center w-7 h-7 shrink-0 rounded-full text-sm font-bold border ${isCorrect ? 'bg-green-500 text-white border-green-600' : isSelected ? 'bg-red-500 text-white border-red-600' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
          {opt.label}
        </span>
        <div className={`flex-1 ${textColor}`}>
          {opt.text || <span className="italic text-gray-400">Audio/Image Option</span>}
        </div>
        {icon}
      </div>
    );
  };

  const renderQuestion = (q: ReviewQuestion) => {
    const isAnsweredCorrectly = q.userAnswer?.isCorrect;
    const hasAnswer = !!q.userAnswer?.selectedLabel;

    return (
      <div key={q.id} className="py-6 border-b border-gray-100 last:border-0" id={`question-${q.order}`}>
        
        {/* Question Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="shrink-0 mt-1">
            {isAnsweredCorrectly ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : hasAnswer ? (
              <XCircle className="w-6 h-6 text-red-500" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-100 text-xs text-gray-500 font-bold">-</div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900 text-lg">Câu {q.order}</span>
              <Badge variant="outline" className="text-xs font-normal text-gray-500 bg-gray-50">{q.part}</Badge>
            </div>
            {q.questionText && (
              <p className="text-gray-800 font-medium mt-2 text-base leading-relaxed">{q.questionText}</p>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9 mb-6">
          {q.options.map(opt => renderOption(opt, q.userAnswer))}
        </div>

        {/* Explanation & Note */}
        <div className="pl-9 space-y-4">
          
          {/* Explanation Box */}
          {q.explanation && (
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 text-sm">
              <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                <FileText className="w-4 h-4" /> Giải thích chi tiết
              </div>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{q.explanation}</div>
            </div>
          )}

          {/* AI Explanation Placeholder */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100/50 text-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <span className="text-lg">✨</span> Giải thích bằng AI
              </div>
              <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200">BETA</Badge>
            </div>
            <div className="text-indigo-900/70 italic text-center py-4 bg-white/40 rounded border border-indigo-50 border-dashed">
              Tính năng đang được phát triển. AI sẽ giúp bạn phân tích từng câu hỏi một cách cá nhân hóa!
            </div>
          </div>

          {/* Note Editor */}
          <QuestionNoteEditor questionId={q.id} initialNote={q.note} />
        </div>
      </div>
    );
  };

  const renderPassageGroup = (pg: ReviewPassageGroup) => (
    <div key={pg.id} className="mb-12 bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
      
      {/* Passages / Media */}
      <div className="bg-gray-50 p-6 border-b border-gray-200 space-y-6">
        {pg.passages.map((p, idx) => (
          <div key={p.id} className="space-y-4">
            {pg.passages.length > 1 && <h4 className="font-bold text-gray-600 uppercase text-xs tracking-wider">Đoạn {idx + 1}</h4>}
            
            {p.mediaType === 'IMAGE' && p.mediaUrl && (
              <img src={p.mediaUrl} alt="passage image" className="max-w-full rounded-lg shadow-sm border border-gray-200" />
            )}
            
            {p.mediaType === 'AUDIO' && p.mediaUrl && (
              <audio controls src={p.mediaUrl} className="w-full h-12" />
            )}

            {p.content && (
              <div className="bg-white p-5 rounded-lg border border-gray-200 text-gray-800 leading-relaxed font-serif whitespace-pre-wrap shadow-sm">
                {p.content}
              </div>
            )}

            {/* Transcript cho Audio */}
            {p.transcript && (
              <div className="mt-3 bg-yellow-50/50 p-4 rounded-lg border border-yellow-100 text-sm">
                <h5 className="font-bold text-yellow-800 mb-2">Transcript / Dịch nghĩa:</h5>
                <div className="text-yellow-900/80 whitespace-pre-wrap">{p.transcript}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Questions in group */}
      <div className="p-6">
        {pg.questions.map(renderQuestion)}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Render Passage Groups */}
        {passageGroups.map(renderPassageGroup)}
        
        {/* Render Standalone Questions (Part 5) */}
        {standaloneQuestions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm p-5">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-4 mb-4">Câu hỏi rời (Part 5)</h3>
            {standaloneQuestions.map(renderQuestion)}
          </div>
        )}
      </div>
    </div>
  );
};
