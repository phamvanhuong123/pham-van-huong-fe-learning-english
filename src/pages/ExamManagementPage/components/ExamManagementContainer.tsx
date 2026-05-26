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

export function ExamManagementContainer() {
  const {
    searchTerm, setSearchTerm,
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

  const filteredExams = exams.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Top Search and Add Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-md border border-border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đề thi..."
            className="pl-9 h-10 hover:border-primary/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
          <Button onClick={handleAdd} className="h-10 gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground hover:bg-primary/95">
            <Plus className="w-4 h-4" />
            Thêm đề thi
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 min-h-0 relative">
        <ExamTable
          exams={filteredExams}
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
