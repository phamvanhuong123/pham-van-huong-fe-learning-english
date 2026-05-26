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
    <div id={`question-${question.id}`} className="max-w-4xl mx-auto bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-6 scroll-mt-28">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">{question.order}.</span>
        </h3>
        <button
          onClick={() => toggleBookmark(question.id)}
          className={`p-2 rounded transition-all duration-300 ${isBookmarked ? 'bg-orange-100 text-orange-600 shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:shadow-sm hover:text-gray-600'}`}
          title="Đánh dấu xem lại"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {audioPassage?.mediaUrl && (
        <div className="mb-6 max-w-2xl mx-auto flex justify-center">
          <audio
            controls
            controlsList="nodownload noplaybackrate"
            className="w-full outline-none custom-audio h-10"
            src={audioPassage.mediaUrl}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
        {question.options.map((opt) => {
          const isSelected = answers[question.id] === opt.label;
          return (
            <label
              key={opt.id}
              className={`flex items-center gap-2 py-1.5 px-3 rounded border cursor-pointer transition-all
                ${isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'hover:bg-gray-50 border-gray-200'}
              `}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt.label}
                checked={isSelected}
                onChange={() => selectAnswer(question.id, opt.label)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className={`font-semibold text-base w-6 shrink-0 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                {opt.label}.
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
