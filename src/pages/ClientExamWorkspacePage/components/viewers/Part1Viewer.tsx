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
    <div id={`question-${question.id}`} className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 scroll-mt-24">
      {/* Cột trái: Hình ảnh & Audio */}
      <div className="flex flex-col gap-4">
        {imagePassage?.mediaUrl ? (
          <img src={imagePassage.mediaUrl} alt="Part 1" className="w-full h-auto object-contain rounded-lg border bg-gray-50 max-h-[400px]" />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
            [Không có hình ảnh]
          </div>
        )}

        {audioPassage?.mediaUrl && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <audio
              controls
              controlsList="nodownload noplaybackrate"
              className="w-full h-10 outline-none"
              src={audioPassage.mediaUrl}
            />
          </div>
        )}
      </div>

      {/* Cột phải: Chọn đáp án (Ẩn text) */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-8">
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

        <p className="text-gray-500 mb-8 italic">Nghe audio và chọn đáp án đúng nhất (A, B, C, D).</p>

        <div className="flex gap-4 justify-center mt-auto mb-auto">
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
    </div>
  );
};
