import { useState } from 'react';
import { ExamTable } from './ExamTable';
import { ExamFormDialog } from './ExamFormDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { AdminExamItem, ExamCreateBody } from '@/types/exam.type';

const INITIAL_MOCK_EXAMS: AdminExamItem[] = [
  {
    id: "exam-uuid-1-photos",
    title: "TOEIC Practice Test 2026 — Part 1 Photo Exercises",
    part: "PART1",
    difficulty: "EASY",
    type: "FREE",
    duration: 10,
    isPublished: true,
    questionCount: 6,
    parentExamId: null
  },
  {
    id: "exam-uuid-2-grammar",
    title: "TOEIC 750+ Targeted Grammar Practice Test",
    part: "PART5",
    difficulty: "HARD",
    type: "VIP",
    duration: 20,
    isPublished: true,
    questionCount: 30,
    parentExamId: null
  },
  {
    id: "exam-uuid-3-reading",
    title: "Double & Triple Passages Reading Comprehension Test",
    part: "PART7",
    difficulty: "MEDIUM",
    type: "FREE",
    duration: 50,
    isPublished: false,
    questionCount: 54,
    parentExamId: null
  },
  {
    id: "exam-uuid-4-conversations",
    title: "Part 3 Listening Boost — Audio Exercises",
    part: "PART3",
    difficulty: "MEDIUM",
    type: "VIP",
    duration: 30,
    isPublished: true,
    questionCount: 39,
    parentExamId: null
  },
  {
    id: "exam-uuid-5-full",
    title: "ETS TOEIC 2024 Actual Test Simulation 1",
    part: "FULL",
    difficulty: "MEDIUM",
    type: "VIP",
    duration: 120,
    isPublished: true,
    questionCount: 200,
    parentExamId: null,
    childExams: [
      { id: "exam-uuid-1-photos", part: "PART1", title: "TOEIC Practice Test 2026 — Part 1 Photo Exercises", questionCount: 6 },
      { id: "exam-uuid-2-grammar", part: "PART5", title: "TOEIC 750+ Targeted Grammar Practice Test", questionCount: 30 },
      { id: "exam-uuid-4-conversations", part: "PART3", title: "Part 3 Listening Boost — Audio Exercises", questionCount: 39 }
    ]
  }
];

export function ExamManagementContainer() {
  const [exams, setExams] = useState<AdminExamItem[]>(INITIAL_MOCK_EXAMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<AdminExamItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingExam, setDeletingExam] = useState<AdminExamItem | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (exam: AdminExamItem) => {
    setSelectedExam(exam);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedExam(null);
    setIsDialogOpen(true);
  };

  // Event handler for Create / Update (Local simulation)
  const handleSave = async (body: ExamCreateBody) => {
    setIsSaving(true);
    console.log("Dữ liệu gửi lên API để xử lý:", body);

    // Simulate Network Latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (selectedExam) {
      // Update Action
      setExams(prev => prev.map(e => {
        if (e.id === selectedExam.id) {
          const childExamsMapped = body.childrenIdExam?.map(cid => {
            const matched = exams.find(item => item.id === cid);
            return {
              id: cid,
              part: matched?.part || 'PART1',
              title: matched?.title || 'Đề thành phần',
              questionCount: matched?.questionCount || 0
            };
          });

          return {
            ...e,
            title: body.title,
            part: body.part,
            difficulty: body.difficulty,
            type: body.type,
            duration: body.duration,
            childExams: childExamsMapped
          };
        }
        return e;
      }));
      toast.success('Cập nhật đề thi thành công!');
    } else {
      // Create Action
      const newExam: AdminExamItem = {
        id: `mock-exam-id-${Math.random().toString(36).substr(2, 9)}`,
        title: body.title,
        part: body.part,
        difficulty: body.difficulty,
        type: body.type,
        duration: body.duration,
        isPublished: false,
        questionCount: body.part === 'FULL' ? 200 : 30, // Mock question count
        parentExamId: null,
        childExams: body.childrenIdExam?.map(cid => {
          const matched = exams.find(item => item.id === cid);
          return {
            id: cid,
            part: matched?.part || 'PART1',
            title: matched?.title || 'Đề thành phần',
            questionCount: matched?.questionCount || 0
          };
        })
      };
      setExams(prev => [newExam, ...prev]);
      toast.success('Tạo đề thi mới thành công!');
    }

    setIsSaving(false);
    setIsDialogOpen(false);
    setSelectedExam(null);
  };

  // Toggle publish status (Local simulation)
  const handleToggleStatus = (exam: AdminExamItem) => {
    console.log(`Đang gửi thay đổi trạng thái isPublished của đề ${exam.id} lên API:`, !exam.isPublished);
    setExams(prev => prev.map(e => {
      if (e.id === exam.id) {
        return { ...e, isPublished: !e.isPublished };
      }
      return e;
    }));
    toast.success(exam.isPublished ? 'Đã gỡ đề thi thành công' : 'Đã công khai đề thi thành công');
  };

  // Delete Action (Local simulation)
  const handleDeleteConfirm = () => {
    if (!deletingExam) return;
    console.log("Gửi yêu cầu xóa đề thi lên API, ID:", deletingExam.id);
    setExams(prev => prev.filter(e => e.id !== deletingExam.id));
    toast.success(`Đã chuyển đề thi "${deletingExam.title}" vào thùng rác thành công`);
    setDeletingExam(null);
  };

  // Bulk Delete Action (Local simulation)
  const handleBulkDeleteConfirm = () => {
    console.log("Gửi yêu cầu xóa hàng loạt đề thi lên API, danh sách ID:", selectedIds);
    setExams(prev => prev.filter(e => !selectedIds.includes(e.id)));
    toast.success(`Đã chuyển ${selectedIds.length} đề thi đã chọn vào thùng rác thành công`);
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
  };

  const filteredExams = exams.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Top Search and Add Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
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
          isLoading={false}
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
        onClose={() => setIsDialogOpen(false)}
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
        isLoading={false}
        title="Xóa đề thi?"
        description={`Bạn có chắc muốn chuyển đề thi "${deletingExam?.title}" vào thùng rác?`}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={false}
        title="Xóa hàng loạt?"
        description={`Bạn có chắc muốn chuyển ${selectedIds.length} đề thi đã chọn vào thùng rác?`}
      />
    </div>
  );
}
