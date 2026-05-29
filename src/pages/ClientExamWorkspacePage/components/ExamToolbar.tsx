import React from 'react';
import { cn } from '@/lib/utils';

interface ExamToolbarProps {
  parts: string[];
  activePart: string;
  onPartClick: (part: string) => void;
}

export const ExamToolbar: React.FC<ExamToolbarProps> = ({ parts, activePart, onPartClick }) => {
  return (
    <div className="sticky top-14 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-[0_1px_3px_0_rgba(0,0,0,0.01)] py-2 transition-all">
      <div className="container mx-auto px-4 flex justify-center">
        
        {/* Segmented Control Style */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg overflow-x-auto custom-scrollbar shadow-inner border border-slate-200/50">
          {parts.map((part) => {
            const isActive = part === activePart;
            return (
              <button
                key={part}
                onClick={() => onPartClick(part)}
                className={cn(
                  "relative px-4 py-1 rounded-md text-[13px] font-semibold whitespace-nowrap transition-all duration-300 select-none outline-none",
                  isActive
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"
                )}
              >
                {part.replace('PART', 'Part ')}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
