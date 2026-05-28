import { useState } from 'react';
import { useLogs } from '@/hooks/useLogs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AdminTableLoading } from '@/components/admin/AdminTableLoading';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';

function AdminLogsPage() {
  const [page, setPage] = useState(1);
  const [actionSearch, setActionSearch] = useState('');
  
  // Debounce search could be added here, but for simplicity we'll just use the raw value
  // In a real app, use a debounced value.
  const { data, isLoading, error } = useLogs({ page, limit: 15, action: actionSearch || undefined });

  if (error) {
    return <div className="p-8 text-center text-rose-500">Lỗi khi tải nhật ký quản trị.</div>;
  }

  const logs = data?.logs || [];
  const pagination = data?.pagination;

  const getActionColor = (action: string) => {
    if (action.includes('delete') || action.includes('ban') || action.includes('revoke')) return 'destructive';
    if (action.includes('create') || action.includes('assign') || action.includes('restore')) return 'default';
    return 'secondary';
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nhật Ký Quản Trị</h2>
        <p className="text-muted-foreground mt-2">
          Theo dõi tất cả các thao tác quan trọng trên hệ thống (Audit Logs).
        </p>
      </div>

      <div className="flex gap-4 items-center bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-xl border border-dashed mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Lọc theo hành động (VD: user.ban)..."
            value={actionSearch}
            onChange={(e) => { setActionSearch(e.target.value); setPage(1); }}
            className="pl-9 h-10 bg-background focus-visible:ring-primary/20 transition-all rounded-full"
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Quản trị viên</TableHead>
              <TableHead>Hành động</TableHead>
              <TableHead>Đối tượng</TableHead>
              <TableHead>Mô tả chi tiết</TableHead>
              <TableHead className="text-right">Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminTableLoading columns={5} rows={10} />
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40">
                  <AdminEmptyState title="Không có nhật ký" description="Chưa có hành động nào được ghi nhận." icon="file" />
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{log.admin?.name || 'Hệ thống'}</span>
                      <span className="text-xs text-muted-foreground">{log.admin?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionColor(log.action)} className="text-[10px] uppercase">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm">{log.targetType}</span>
                    {log.targetId && <span className="block text-xs text-muted-foreground">{log.targetId.substring(0, 8)}...</span>}
                  </TableCell>
                  <TableCell className="text-xs max-w-[300px] truncate text-muted-foreground">
                    {log.detail ? JSON.stringify(log.detail) : 'Không có chi tiết'}
                  </TableCell>
                  <TableCell className="text-right text-xs whitespace-nowrap text-muted-foreground">
                    {format(new Date(log.createdAt), 'HH:mm:ss dd/MM/yyyy', { locale: vi })}
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

export default AdminLogsPage;
