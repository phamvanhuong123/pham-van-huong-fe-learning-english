import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, RefreshCcw, Loader2, Send, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getAIExplanationApi, askAIFollowUpApi, generateTakeawayApi } from '@/services/aiService';
import { upsertNoteApi } from '@/services/questionService';
import type { ReviewQuestion } from '@/types/result.type';
import ReactMarkdown from 'react-markdown';

interface AIExplanationBoxProps {
  question: ReviewQuestion;
  passageContent?: string;
}

export const AIExplanationBox: React.FC<AIExplanationBoxProps> = ({ question, passageContent }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [content, setContent] = useState<string>('');
  const [followUpAnswers, setFollowUpAnswers] = useState<{ q: string, a: string }[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const handleSaveNote = async (textToSave: string) => {
    try {
      setIsSavingNote(true);
      toast.loading('Đang phân tích kiến thức cần học...', { id: 'saving-note' });

      let finalContent = textToSave;
      try {
        const takeawayRes = await generateTakeawayApi({
          questionText: question.questionText || undefined,
          explanation: textToSave
        });
        if (takeawayRes.data?.data?.content) {
          finalContent += '\n\n' + takeawayRes.data.data.content;
        }
      } catch (aiErr) {
        // If AI fails, still save the plain note
        console.error('Failed to generate takeaway', aiErr);
      }

      await upsertNoteApi(question.id, { content: finalContent });
      toast.success('Đã lưu Sổ tay kèm Kiến thức cần học!', { id: 'saving-note' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể lưu Sổ tay', { id: 'saving-note' });
    } finally {
      setIsSavingNote(false);
    }
  };

  const fetchExplanation = async (forceRefresh: boolean = false) => {
    try {
      setStatus('loading');
      setFollowUpAnswers([]);

      const correctOption = question.options.find(opt => opt.isCorrect);

      const payload = {
        questionId: question.id,
        questionText: question.questionText || undefined,
        options: question.options.map(opt => ({
          label: opt.label,
          text: opt.text || "(Audio/Image)"
        })),
        correctLabel: correctOption?.label,
        part: question.part || undefined,
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

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || isFollowUpLoading) return;

    try {
      setIsFollowUpLoading(true);

      const payload = {
        questionContext: question.questionText || undefined,
        originalExplanation: content,
        chatHistory: followUpAnswers.map(item => ({ user: item.q, ai: item.a })),
        userQuestion: userQuestion.trim()
      };

      const currentQ = userQuestion.trim();
      setUserQuestion('');

      const res = await askAIFollowUpApi(payload);

      if (res.data && res.data.data) {
        setFollowUpAnswers(prev => [...prev, { q: currentQ, a: res.data.data.content }]);
      } else {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }
    } catch (error) {
      console.error("AI Follow-up Error:", error);
      toast.error('Không thể nhận phản hồi từ AI lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsFollowUpLoading(false);
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
          <div className="flex flex-col">
            <div className="p-5 text-gray-800 prose prose-sm prose-indigo max-w-none 
                            prose-p:leading-relaxed prose-li:my-1 prose-strong:text-indigo-900 border-b border-indigo-50 relative group">
              <ReactMarkdown>
                {content}
              </ReactMarkdown>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-indigo-600 hover:text-indigo-700 border-indigo-200 hover:bg-indigo-50 h-8 text-xs shadow-sm"
                onClick={() => handleSaveNote(content)}
                disabled={isSavingNote}
              >
                <Save className="w-3.5 h-3.5 mr-1.5" /> Lưu Sổ tay
              </Button>
            </div>

            {/* Follow-up Section */}
            <div className="bg-gradient-to-b from-indigo-50/10 to-indigo-50/50 p-4 sm:p-5">
              {followUpAnswers.length > 0 && (
                <div className="space-y-5 mb-5">
                  {followUpAnswers.map((item, idx) => (
                    <div key={idx} className="flex flex-col space-y-3 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* User Bubble */}
                      <div className="self-end bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md font-medium">
                        {item.q}
                      </div>

                      {/* AI Bubble */}
                      <div className="self-start flex items-start gap-2 max-w-[95%] group">
                        <div className="mt-1 bg-indigo-100 p-1.5 rounded-full text-indigo-600 shadow-sm shrink-0">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="bg-white border border-indigo-100/60 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm prose prose-sm prose-indigo leading-relaxed relative">
                          <ReactMarkdown>{item.a}</ReactMarkdown>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 h-7 w-7 rounded-full"
                            onClick={() => handleSaveNote(item.a)}
                            disabled={isSavingNote}
                            title="Lưu câu trả lời này"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleFollowUpSubmit} className="flex gap-2 relative mt-2 group">
                <Input
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Bạn chưa hiểu điểm nào? Hỏi thêm AI ngay..."
                  className="bg-white/90 backdrop-blur-sm border-indigo-200/80 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 pr-12 rounded-full shadow-sm h-11 transition-all duration-300 group-hover:border-indigo-300 group-focus-within:shadow-md"
                  disabled={isFollowUpLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:opacity-100 shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                  disabled={!userQuestion.trim() || isFollowUpLoading}
                >
                  {isFollowUpLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Send className="h-4 w-4 text-white ml-px mt-px" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
