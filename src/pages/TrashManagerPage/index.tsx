import { useState } from 'react';
import { useTrash, useRestoreTrash, useHardDeleteTrash } from '@/hooks/useTrash';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function TrashManagerPage() {
  const [type, setType] = useState('exam');
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useTrash(type, { page, limit: 10 });

  const { mutate: restore, isPending: restoring } = useRestoreTrash();
  const { mutate: hardDelete, isPending: deleting } = useHardDeleteTrash();

  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);

  const handleOpenRestore = (id: string, name: string) => {
    setSelectedItem({ id, name });
    setConfirmRestoreOpen(true);
  };

  const handleOpenDelete = (id: string, name: string) => {
    setSelectedItem({ id, name });
    setConfirmDeleteOpen(true);
  };

  const onConfirmRestore = () => {
    if (selectedItem) {
      restore({ type, id: selectedItem.id }, { onSuccess: () => setConfirmRestoreOpen(false) });
    }
  };

  const onConfirmDelete = () => {
    if (selectedItem) {
      hardDelete({ type, id: selectedItem.id }, { onSuccess: () => setConfirmDeleteOpen(false) });
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Thùng Rác</h2>
        <p className="text-muted-foreground mt-2">
          Quản lý các đề thi và câu hỏi đã bị xóa. Hệ thống tự động xóa vĩnh viễn dữ liệu sau 30 ngày.
        </p>
      </div>

      <div className="flex gap-4 items-center bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <p className="text-sm">
          <strong>Lưu ý:</strong> Khôi phục dữ liệu ở đây sẽ khôi phục lại tất cả các bản ghi liên quan. Xóa vĩnh viễn không thể hoàn tác.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Select value={type} onValueChange={(val) => { setType(val); setPage(1); }}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Chọn loại dữ liệu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exam">Đề thi (Exams)</SelectItem>
            <SelectItem value="question">Câu hỏi (Questions)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề / Nội dung</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Ngày xóa</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-rose-500">Lỗi khi tải dữ liệu thùng rác.</TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Thùng rác trống.</TableCell>
              </TableRow>
            ) : (
              data?.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[300px] truncate" title={item.title || item.questionText}>
                    {item.title || item.questionText || '(Không có nội dung)'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {item.deletedAt ? format(new Date(item.deletedAt), 'HH:mm dd/MM/yyyy', { locale: vi }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenRestore(item.id, item.title || item.questionText || '')}>
                      <RotateCcw className="mr-1 h-3 w-3" /> Khôi phục
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleOpenDelete(item.id, item.title || item.questionText || '')}>
                      <Trash2 className="mr-1 h-3 w-3" /> Xóa vĩnh viễn
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={confirmRestoreOpen}
        onOpenChange={setConfirmRestoreOpen}
        title="Xác nhận khôi phục"
        description={`Bạn có chắc chắn muốn khôi phục "${selectedItem?.name}" không?`}
        onConfirm={onConfirmRestore}
        isLoading={restoring}
        variant="default"
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Xác nhận xóa vĩnh viễn"
        description={`Hành động này sẽ xóa hoàn toàn "${selectedItem?.name}" khỏi cơ sở dữ liệu và không thể hoàn tác. Bạn có chắc chắn?`}
        onConfirm={onConfirmDelete}
        isLoading={deleting}
        variant="destructive"
      />
    </div>
  );
}

export default TrashManagerPage;
