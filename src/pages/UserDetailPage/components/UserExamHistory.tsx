import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function UserExamHistory({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['adminUserResults', userId, page],
    queryFn: () => adminService.getUserResults(userId, { page, limit: 10 }),
    enabled: !!userId
  });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg bg-card/50">
          Người dùng này chưa có lịch sử làm bài nào.
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Đề thi</th>
                <th className="px-4 py-3 font-medium text-center">Điểm số</th>
                <th className="px-4 py-3 font-medium text-center">Số câu đúng</th>
                <th className="px-4 py-3 font-medium text-center">Thời gian</th>
                <th className="px-4 py-3 font-medium">Ngày nộp</th>
                <th className="px-4 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.results.map((r: any) => (
                <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    {r.exam?.title || 'Đề thi đã bị xóa'}
                    {r.exam?.type === 'VIP' && <Badge variant="secondary" className="ml-2 text-[10px]">VIP</Badge>}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-primary">
                    {r.score}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-emerald-600 font-medium">{r.correctQ}</span> / {r.totalQ}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(r.timeTaken / 60)} phút {r.timeTaken % 60}s
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.submittedAt ? format(new Date(r.submittedAt), 'HH:mm dd/MM/yy', { locale: vi }) : 'Đang làm'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/admin/results/${r.id}`)}
                      disabled={!r.submittedAt}
                    >
                      <Eye className="w-4 h-4 mr-2" /> Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data?.pagination.totalPages > 1 && (
            <div className="p-4 border-t flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Trước
              </Button>
              <div className="flex items-center px-4 text-sm font-medium">
                Trang {page} / {data.pagination.totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
