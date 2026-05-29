import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface QuestionEditorProps {
  part: string;
  questions: any[];
  setQuestions: (val: any[]) => void;
  isSingleQuestionPart: boolean;
  DEFAULT_OPTIONS: any[];
}

export function QuestionEditor({
  part,
  questions,
  setQuestions,
  isSingleQuestionPart,
  DEFAULT_OPTIONS
}: QuestionEditorProps) {

  const PART_ORDER_BOUNDS: Record<string, { min: number, max: number }> = {
    PART1: { min: 1, max: 6 },
    PART2: { min: 7, max: 31 },
    PART3: { min: 32, max: 70 },
    PART4: { min: 71, max: 100 },
    PART5: { min: 101, max: 130 },
    PART6: { min: 131, max: 146 },
    PART7: { min: 147, max: 200 }
  };

  const addQuestion = () => {
    let nextOrder = part !== 'FULL' && PART_ORDER_BOUNDS[part] ? PART_ORDER_BOUNDS[part].min : 1;
    if (questions.length > 0) {
      nextOrder = Number(questions[questions.length - 1].order) + 1;
    }
    
    setQuestions([...questions, {
      order: nextOrder,
      questionText: '',
      difficulty: 'MEDIUM',
      explanation: '',
      options: JSON.parse(JSON.stringify(part === 'PART2' ? DEFAULT_OPTIONS.slice(0, 3) : DEFAULT_OPTIONS))
    }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-bold">
          {isSingleQuestionPart ? 'Nội dung chi tiết' : 'Danh sách Câu hỏi con'}
        </h3>
        {!isSingleQuestionPart && (
          <Button variant="secondary" size="sm" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" /> Thêm câu hỏi
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="p-5 rounded-lg border bg-card/50 shadow-sm space-y-6 relative group">
            {!isSingleQuestionPart && questions.length > 1 && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Thứ tự (Câu số)</Label>
                <Input
                  type="number"
                  min={part === 'PART1' ? 1 : part === 'PART2' ? 7 : part === 'PART3' ? 32 : part === 'PART4' ? 71 : part === 'PART5' ? 101 : part === 'PART6' ? 131 : part === 'PART7' ? 147 : 1}
                  max={part === 'PART1' ? 6 : part === 'PART2' ? 31 : part === 'PART3' ? 70 : part === 'PART4' ? 100 : part === 'PART5' ? 130 : part === 'PART6' ? 146 : part === 'PART7' ? 200 : undefined}
                  value={q.order}
                  className="h-11 rounded-md hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 transition-all"
                  onChange={(e) => {
                    const nQ = [...questions];
                    nQ[qIdx].order = e.target.value;
                    setQuestions(nQ);
                  }}
                />
              </div>
              {part !== 'PART1' && part !== 'PART6' && (
                <div className="md:col-span-10 space-y-2">
                  <Label>Nội dung câu hỏi {part === 'PART2' && <span className="text-muted-foreground font-normal text-xs">(Transcript dùng để hiển thị khi Xem lại bài)</span>}</Label>
                  <Input
                    placeholder="Nhập nội dung câu hỏi..."
                    value={q.questionText || ''}
                    className="h-11 rounded-md hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 transition-all"
                    onChange={(e) => {
                      const nQ = [...questions];
                      nQ[qIdx].questionText = e.target.value;
                      setQuestions(nQ);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {q.options.map((opt: any, optIdx: number) => (
                <div
                  key={optIdx}
                  className={cn(
                    "relative flex items-center gap-3 p-3 rounded-md border-2 transition-all duration-200 cursor-pointer group",
                    opt.isCorrect
                      ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "border-border/50 bg-card hover:border-border hover:shadow-sm"
                  )}
                  onClick={() => {
                    const nQ = [...questions];
                    nQ[qIdx].options = nQ[qIdx].options.map((o: any, i: number) => ({
                      ...o, isCorrect: i === optIdx
                    }));
                    setQuestions(nQ);
                  }}
                >
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors shrink-0",
                      opt.isCorrect ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    )}
                  >
                    {opt.label}
                  </button>
                  <div className="flex-1 pr-8">
                    <Input
                      placeholder={`Nhập đáp án ${opt.label}...`}
                      value={opt.text}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const nQ = [...questions];
                        nQ[qIdx].options[optIdx].text = e.target.value;
                        setQuestions(nQ);
                      }}
                      className={cn(
                        "border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none h-auto py-1",
                        opt.isCorrect ? "text-emerald-700 dark:text-emerald-400 font-medium placeholder:text-emerald-700/50" : ""
                      )}
                    />
                  </div>
                  {opt.isCorrect && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center justify-center animate-in zoom-in duration-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Giải thích đáp án</Label>
                <ReactQuill
                  theme="snow"
                  value={q.explanation || ''}
                  onChange={(v) => {
                    const nQ = [...questions];
                    nQ[qIdx].explanation = v;
                    setQuestions(nQ);
                  }}
                  className="bg-background rounded-md"
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label>Độ khó</Label>
                <Select value={q.difficulty} onValueChange={(v) => {
                  const nQ = [...questions];
                  nQ[qIdx].difficulty = v as any;
                  setQuestions(nQ);
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Dễ</SelectItem>
                    <SelectItem value="MEDIUM">Trung bình</SelectItem>
                    <SelectItem value="HARD">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
