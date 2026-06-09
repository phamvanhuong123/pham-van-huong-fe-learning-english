import { useBroadcasts } from '@/hooks/useNotifications'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useState } from 'react'
import { Target } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { AdminTableLoading } from '@/components/admin/AdminTableLoading'

export function BroadcastHistory() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useBroadcasts({ page, limit: 10 })

  if (error) {
    return <div className="text-center py-8 text-rose-500">Lỗi khi tải lịch sử phát sóng.</div>
  }

  const broadcasts = data?.broadcasts || []
  const pagination = data?.pagination

  return (
    <div className="space-y-4">
      <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Loại / Đối tượng</TableHead>
              <TableHead>Người gửi</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminTableLoading columns={5} rows={5} />
            ) : broadcasts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40">
                  <AdminEmptyState
                    title="Chưa có thông báo"
                    description="Hiện chưa có thông báo nào được phát sóng."
                    icon="file"
                  />
                </TableCell>
              </TableRow>
            ) : (
              broadcasts.map((b) => (
                <TableRow key={b.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell className="font-medium max-w-[200px] py-4 truncate text-foreground">
                    {b.title}
                  </TableCell>
                  <TableCell
                    className="max-w-[300px] truncate text-muted-foreground text-sm py-4"
                    title={b.body}
                  >
                    {b.body}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant="outline" className="text-[10px]">
                        {b.type}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                        <Target className="w-3 h-3" /> {b.targetRole}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{b.sender?.name || 'Admin'}</span>
                      <span className="text-xs text-muted-foreground">{b.sender?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {format(new Date(b.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={pagination.page <= 1}
          >
            Trước
          </Button>
          <div className="text-sm font-medium">
            Trang {pagination.page} / {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}
