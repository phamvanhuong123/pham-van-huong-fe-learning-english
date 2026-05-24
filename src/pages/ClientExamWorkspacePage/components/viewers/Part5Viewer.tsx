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
    <div id={`question-${question.id}`} className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-6 scroll-mt-24">
      <div className="flex gap-4 mb-6">
        <span className="font-bold text-blue-600 min-w-[32px] text-xl mt-1">{question.order}.</span>
        <p className="font-semibold text-gray-800 text-xl leading-relaxed flex-1">
          {question.questionText}
        </p>
        <button
          onClick={() => toggleBookmark(question.id)}
          className={`p-2 h-fit rounded-md transition-colors ${isBookmarked ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
          title="Đánh dấu xem lại"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
        {question.options.map((opt) => {
          const isSelected = answers[question.id] === opt.label;
          return (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
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
              <span className={`font-bold text-lg w-8 shrink-0 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                ({opt.label})
              </span>
              <span className={`text-lg ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                {opt.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
