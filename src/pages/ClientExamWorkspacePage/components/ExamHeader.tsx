import React from 'react';
import { useExamTimer } from '@/hooks/useExamTimer';
import { useClientExamStore } from '@/store/useClientExamStore';
import { Clock, Send } from 'lucide-react';

interface ExamHeaderProps {
  title: string;
  duration: number;
  onSubmit: (forceSubmit?: boolean) => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ title, duration, onSubmit }) => {
  const { isSubmitting } = useClientExamStore();
  const { formattedTime, isWarning } = useExamTimer(duration, () => onSubmit(true));

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] transition-all">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Title Area */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">T</span>
          </div>
          <h1 className="text-base font-bold text-slate-900 line-clamp-1 max-w-[200px] md:max-w-md hidden sm:block">
            {title}
          </h1>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-4">
          
          {/* Timer Pill */}
          <div className={`
            flex items-center gap-1.5 px-3 py-1 rounded-full border bg-slate-50 font-mono font-bold tracking-wider text-base transition-colors
            ${isWarning 
              ? 'border-red-200 text-red-600 bg-red-50 animate-pulse shadow-sm' 
              : 'border-slate-200 text-slate-700'
            }
          `}>
            <Clock className={`w-3.5 h-3.5 ${isWarning ? 'text-red-500' : 'text-slate-400'}`} />
            {formattedTime}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => onSubmit(false)}
            disabled={isSubmitting}
            className={`
              group flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp Bài'}
            {!isSubmitting && <Send className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />}
          </button>
        </div>
      </div>
    </header>
  );
};
