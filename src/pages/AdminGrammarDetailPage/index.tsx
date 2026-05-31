import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useGetTopicQuestions, useDeleteGrammarQuestion } from '@/hooks/queries/useGrammarQuery';
import type { AdminGrammarQuestion } from '@/types/grammar.type';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AdminTableLoading } from '@/components/admin/AdminTableLoading';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { QuestionModal } from './components/QuestionModal';
import { toast } from 'sonner';
import {
  Plus, MoreVertical, Edit2, Trash2, ChevronRight, BookMarked,
  CheckCircle2, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DIFFICULTY_CONFIG = {
  EASY: { label: 'Dễ', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  MEDIUM: { label: 'Trung bình', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  HARD: { label: 'Khó', class: 'bg-rose-50 text-rose-700 border-rose-200' },
};

function AdminGrammarDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminGrammarQuestion | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    questionId: string | null;
  }>({ isOpen: false, questionId: null });

  const { data, isLoading } = useGetTopicQuestions(topicId || '');
  const deleteQuestion = useDeleteGrammarQuestion(topicId || '');

  const topic = data?.topic;
  const questions: AdminGrammarQuestion[] = data?.questions || [];

  const handleCreate = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (q: AdminGrammarQuestion) => {
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmState({ isOpen: true, questionId: id });
  };

  const executeDelete = () => {
    if (!confirmState.questionId) return;
    deleteQuestion.mutate(confirmState.questionId, {
      onSuccess: () => {
        toast.success('Đã xóa câu hỏi');
        setConfirmState({ isOpen: false, questionId: null });
      },
      onError: () => {
        toast.error('Không thể xóa câu hỏi');
        setConfirmState({ isOpen: false, questionId: null });
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => navigate('/admin/grammar')}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <BookMarked className="w-4 h-4" />
          <span>Quản lý ngữ pháp</span>
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium truncate max-w-[300px]">
          {topic?.name || 'Đang tải...'}
        </span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {topic?.name || '...'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {topic?.description || 'Danh sách câu hỏi trong chủ đề này'}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Thêm câu hỏi
        </Button>
      </div>

      {/* Stats bar */}
      {!isLoading && (
        <div className="flex items-center gap-6 px-4 py-3 bg-muted/30 rounded-xl border border-dashed text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-primary" />
            <strong className="text-foreground">{questions.length}</strong> câu hỏi
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <strong className="text-foreground">{questions.filter(q => q.difficulty === 'EASY').length}</strong> dễ
          </span>
          <span>
            <strong className="text-foreground">{questions.filter(q => q.difficulty === 'MEDIUM').length}</strong> trung bình
          </span>
          <span>
            <strong className="text-foreground">{questions.filter(q => q.difficulty === 'HARD').length}</strong> khó
          </span>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nội dung câu hỏi</TableHead>
              <TableHead className="w-32">Độ khó</TableHead>
              <TableHead className="w-28">Đáp án đúng</TableHead>
              <TableHead className="w-20">Số đáp án</TableHead>
              <TableHead className="w-16 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminTableLoading columns={6} rows={5} />
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48">
                  <AdminEmptyState
                    title="Chưa có câu hỏi nào"
                    description="Nhấn «Thêm câu hỏi» để bắt đầu thêm câu hỏi vào chủ đề này."
                    icon="book"
                  />
                </TableCell>
              </TableRow>
            ) : (
              questions.map((q, idx) => {
                const correctOpt = q.options.find(o => o.isCorrect);
                const diff = DIFFICULTY_CONFIG[q.difficulty] || DIFFICULTY_CONFIG.MEDIUM;
                return (
                  <TableRow key={q.id} className="hover:bg-primary/5 transition-colors group">
                    <TableCell className="text-muted-foreground text-sm font-mono">{idx + 1}</TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="font-medium text-sm line-clamp-2">{q.questionText || '(Không có nội dung)'}</p>
                        {q.explanation && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs font-medium', diff.class)}>
                        {diff.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {correctOpt ? (
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            {correctOpt.label}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                            {correctOpt.text}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{q.options.length} đáp án</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleEdit(q)} className="cursor-pointer">
                            <Edit2 className="w-4 h-4 mr-2 text-blue-500" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(q.id)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Question Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topicId={topicId || ''}
        question={editingQuestion}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmState.isOpen}
        onOpenChange={(isOpen) => setConfirmState(prev => ({ ...prev, isOpen }))}
        onConfirm={executeDelete}
        title="Xác nhận xóa câu hỏi"
        description="Câu hỏi sẽ bị xóa khỏi chủ đề này. Lịch sử làm bài của học viên vẫn được giữ nguyên."
        variant="destructive"
      />
    </div>
  );
}

export default AdminGrammarDetailPage;
