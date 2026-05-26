import React from 'react';
import type { ClientQuestion } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';

interface Part5ViewerProps {
  question: ClientQuestion;
}

export const Part5Viewer: React.FC<Part5ViewerProps> = ({ question }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();
  const isBookmarked = bookmarks.includes(question.id);

  return (
    <div id={`question-${question.id}`} className="max-w-4xl mx-auto bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-4 scroll-mt-28">
      <div className="flex gap-3 mb-4">
        <span className="font-bold text-blue-600 min-w-[28px] mt-0.5">{question.order}.</span>
        <p className="font-semibold text-gray-800 text-lg leading-snug flex-1">
          {question.questionText}
        </p>
        <button
          onClick={() => toggleBookmark(question.id)}
          className={`p-1.5 h-fit rounded transition-colors ${isBookmarked ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
          title="Đánh dấu xem lại"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-2 pl-10">
        {question.options.map((opt) => {
          const isSelected = answers[question.id] === opt.label;
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-2 py-1.5 px-2 rounded border cursor-pointer transition-colors
                ${isSelected ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50 border-transparent'}
              `}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt.label}
                checked={isSelected}
                onChange={() => selectAnswer(question.id, opt.label)}
                className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="font-medium w-6 shrink-0">({opt.label})</span>
              <span className={`${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                {opt.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
