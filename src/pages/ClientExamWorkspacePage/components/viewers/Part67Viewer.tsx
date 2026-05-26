import React from 'react';
import type { ClientPassageGroup } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';

interface Part67ViewerProps {
  passageGroup: ClientPassageGroup;
  part: string; // 'PART6' | 'PART7'
}

export const Part67Viewer: React.FC<Part67ViewerProps> = ({ passageGroup, part }) => {
  const { answers, selectAnswer, toggleBookmark, bookmarks } = useClientExamStore();
  const isPart6 = part === 'PART6';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-8">
      {/* Cột trái: Đoạn văn bản / Hình ảnh */}
      <div className="flex flex-col gap-6 lg:border-r lg:pr-8 h-fit lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
        {passageGroup.passages.map((passage, idx) => (
          <div key={passage.id} className="passage-content mb-6 last:mb-0">
            {passage.mediaType === 'IMAGE' && passage.mediaUrl && (
              <img src={passage.mediaUrl} alt={`Passage ${idx + 1}`} className="w-full h-auto rounded-md border mb-4 shadow-sm" />
            )}
            {passage.content && (
              <div
                className="prose prose-blue max-w-none text-gray-800 leading-relaxed bg-white border border-gray-200 shadow-sm p-4 rounded-md"
                dangerouslySetInnerHTML={{ __html: passage.content }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Cột phải: Danh sách câu hỏi */}
      <div className="flex flex-col gap-6">
        {passageGroup.questions.map((question) => {
          const isBookmarked = bookmarks.includes(question.id);

          return (
            <div id={`question-${question.id}`} key={question.id} className="border-b border-gray-100 pb-6 last:border-0 scroll-mt-24">
              <div className="flex gap-3 mb-4">
                <span className="font-bold text-blue-600 min-w-[28px] mt-0.5">{question.order}.</span>
                <div className="flex-1">
                  {!isPart6 && question.questionText && (
                    <p className="font-semibold text-gray-800 text-lg leading-snug">
                      {question.questionText}
                    </p>
                  )}
                  {isPart6 && (
                    <p className="text-gray-400 italic text-sm">
                      Chọn từ thích hợp điền vào chỗ trống số {question.order}
                    </p>
                  )}
                </div>
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
        })}
      </div>
    </div>
  );
};
