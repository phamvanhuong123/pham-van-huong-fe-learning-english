import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadMediaApi, getQuestionsByExamApi } from '@/services/questionService';
import { Save, LayoutTemplate, Eye, PenLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExamSelection } from './QuestionForm/ExamSelection';
import { PassageEditor } from './QuestionForm/PassageEditor';
import { QuestionEditor } from './QuestionForm/QuestionEditor';
import { PreviewPane } from './QuestionForm/PreviewPane';

interface CreateQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, isGroup: boolean) => Promise<void>;
  exams: any[];
  isPending?: boolean;
}

const DEFAULT_OPTIONS = [
  { label: 'A', text: '', isCorrect: true },
  { label: 'B', text: '', isCorrect: false },
  { label: 'C', text: '', isCorrect: false },
  { label: 'D', text: '', isCorrect: false },
];

export function CreateQuestionDialog({
  isOpen,
  onClose,
  onSave,
  exams,
  isPending
}: CreateQuestionDialogProps) {
  const [step, setStep] = useState(1);
  const [examId, setExamId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Data State
  const [passages, setPassages] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  const selectedExam = exams.find(e => e.id === examId);
  const part = selectedExam?.part || '';
  const isSingleQuestionPart = ['PART1', 'PART2', 'PART5'].includes(part);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setExamId('');
      setActiveTab('form');
      setPassages([{ mediaType: 'TEXT', content: '', mediaUrl: '', order: 1 }]);
      setQuestions([{
        order: 1,
        questionText: '',
        difficulty: 'MEDIUM',
        explanation: '',
        options: JSON.parse(JSON.stringify(DEFAULT_OPTIONS))
      }]);
    }
  }, [isOpen]);

  const [_, setIsFetchingOrder] = useState(false);

  const handleExamSelect = async (val: string) => {
    setExamId(val);
    const ex = exams.find(e => e.id === val);
    if (!ex) return;

    const selectedPart = ex.part;
    if (selectedPart === 'PART5') {
      setPassages([]);
    } else if (selectedPart === 'PART1') {
      setPassages([
        { mediaType: 'IMAGE', content: '', mediaUrl: '', order: 1 },
        { mediaType: 'AUDIO', content: '', mediaUrl: '', order: 2 }
      ]);
    } else if (['PART2', 'PART3', 'PART4'].includes(selectedPart)) {
      setPassages([{ mediaType: 'AUDIO', content: '', mediaUrl: '', order: 1 }]);
    } else {
      setPassages([{ mediaType: 'TEXT', content: '', mediaUrl: '', order: 1 }]);
    }

    setIsFetchingOrder(true);
    let nextOrder = 1;
    try {
      const res = await getQuestionsByExamApi(val);
      const data = res.data?.data || res.data;
      const standalone = data.standaloneQuestions || [];
      const groups = data.questionGroups || [];

      let maxOrder = 0;
      standalone.forEach((q: any) => { if (q.order > maxOrder) maxOrder = q.order; });
      groups.forEach((g: any) => {
        g.questions?.forEach((q: any) => { if (q.order > maxOrder) maxOrder = q.order; });
      });

      const PART_ORDER_BOUNDS: Record<string, { min: number, max: number }> = {
        PART1: { min: 1, max: 6 },
        PART2: { min: 7, max: 31 },
        PART3: { min: 32, max: 70 },
        PART4: { min: 71, max: 100 },
        PART5: { min: 101, max: 130 },
        PART6: { min: 131, max: 146 },
        PART7: { min: 147, max: 200 }
      };

      if (maxOrder > 0) {
        nextOrder = maxOrder + 1;
      } else if (selectedPart !== 'FULL' && PART_ORDER_BOUNDS[selectedPart]) {
        nextOrder = PART_ORDER_BOUNDS[selectedPart].min;
      }
    } catch (e) {
      console.error("Failed to fetch questions for exam", e);
    } finally {
      setIsFetchingOrder(false);
    }

    setQuestions([{
      order: nextOrder,
      questionText: '',
      difficulty: 'MEDIUM',
      explanation: '',
      options: JSON.parse(JSON.stringify(selectedPart === 'PART2' ? DEFAULT_OPTIONS.slice(0, 3) : DEFAULT_OPTIONS))
    }]);

    setTimeout(() => setStep(2), 100);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const isGroup = part !== 'PART5';

      if (isGroup) {
        if (['PART1', 'PART2', 'PART3', 'PART4'].includes(part) && !passages[0]?.mediaUrl && !passages[0]?.mediaFile) {
          return toast.error('Vui lòng chọn file Media bắt buộc');
        }
        if (['PART6', 'PART7'].includes(part)) {
          const invalidPassage = passages.find(p => {
            if (p.mediaType === 'TEXT' && (!p.content || p.content === '<p><br></p>')) return true;
            if (p.mediaType === 'IMAGE' && !p.mediaUrl && !p.mediaFile) return true;
            return false;
          });
          if (invalidPassage) {
            return toast.error('Vui lòng nhập đầy đủ nội dung văn bản hoặc chọn hình ảnh cho các đoạn văn');
          }
        }
        if (questions.length === 0) {
          return toast.error('Cần ít nhất 1 câu hỏi con');
        }
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.options.some((o: any) => o.isCorrect)) {
          return toast.error(`Câu ${i + 1} chưa chọn đáp án đúng`);
        }
      }

      // Upload tất cả file pending trước khi lưu
      const uploadedPassages = await Promise.all(
        passages.map(async (p) => {
          if (p.mediaFile) {
            try {
              const formData = new FormData();
              formData.append(p.mediaType.toLowerCase(), p.mediaFile);
              const res = await uploadMediaApi(formData);
              const url = res.data?.data?.url || res.data?.url;
              if (!url) throw new Error('Không nhận được URL sau upload');
       
              if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
              return { ...p, mediaUrl: url, mediaFile: undefined, previewUrl: undefined };
            } catch (err: any) {
              throw new Error(`Upload thất bại: ${err.message}`);
            }
          }
          return p;
        })
      );

      let payload: any;
      if (!isGroup) {
        payload = {
          examId,
          order: Number(questions[0].order),
          questionText: questions[0].questionText,
          difficulty: questions[0].difficulty,
          explanation: questions[0].explanation,
          options: questions[0].options
        };
      } else {
        payload = {
          examId,
          passageType: uploadedPassages.length > 1 ? (uploadedPassages.length === 2 ? 'DOUBLE' : 'TRIPLE') : 'SINGLE',
          passages: uploadedPassages.map((p, i) => ({ ...p, order: i + 1, mediaFile: undefined, previewUrl: undefined })),
          questions: questions.map((q, i) => ({
            ...q,
            order: Number(q.order) || i + 1
          }))
        };
      }

      await onSave(payload, isGroup);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="!w-full sm:!w-[700px] sm:!max-w-[700px] flex flex-col p-0 gap-0 border-l shadow-2xl overflow-hidden bg-background">

        {/* HEADER */}
        <SheetHeader className="px-6 py-4 border-b bg-card shrink-0">
          <SheetTitle className="text-xl flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-primary" />
            Tạo Câu hỏi Mới
          </SheetTitle>
          <SheetDescription>
            Chọn đề thi và nhập đầy đủ thông tin để tạo câu hỏi mới.
          </SheetDescription>
        </SheetHeader>

        {/* TAB BAR*/}
        {step === 2 && (
          <div className="flex border-b bg-card shrink-0 px-6">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={cn(
                "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-all mr-6",
                activeTab === 'form'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <PenLine className="w-4 h-4" />
              Nhập liệu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={cn(
                "flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-all",
                activeTab === 'preview'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="w-4 h-4" />
              Xem trước
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-br from-background to-muted/10">


          {step === 2 && activeTab === 'preview' && (
            <PreviewPane part={part} passages={passages} questions={questions} />
          )}


          {step === 1 && (
            <ExamSelection exams={exams} selectedExamId={examId} onExamSelect={handleExamSelect} />
          )}

          {step === 2 && activeTab === 'form' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Đang thao tác trên đề thi</p>
                  <p className="font-bold text-foreground">{selectedExam?.title}</p>
                </div>
                <Badge className="bg-primary hover:bg-primary uppercase text-sm font-bold tracking-wider px-3 py-1">
                  {part}
                </Badge>
              </div>


              <PassageEditor part={part} passages={passages} setPassages={setPassages} />

              <QuestionEditor
                part={part}
                questions={questions}
                setQuestions={setQuestions}
                isSingleQuestionPart={isSingleQuestionPart}
                DEFAULT_OPTIONS={DEFAULT_OPTIONS}
              />
            </div>
          )}
        </div>


        <SheetFooter className="px-6 py-4 border-t bg-muted/20 shrink-0 flex gap-2 sm:justify-end">
          <Button variant="outline" className="h-11 rounded-md" onClick={onClose} disabled={isPending || isSaving}>Hủy bỏ</Button>
          {step === 2 && (
            <Button onClick={handleSave} disabled={isPending || isSaving} className="min-w-[120px] h-11 rounded-md">
              {(isPending || isSaving) ? 'Đang xử lý...' : (
                <><Save className="w-4 h-4 mr-2" /> Lưu dữ liệu</>
              )}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
