import { ExamTable } from './ExamTable';
import { ExamFormDialog } from './ExamFormDialog';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { AdminExamItem, ExamCreateBody } from '@/types/exam.type';

import { useExamStore } from '@/store/useExamStore';
import {
  useExams,
  useCreateExam,
  useUpdateExam,
  useDeleteExam
} from '@/hooks/queries/useExamQuery';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ExamManagementContainer() {
  const {
    searchTerm, setSearchTerm,
    page, setPage,
    limit,
    partFilter, setPartFilter,
    difficultyFilter, setDifficultyFilter,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    selectedIds, setSelectedIds,
    isDialogOpen, openAddDialog, openEditDialog, closeDialog, selectedExam,
    deletingExam, setDeletingExam,
    isBulkDeleteOpen, setIsBulkDeleteOpen
  } = useExamStore();

  const { data: exams = [], isLoading } = useExams();
  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();
  const deleteExamMutation = useDeleteExam();

  const isSaving = createExamMutation.isPending || updateExamMutation.isPending;

  const handleEdit = (exam: AdminExamItem) => {
    openEditDialog(exam);
  };

  const handleAdd = () => {
    openAddDialog();
  };

  const handleSave = async (body: ExamCreateBody) => {
    try {
      if (selectedExam) {
        await updateExamMutation.mutateAsync({ id: selectedExam.id, data: body });
        toast.success('Cập nhật đề thi thành công!');
      } else {
        await createExamMutation.mutateAsync(body);
        // The mutate onSuccess already toasts 'Tạo đề thi mới thành công!'
      }
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (exam: AdminExamItem) => {
    try {
      await updateExamMutation.mutateAsync({ id: exam.id, data: { isPublished: !exam.isPublished } });
      toast.success(!exam.isPublished ? 'Đã công khai đề thi thành công' : 'Đã gỡ đề thi thành công');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExam) return;
    try {
      await deleteExamMutation.mutateAsync(deletingExam.id);
      toast.success(`Đã chuyển đề thi "${deletingExam.title}" vào thùng rác thành công`);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingExam(null);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      await Promise.all(selectedIds.map(id => deleteExamMutation.mutateAsync(id)));
      toast.success(`Đã chuyển ${selectedIds.length} đề thi đã chọn vào thùng rác thành công`);
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsBulkDeleteOpen(false);
    }
  };

  const filteredExams = exams.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPart = partFilter === 'ALL' || e.part === partFilter;
    const matchDifficulty = difficultyFilter === 'ALL' || e.difficulty === difficultyFilter;
    const matchType = typeFilter === 'ALL' || e.type === typeFilter;
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'PUBLISHED' ? e.isPublished : !e.isPublished);

    return matchSearch && matchPart && matchDifficulty && matchType && matchStatus;
  });

  const totalItems = filteredExams.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const paginatedExams = filteredExams.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 p-4 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-xl border border-dashed mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm đề thi..."
              className="pl-9 h-10 bg-background focus-visible:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Button onClick={handleAdd} className="h-10 gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground hover:bg-primary/95">
              <Plus className="w-4 h-4" />
              Thêm đề thi
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={partFilter} onValueChange={setPartFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Phần thi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả phần thi</SelectItem>
              <SelectItem value="PART1">Part 1</SelectItem>
              <SelectItem value="PART2">Part 2</SelectItem>
              <SelectItem value="PART3">Part 3</SelectItem>
              <SelectItem value="PART4">Part 4</SelectItem>
              <SelectItem value="PART5">Part 5</SelectItem>
              <SelectItem value="PART6">Part 6</SelectItem>
              <SelectItem value="PART7">Part 7</SelectItem>
              <SelectItem value="FULL">Full Test</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Mọi độ khó</SelectItem>
              <SelectItem value="EASY">Dễ</SelectItem>
              <SelectItem value="MEDIUM">Vừa</SelectItem>
              <SelectItem value="HARD">Khó</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Loại đề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Mọi loại đề</SelectItem>
              <SelectItem value="FREE">Miễn phí</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Mọi trạng thái</SelectItem>
              <SelectItem value="PUBLISHED">Đã công khai</SelectItem>
              <SelectItem value="DRAFT">Bản nháp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 min-h-0 relative">
        <ExamTable
          exams={paginatedExams}
          isLoading={isLoading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={(e) => setDeletingExam(e)}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />

        {/* Floating Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span className="text-sm font-bold border-r border-background/20 pr-6">
              Đã chọn {selectedIds.length} mục
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-background hover:bg-background/10 hover:text-background"
                onClick={() => setSelectedIds([])}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 font-bold"
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                Xóa tất cả
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50 shrink-0">
          <p className="text-sm text-muted-foreground">
            Hiển thị <span className="font-medium text-foreground">{paginatedExams.length}</span> trên tổng số{' '}
            <span className="font-medium text-foreground">{totalItems}</span> đề thi
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="h-8 px-3"
            >
              Trang trước
            </Button>
            <div className="flex items-center justify-center min-w-[3rem] text-sm font-medium">
              {page} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="h-8 px-3"
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}

      {/* Form modal */}
      <ExamFormDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSave={handleSave}
        initialData={selectedExam}
        isPending={isSaving}
        allExams={exams}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deletingExam}
        onOpenChange={(open) => !open && setDeletingExam(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteExamMutation.isPending}
        title="Xóa đề thi?"
        description={`Bạn có chắc muốn chuyển đề thi "${deletingExam?.title}" vào thùng rác?`}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={deleteExamMutation.isPending}
        title="Xóa hàng loạt?"
        description={`Bạn có chắc muốn chuyển ${selectedIds.length} đề thi đã chọn vào thùng rác?`}
      />
    </div>
  );
}
