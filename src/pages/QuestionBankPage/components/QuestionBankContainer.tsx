import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Filter } from 'lucide-react';

import { getExamsApi } from '@/services/examService';
import { useQuestions, useSaveQuestion, useDeleteQuestion } from '@/hooks/queries/useQuestionQuery';
import {
  TOEIC_PARTS,
  DIFFICULTY_OPTIONS,
  PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZE,
} from '@/constants/question.constants';
import type { QuestionQueryParams, QuestionRow } from '@/types/question.type';
import type { AdminExamItem } from '@/types/exam.type';

import { QuestionTable } from './QuestionTable';
import { QuestionFormDialog } from './QuestionFormDialog';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditingItem {
  data: QuestionRow;
  isGroup: boolean;
}

interface DeletingItem {
  data: QuestionRow;
  isGroup: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function QuestionBankContainer() {
  // --- Pagination & Filter state ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [examId, setExamId] = useState('ALL');
  const [difficulty, setDifficulty] = useState('ALL');
  const [part, setPart] = useState('ALL');

  // --- Dialog state ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<DeletingItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- Debounce search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // --- Build query params ---
  const queryParams: QuestionQueryParams = {
    page,
    limit,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(examId !== 'ALL' && { examId }),
    ...(difficulty !== 'ALL' && { difficulty }),
    ...(part !== 'ALL' && { part }),
  };

  // --- Data fetching ---
  const { data: questionsResponse, isLoading } = useQuestions(queryParams);

  const { data: examsList = [] } = useQuery({
    queryKey: ['admin', 'exams-list'],
    queryFn: async (): Promise<AdminExamItem[]> => {
      const res = await getExamsApi();
      const raw = res.data?.data || res.data;
      return Array.isArray(raw) ? raw : (raw?.exams ?? []);
    },
    staleTime: 60_000,
  });

  // --- Mutations ---
  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(null);
  }, []);

  const closeDelete = useCallback(() => {
    setDeletingItem(null);
  }, []);

  const saveMutation = useSaveQuestion(closeForm);

  const deleteMutation = useDeleteQuestion(closeDelete);

  // --- Handlers ---
  const handleEdit = useCallback((item: QuestionRow, isGroup: boolean) => {
    setEditingItem({ data: item, isGroup });
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((item: QuestionRow, isGroup: boolean) => {
    setDeletingItem({ data: item, isGroup });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deletingItem) return;
    deleteMutation.mutate({
      id: deletingItem.data.id,
      isGroup: deletingItem.isGroup,
    });
  }, [deletingItem, deleteMutation]);

  const handleExamFilterChange = useCallback((val: string) => {
    setExamId(val);
    if (val !== 'ALL') {
      const ex = examsList.find((e) => e.id === val);
      if (ex) setPart(ex.part);
    } else {
      setPart('ALL');
    }
    setPage(1);
  }, [examsList]);

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const pagination = questionsResponse?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalCount = pagination?.total ?? 0;
  const displayedCount = questionsResponse?.questions?.length ?? 0;


  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-6">

      {/* ── Filters Bar ── */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="flex flex-wrap w-full sm:w-auto items-center gap-3">

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo nội dung câu hỏi..."
              className="pl-9 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Filter className="w-4 h-4 text-muted-foreground hidden lg:block mx-1" />

          {/* Exam filter */}
          <Select value={examId} onValueChange={handleExamFilterChange}>
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="Tất cả đề thi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="font-bold">Tất cả đề thi</SelectItem>
              {examsList.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>{ex.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Part filter */}
          <Select
            value={part}
            onValueChange={(v) => { setPart(v); setPage(1); }}
            disabled={examId !== 'ALL'}
          >
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="Part" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả Part</SelectItem>
              {TOEIC_PARTS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty filter */}
          <Select
            value={difficulty}
            onValueChange={(v) => { setDifficulty(v); setPage(1); }}
          >
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="Độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả độ khó</SelectItem>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Create button */}
        <div className="flex shrink-0">
          <Button className="h-10 px-6 font-semibold shadow-md" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" /> Tạo mới
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 min-h-0 relative">
        <QuestionTable
          questions={questionsResponse?.questions ?? []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          isGroupedView={examId !== 'ALL'}
        />
      </div>

      {/* ── Pagination ── */}
      <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Hiển thị{' '}
            <span className="font-medium text-foreground">{displayedCount}</span>
            {' '}trên tổng số{' '}
            <span className="font-medium text-foreground">{totalCount}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Số hàng:</span>
            <Select
              value={limit.toString()}
              onValueChange={(v) => { setLimit(parseInt(v)); setPage(1); }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={limit.toString()} />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((v) => (
                  <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trang trước
            </Button>
            <span className="text-sm px-4 font-medium">{page} / {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>

      {/* ── Form Dialog ── */}
      <QuestionFormDialog
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={async (data, isGroup) => {
          await saveMutation.mutateAsync({
            data,
            isGroup,
            editingId: editingItem?.data.id,
          });
        }}
        initialData={editingItem?.data}
        exams={examsList}
        isPending={saveMutation.isPending}
      />

      {/* ── Delete Confirm Dialog ── */}
      <DeleteConfirmDialog
        open={!!deletingItem}
        onOpenChange={(open) => {
          if (!open) closeDelete();
        }}
        onConfirm={handleConfirmDelete}
        title="Cảnh báo Xoá"
        description={`Bạn có chắc chắn muốn xoá ${deletingItem?.isGroup ? 'toàn bộ Nhóm câu hỏi này' : 'Câu hỏi này'
          } không? Hành động này không thể hoàn tác và có thể xoá cả file Media đính kèm.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
