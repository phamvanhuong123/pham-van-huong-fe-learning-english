import React from 'react';
import type { ClientPassageGroup, ClientQuestion } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';

interface Part2ViewerProps {
  passageGroup?: ClientPassageGroup;
  question: ClientQuestion;
}

export const Part2Viewer: React.FC<Part2ViewerProps> = ({ passageGroup, question }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();

  const audioPassage = passageGroup?.passages.find(p => p.mediaType === 'AUDIO' || p.mediaType === 'audio');
  const isBookmarked = bookmarks.includes(question.id);

  return (
    <div id={`question-${question.id}`} className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 scroll-mt-24">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <h3 className="text-xl font-bold text-gray-800">
          <span className="bg-blue-600 text-white w-8 h-8 inline-flex items-center justify-center rounded-full text-sm mr-3">
            {question.order}
          </span>
          Question {question.order}
        </h3>
        <button
          onClick={() => toggleBookmark(question.id)}
          className={`p-2 rounded-md transition-colors ${isBookmarked ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
          title="Đánh dấu xem lại"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {audioPassage?.mediaUrl && (
        <div className="mb-10 p-4 bg-blue-50 rounded-lg border border-blue-100 flex justify-center">
          <audio
            controls
            controlsList="nodownload noplaybackrate"
            className="w-full max-w-md outline-none"
            src={audioPassage.mediaUrl}
          />
        </div>
      )}

      <p className="text-gray-500 mb-8 italic text-center">Nghe audio và chọn đáp án đúng nhất (A, B, C).</p>

      <div className="flex gap-6 justify-center">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => selectAnswer(question.id, opt.label)}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all border-2
              ${answers[question.id] === opt.label
                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-110'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
