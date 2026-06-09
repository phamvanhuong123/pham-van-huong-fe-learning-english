import { useState } from 'react'
import { useTrash, useRestoreTrash, useHardDeleteTrash } from '@/hooks/useTrash'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Trash2, RotateCcw, AlertTriangle, MoreVertical } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { AdminTableLoading } from '@/components/admin/AdminTableLoading'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'

function TrashManagerPage() {
  const [type, setType] = useState('exam')
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useTrash(type, { page, limit: 10 })

  const { mutate: restore, isPending: restoring } = useRestoreTrash()
  const { mutate: hardDelete, isPending: deleting } = useHardDeleteTrash()

  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null)

  const handleOpenRestore = (id: string, name: string) => {
    setSelectedItem({ id, name })
    setConfirmRestoreOpen(true)
  }

  const handleOpenDelete = (id: string, name: string) => {
    setSelectedItem({ id, name })
    setConfirmDeleteOpen(true)
  }

  const onConfirmRestore = () => {
    if (selectedItem) {
      restore({ type, id: selectedItem.id }, { onSuccess: () => setConfirmRestoreOpen(false) })
    }
  }

  const onConfirmDelete = () => {
    if (selectedItem) {
      hardDelete({ type, id: selectedItem.id }, { onSuccess: () => setConfirmDeleteOpen(false) })
    }
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Thùng Rác</h2>
        <p className="text-muted-foreground mt-2">
          Quản lý các đề thi và câu hỏi đã bị xóa. Hệ thống tự động xóa vĩnh viễn dữ liệu sau 30
          ngày.
        </p>
      </div>

      <div className="flex gap-4 items-center bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl shadow-sm">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm">
          <strong>Lưu ý:</strong> Khôi phục dữ liệu ở đây sẽ khôi phục lại tất cả các bản ghi liên
          quan. Xóa vĩnh viễn không thể hoàn tác.
        </p>
      </div>

      <div className="flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-xl border border-dashed">
        <Select
          value={type}
          onValueChange={(val) => {
            setType(val)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-[200px] h-10 bg-background rounded-full focus:ring-primary/20 transition-all">
            <SelectValue placeholder="Chọn loại dữ liệu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exam">Đề thi (Exams)</SelectItem>
            <SelectItem value="question">Câu hỏi (Questions)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tiêu đề / Nội dung</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Ngày xóa</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminTableLoading columns={4} rows={5} />
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-rose-500">
                  Lỗi khi tải dữ liệu thùng rác.
                </TableCell>
              </TableRow>
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40">
                  <AdminEmptyState
                    title="Thùng rác trống"
                    description="Không có dữ liệu nào bị xóa gần đây."
                    icon="trash"
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((item) => (
                <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell
                    className="font-medium max-w-[300px] truncate"
                    title={item.title || item.questionText}
                  >
                    {item.title || item.questionText || '(Không có nội dung)'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {item.deletedAt
                      ? format(new Date(item.deletedAt), 'HH:mm dd/MM/yyyy', { locale: vi })
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() =>
                            handleOpenRestore(item.id, item.title || item.questionText || '')
                          }
                          className="cursor-pointer"
                        >
                          <RotateCcw className="mr-2 h-4 w-4 text-emerald-600" /> Khôi phục
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleOpenDelete(item.id, item.title || item.questionText || '')
                          }
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
  )
}

export default TrashManagerPage
