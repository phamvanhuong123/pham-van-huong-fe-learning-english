import React from 'react';
import type { ClientPassageGroup } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';

interface Part34ViewerProps {
  passageGroup: ClientPassageGroup;
}

export const Part34Viewer: React.FC<Part34ViewerProps> = ({ passageGroup }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();

  const audioPassage = passageGroup.passages.find(p => p.mediaType === 'AUDIO' || p.mediaType === 'audio');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      {/* Cột trái: Audio */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-24 h-fit">
        <div className="w-full h-48 bg-gray-50 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>

        {audioPassage?.mediaUrl && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <audio
              controls
              controlsList="nodownload noplaybackrate"
              className="w-full h-10 outline-none"
              src={audioPassage.mediaUrl}
            />
          </div>
        )}
      </div>

      {/* Cột phải: Danh sách câu hỏi */}
      <div className="flex flex-col gap-6">
        {passageGroup.questions.map((question) => {
          const isBookmarked = bookmarks.includes(question.id);

          return (
            <div id={`question-${question.id}`} key={question.id} className="border-b border-gray-100 pb-6 last:border-0 scroll-mt-24">
              <div className="flex gap-3 mb-4">
                <span className="font-bold text-blue-600 min-w-[28px]">{question.order}.</span>
                <p className="font-semibold text-gray-800 text-lg leading-snug flex-1">
                  {question.questionText}
                </p>
                <button
                  onClick={() => toggleBookmark(question.id)}
                  className={`p-1.5 h-fit rounded-md transition-colors ${isBookmarked ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
                  title="Đánh dấu xem lại"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-3 pl-10">
                {question.options.map((opt) => {
                  const isSelected = answers[question.id] === opt.label;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                        ${isSelected ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50 border-transparent'}
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={opt.label}
                        checked={isSelected}
                        onChange={() => selectAnswer(question.id, opt.label)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
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
        })}
      </div>
    </div>
  );
};
