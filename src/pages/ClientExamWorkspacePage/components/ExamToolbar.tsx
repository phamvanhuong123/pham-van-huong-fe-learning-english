import React from 'react';

interface ExamToolbarProps {
  parts: string[];
  activePart: string;
  onPartClick: (part: string) => void;
}

export const ExamToolbar: React.FC<ExamToolbarProps> = ({ parts, activePart, onPartClick }) => {
  return (
    <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm py-2">
      <div className="container mx-auto px-4 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {parts.map((part) => {
          const isActive = part === activePart;
          return (
            <button
              key={part}
              onClick={() => onPartClick(part)}
              className={`px-5 py-1.5 rounded text-sm font-semibold whitespace-nowrap transition-all duration-300
                ${isActive
                  ? 'bg-blue-100 text-blue-700 shadow-inner'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {part.replace('PART', 'Part ')}
            </button>
          );
        })}
      </div>
    </div>
  );
};
