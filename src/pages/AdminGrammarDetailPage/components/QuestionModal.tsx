import { useState, useEffect } from 'react'
import { useCreateGrammarQuestion, useUpdateGrammarQuestion } from '@/hooks/queries/useGrammarQuery'
import type { AdminGrammarQuestion, CreateGrammarQuestionInput } from '@/types/grammar.type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  topicId: string
  question?: AdminGrammarQuestion | null
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const
type OptionLabel = (typeof OPTION_LABELS)[number]

interface OptionForm {
  label: OptionLabel
  text: string
  isCorrect: boolean
}

const defaultOptions = (): OptionForm[] =>
  OPTION_LABELS.map((label) => ({ label, text: '', isCorrect: false }))

export function QuestionModal({ isOpen, onClose, topicId, question }: QuestionModalProps) {
  const createQuestion = useCreateGrammarQuestion(topicId)
  const updateQuestion = useUpdateGrammarQuestion(topicId)

  const [questionText, setQuestionText] = useState('')
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM')
  const [explanation, setExplanation] = useState('')
  const [options, setOptions] = useState<OptionForm[]>(defaultOptions())

  useEffect(() => {
    if (question) {
      setQuestionText(question.questionText || '')
      setDifficulty(question.difficulty)
      setExplanation(question.explanation || '')
      // Map từ question options, đảm bảo đủ 4 options
      const filled = OPTION_LABELS.map((label) => {
        const existing = question.options.find((o) => o.label === label)
        return existing
          ? { label, text: existing.text, isCorrect: existing.isCorrect }
          : { label, text: '', isCorrect: false }
      })
      setOptions(filled)
    } else {
      setQuestionText('')
      setDifficulty('MEDIUM')
      setExplanation('')
      setOptions(defaultOptions())
    }
  }, [question, isOpen])

  const handleOptionTextChange = (label: OptionLabel, text: string) => {
    setOptions((prev) => prev.map((o) => (o.label === label ? { ...o, text } : o)))
  }

  const handleCorrectChange = (label: OptionLabel) => {
    setOptions((prev) => prev.map((o) => ({ ...o, isCorrect: o.label === label })))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!questionText.trim()) {
      toast.error('Vui lòng nhập nội dung câu hỏi')
      return
    }

    const filledOptions = options.filter((o) => o.text.trim() !== '')
    if (filledOptions.length < 2) {
      toast.error('Cần ít nhất 2 đáp án có nội dung')
      return
    }
    if (!filledOptions.some((o) => o.isCorrect)) {
      toast.error('Vui lòng chọn đáp án đúng')
      return
    }

    const payload: CreateGrammarQuestionInput = {
      questionText: questionText.trim(),
      difficulty,
      explanation: explanation.trim() || null,
      options: filledOptions.map((o) => ({
        label: o.label,
        text: o.text.trim(),
        isCorrect: o.isCorrect,
      })),
    }

    if (question) {
      updateQuestion.mutate(
        { questionId: question.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Cập nhật câu hỏi thành công')
            onClose()
          },
          onError: (err: any) => toast.error(err.response?.data?.message || 'Cập nhật thất bại'),
        }
      )
    } else {
      createQuestion.mutate(payload, {
        onSuccess: () => {
          toast.success('Thêm câu hỏi thành công')
          onClose()
        },
        onError: (err: any) => toast.error(err.response?.data?.message || 'Thêm câu hỏi thất bại'),
      })
    }
  }

  const isPending = createQuestion.isPending || updateQuestion.isPending
  const correctLabel = options.find((o) => o.isCorrect)?.label

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {question ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi ngữ pháp mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Question text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">
              Nội dung câu hỏi <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="VD: She ___ to school every day."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label>Độ khó</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">
                  <span className="text-emerald-600 font-medium">Dễ</span>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <span className="text-amber-600 font-medium">Trung bình</span>
                </SelectItem>
                <SelectItem value="HARD">
                  <span className="text-rose-600 font-medium">Khó</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Các đáp án <span className="text-destructive">*</span>
              </Label>
              {correctLabel && (
                <Badge
                  variant="secondary"
                  className="text-emerald-600 bg-emerald-50 border-emerald-200 text-xs gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Đáp án đúng: {correctLabel}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              {options.map((opt) => (
                <div
                  key={opt.label}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group',
                    opt.isCorrect
                      ? 'border-emerald-300 bg-emerald-50/60 ring-1 ring-emerald-200'
                      : 'border-border hover:border-primary/40 hover:bg-muted/30'
                  )}
                  onClick={() => handleCorrectChange(opt.label)}
                >
                  {/* Radio indicator */}
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                      opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-muted-foreground/40 group-hover:border-primary/60'
                    )}
                  >
                    {opt.isCorrect && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  {/* Label badge */}
                  <span
                    className={cn(
                      'text-sm font-bold w-6 shrink-0',
                      opt.isCorrect ? 'text-emerald-700' : 'text-muted-foreground'
                    )}
                  >
                    {opt.label}
                  </span>

                  {/* Text input */}
                  <Input
                    value={opt.text}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleOptionTextChange(opt.label, e.target.value)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`Đáp án ${opt.label}...`}
                    className={cn(
                      'flex-1 h-8 border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm',
                      opt.isCorrect ? 'placeholder:text-emerald-400' : ''
                    )}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Click vào một hàng để chọn làm đáp án đúng
            </p>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Giải thích (Tùy chọn)</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Giải thích tại sao đáp án này đúng..."
              rows={3}
              className="resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {question ? 'Cập nhật' : 'Thêm câu hỏi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
