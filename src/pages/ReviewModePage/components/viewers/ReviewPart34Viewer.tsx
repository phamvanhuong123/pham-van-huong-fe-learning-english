import React from 'react'
import type { ReviewPassageGroup } from '@/types/result.type'
import { cn } from '@/lib/utils'
import { Check, X, Headphones, FileText } from 'lucide-react'
import { QuestionNoteEditor } from '../QuestionNoteEditor'

interface ReviewPart34ViewerProps {
  passageGroup: ReviewPassageGroup
}

export const ReviewPart34Viewer: React.FC<ReviewPart34ViewerProps> = ({ passageGroup }) => {
  const audioPassage = passageGroup?.passages.find(
    (p) => p.mediaType === 'AUDIO' || p.mediaType === 'VIDEO'
  )
  const imagePassage = passageGroup.passages.find((p) => p.mediaType === 'IMAGE')

  const sortedQuestions = [...passageGroup.questions].sort((a, b) => a.order - b.order)
  const questionNumbers = sortedQuestions.map((q) => q.order).join(' - ')

  return (
    <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
      {/* Passage Header / Audio Player */}
      <div className="mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 mb-3">
          <Headphones className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">
            Questions <span className="text-blue-600">{questionNumbers}</span> refer to the
            following conversation.
          </h3>
        </div>

        {imagePassage?.mediaUrl && (
          <div className="rounded-lg overflow-hidden border border-slate-200/60 bg-slate-50 max-w-sm mx-auto mb-3 p-1">
            <img
              src={imagePassage.mediaUrl}
              alt="Passage Image"
              className="w-full h-auto object-contain rounded-md"
            />
          </div>
        )}

        {audioPassage?.mediaUrl && (
          <div className="max-w-sm mx-auto w-full bg-slate-50 p-1 rounded-lg border border-slate-100 shadow-inner overflow-hidden">
            <audio
              controls
              controlsList="nodownload noplaybackrate"
              className="w-full"
              src={audioPassage.mediaUrl}
            />
          </div>
        )}
      </div>

      {/* Transcript / Passage Translation */}
      {audioPassage?.transcript && (
        <div className="mb-6 bg-yellow-50/50 p-4 rounded-lg border border-yellow-100 text-sm">
          <h5 className="font-bold text-yellow-800 mb-2">Transcript / Dịch nghĩa:</h5>
          <div
            className="text-yellow-900/80 leading-relaxed break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: audioPassage.transcript }}
          />
        </div>
      )}

      {/* Questions List */}
      <div className="flex flex-col gap-5">
        {sortedQuestions.map((question) => {
          const isAnsweredCorrectly = question.userAnswer?.isCorrect
          const hasAnswer = !!question.userAnswer?.selectedLabel

          return (
            <div id={`question-${question.order}`} key={question.id} className="scroll-mt-20">
              <div className="flex gap-3 mb-3">
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
                  <div
                    className="font-semibold text-slate-800 text-sm md:text-[15px] leading-snug"
                    dangerouslySetInnerHTML={{ __html: question.questionText || '' }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pl-0 md:pl-9 mb-4">
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
                {question.explanation && (
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
  )
}
