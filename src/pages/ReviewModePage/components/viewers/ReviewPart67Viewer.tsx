import React from 'react'
import type { ReviewPassageGroup } from '@/types/result.type'
import { cn } from '@/lib/utils'
import { Check, X, FileText } from 'lucide-react'
import { QuestionNoteEditor } from '../QuestionNoteEditor'

interface ReviewPart67ViewerProps {
  passageGroup: ReviewPassageGroup
  part: string // 'PART6' | 'PART7'
}

export const ReviewPart67Viewer: React.FC<ReviewPart67ViewerProps> = ({ passageGroup, part }) => {
  const isPart6 = part === 'PART6'

  // Sắp xếp câu hỏi theo order
  const sortedQuestions = [...passageGroup.questions].sort((a, b) => a.order - b.order)
  const questionNumbers = sortedQuestions.map((q) => q.order).join(' - ')
  const allTranscripts = passageGroup.passages.filter(
    (p) => p.transcript && p.transcript !== '<p><br></p>'
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 overflow-hidden">
      <div className="flex flex-col xl:flex-row h-full">
        {/* Left Column: Passage Content */}
        <div className="w-full xl:w-[55%] flex flex-col xl:border-r border-slate-100 xl:max-h-[calc(100vh-6rem)] xl:sticky xl:top-20">
          <div className="p-2.5 md:p-3 border-b border-slate-50 bg-slate-50/50 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-slate-800 text-xs md:text-sm">
              Questions <span className="text-blue-600">{questionNumbers}</span> refer to the
              following {isPart6 ? 'text' : 'passage'}.
            </h3>
          </div>

          <div className="p-3 md:p-5 overflow-y-auto custom-scrollbar flex-1 bg-white">
            {/* Bản dịch / Transcript — gộp tất cả ở trên cùng để dễ thấy */}
            {allTranscripts.length > 0 && (
              <details className="mb-6">
                <summary className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700 select-none flex items-center gap-1.5">
                  🇻🇳 Bản dịch tiếng Việt
                </summary>
                <div className="mt-3 p-4 bg-blue-50/80 rounded-md border border-blue-100 space-y-4 shadow-inner">
                  {allTranscripts.map((p, i) => (
                    <div key={i}>
                      {allTranscripts.length > 1 && (
                        <h5 className="font-bold text-blue-800 mb-2 text-xs uppercase tracking-wider">
                          Đoạn {i + 1}
                        </h5>
                      )}
                      <div
                        className="prose prose-sm max-w-none text-[13px] md:text-sm text-slate-700 leading-relaxed break-words overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: p.transcript! }}
                      />
                    </div>
                  ))}
                </div>
              </details>
            )}

            {passageGroup.passages.map((passage, idx) => (
              <div key={passage.id} className="passage-content mb-6 last:mb-0">
                {passageGroup.passages.length > 1 && (
                  <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-3">
                    Đoạn {idx + 1}
                  </h4>
                )}

                {passage.mediaType === 'IMAGE' && passage.mediaUrl && (
                  <img
                    src={passage.mediaUrl}
                    alt={`Passage ${idx + 1}`}
                    className="w-full h-auto rounded-md border border-slate-200 mb-4 shadow-sm max-h-[400px] object-contain"
                  />
                )}

                {passage.content && passage.content !== '<p><br></p>' && (
                  <div
                    className="prose prose-slate prose-blue max-w-none text-slate-800 leading-relaxed bg-slate-50/50 border border-slate-100 shadow-inner p-4 md:p-5 rounded-lg font-medium text-sm md:text-[15px]"
                    dangerouslySetInnerHTML={{ __html: passage.content }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Questions List */}
        <div className="w-full xl:w-[45%] flex flex-col bg-slate-50/30 xl:max-h-[calc(100vh-6rem)]">
          <div className="p-3 md:p-5 overflow-y-auto custom-scrollbar flex-1">
            <div className="flex flex-col gap-6">
              {sortedQuestions.map((question) => {
                const isAnsweredCorrectly = question.userAnswer?.isCorrect
                const hasAnswer = !!question.userAnswer?.selectedLabel

                return (
                  <div
                    id={`question-${question.order}`}
                    key={question.id}
                    className="scroll-mt-20 p-4 bg-white rounded-lg border border-slate-100 shadow-sm"
                  >
                    <div className="flex gap-3 mb-4">
                      <div
                        className={cn(
                          'w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-bold text-xs shadow-sm mt-0.5',
                          isAnsweredCorrectly
                            ? 'bg-green-100 text-green-700'
                            : hasAnswer
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-500'
                        )}
                      >
                        {question.order}
                      </div>
                      <div className="flex-1 pt-0">
                        {!isPart6 && question.questionText && (
                          <div
                            className="font-semibold text-slate-800 text-sm md:text-[15px] leading-snug"
                            dangerouslySetInnerHTML={{ __html: question.questionText }}
                          />
                        )}
                        {isPart6 && (
                          <p className="text-slate-400 italic text-xs md:text-sm font-medium">
                            Chọn từ thích hợp điền vào chỗ trống số {question.order}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pl-0 md:pl-9 mb-5">
                      {question.options.map((opt) => {
                        const isSelected = question.userAnswer?.selectedLabel === opt.label
                        const isCorrect = opt.isCorrect

                        let bgColor = 'bg-white border-slate-200'
                        let textColor = 'text-slate-600'
                        let circleColor = 'bg-white border-slate-300 text-slate-500'
                        let icon = null

                        if (isCorrect) {
                          bgColor = 'bg-green-50 border-green-300 shadow-sm'
                          textColor = 'text-green-800 font-medium'
                          circleColor = 'bg-green-600 border-green-600 text-white'
                          icon = <Check className="w-4 h-4 text-green-600 shrink-0 ml-auto" />
                        } else if (isSelected && !isCorrect) {
                          bgColor = 'bg-red-50 border-red-300 shadow-sm'
                          textColor = 'text-red-800 font-medium'
                          circleColor = 'bg-red-600 border-red-600 text-white'
                          icon = <X className="w-4 h-4 text-red-600 shrink-0 ml-auto" />
                        }

                        return (
                          <div
                            key={opt.id}
                            className={cn(
                              'group flex items-center gap-2.5 p-2 rounded-md border transition-all duration-200',
                              bgColor
                            )}
                          >
                            <div
                              className={cn(
                                'flex items-center justify-center w-5 h-5 rounded-full border-[1.5px] text-[10px] font-bold shrink-0',
                                circleColor
                              )}
                            >
                              {opt.label}
                            </div>
                            <span className={cn('font-medium text-[13px] md:text-sm', textColor)}>
                              {opt.text}
                            </span>
                            {icon}
                          </div>
                        )
                      })}
                    </div>

                    <div className="pl-0 md:pl-9 space-y-4">
                      {question.explanation && question.explanation !== '<p><br></p>' && (
                        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 text-sm">
                          <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                            <FileText className="w-4 h-4" /> Giải thích chi tiết
                          </div>
                          <div
                            className="text-slate-700 leading-relaxed break-words overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: question.explanation }}
                          />
                        </div>
                      )}

                      <QuestionNoteEditor questionId={question.id} initialNote={question.note} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
