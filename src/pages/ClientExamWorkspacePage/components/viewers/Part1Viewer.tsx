import React from 'react';
import type { ClientPassageGroup, ClientQuestion } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';

interface Part1ViewerProps {
  passageGroup?: ClientPassageGroup;
  question: ClientQuestion;
}

export const Part1Viewer: React.FC<Part1ViewerProps> = ({ passageGroup, question }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();

  const audioPassage = passageGroup?.passages.find(p => p.mediaType === 'AUDIO' || p.mediaType === 'audio');
  const imagePassage = passageGroup?.passages.find(p => p.mediaType === 'IMAGE' || p.mediaType === 'image');

  const isBookmarked = bookmarks.includes(question.id);

  return (
    <div id={`question-${question.id}`} className="bg-white p-5 rounded-md shadow-sm border border-gray-200 mb-8 scroll-mt-28">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">{question.order}.</span>
        </h3>
        <button
          onClick={() => toggleBookmark(question.id)}
          className={`p-2 rounded transition-all duration-300 ${isBookmarked ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100'}`}
          title="Đánh dấu xem lại"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {imagePassage?.mediaUrl ? (
          <div className="rounded-md overflow-hidden border border-gray-200 bg-gray-50 max-w-2xl mx-auto">
            <img src={imagePassage.mediaUrl} alt="Part 1" className="w-full h-auto object-contain max-h-[450px]" />
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto h-64 bg-gray-50 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-400">
            [Không có hình ảnh]
          </div>
        )}

        {audioPassage?.mediaUrl && (
          <div className="mt-2 max-w-2xl mx-auto w-full">
            <audio
              controls
              controlsList="nodownload noplaybackrate"
              className="w-full h-11 outline-none custom-audio"
              src={audioPassage.mediaUrl}
            />
          </div>
        )}

        <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full mt-4">
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
    </div>
  );
};
