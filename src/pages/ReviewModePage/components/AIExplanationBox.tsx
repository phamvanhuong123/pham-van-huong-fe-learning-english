import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAIExplanationApi } from '@/services/aiService';
import type { ReviewQuestion } from '@/types/result.type';
import ReactMarkdown from 'react-markdown';

interface AIExplanationBoxProps {
  question: ReviewQuestion;
  passageContent?: string;
}

export const AIExplanationBox: React.FC<AIExplanationBoxProps> = ({ question, passageContent }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [content, setContent] = useState<string>('');

  const fetchExplanation = async (forceRefresh: boolean = false) => {
    try {
      setStatus('loading');
      
      const correctOption = question.options.find(opt => opt.isCorrect);
      
      const payload = {
        questionId: question.id,
        questionText: question.questionText || undefined,
        options: question.options.map(opt => ({
          label: opt.label,
          text: opt.text || "(Audio/Image)"
        })),
        correctLabel: correctOption?.label,
        part: question.part,
        passageContent,
        forceRefresh
      };

      const res = await getAIExplanationApi(payload);
      
      if (res.data && res.data.data) {
        setContent(res.data.data.content);
        setStatus('done');
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (error) {
      console.error("AI Explanation Error:", error);
      toast.error('Không thể nhận giải thích từ AI lúc này. Vui lòng thử lại sau.');
      setStatus('idle');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100/50 text-sm shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-indigo-700 font-bold">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span>Giải thích bằng AI</span>
        </div>
        <div className="flex items-center gap-2">
          {status === 'done' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchExplanation(true)}
              className="h-7 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50"
            >
              <RefreshCcw className="w-3 h-3 mr-1" /> Làm mới
            </Button>
          )}
          <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] px-1.5 py-0">BETA</Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white/70 rounded-md border border-indigo-100 overflow-hidden">
        
        {/* Idle State */}
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <p className="text-indigo-900/70 mb-4">
              AI sẽ phân tích chi tiết câu hỏi này, giải thích từng đáp án và cung cấp mẹo làm bài cho bạn.
            </p>
            <Button 
              onClick={() => fetchExplanation()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Nhận phân tích AI ngay
            </Button>
          </div>
        )}

        {/* Loading State (Skeleton) */}
        {status === 'loading' && (
          <div className="p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              <span className="text-indigo-600/80 font-medium text-sm">AI đang suy nghĩ...</span>
            </div>
            <div className="h-4 bg-indigo-100/60 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-100/60 rounded w-full"></div>
            <div className="h-4 bg-indigo-100/60 rounded w-5/6"></div>
            <div className="pt-2">
              <div className="h-4 bg-indigo-100/60 rounded w-1/2"></div>
            </div>
          </div>
        )}

        {/* Done State (Markdown Render) */}
        {status === 'done' && (
          <div className="p-5 text-gray-800 prose prose-sm prose-indigo max-w-none 
                          prose-p:leading-relaxed prose-li:my-1 prose-strong:text-indigo-900">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
