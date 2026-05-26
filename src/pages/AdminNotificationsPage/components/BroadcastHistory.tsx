import { useBroadcasts } from '@/hooks/useNotifications';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import { Target } from 'lucide-react';

export function BroadcastHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useBroadcasts({ page, limit: 10 });

  if (error) {
    return <div className="text-center py-8 text-rose-500">Lỗi khi tải lịch sử phát sóng.</div>;
  }

  const broadcasts = data?.broadcasts || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
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
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                </TableRow>
              ))
            ) : broadcasts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Chưa có thông báo nào được phát.
                </TableCell>
              </TableRow>
            ) : (
              broadcasts.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{b.title}</TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground text-sm" title={b.body}>
                    {b.body}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant="outline" className="text-[10px]">{b.type}</Badge>
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
            onClick={() => setPage(p => p - 1)}
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
            onClick={() => setPage(p => p + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
