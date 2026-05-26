import type { AdminLog } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RecentActivityProps {
  logs: AdminLog[];
}

export function RecentActivity({ logs }: RecentActivityProps) {
  const getActionColor = (action: string) => {
    if (action.includes('delete') || action.includes('ban') || action.includes('revoke')) return 'destructive';
    if (action.includes('create') || action.includes('assign') || action.includes('restore')) return 'default';
    return 'secondary';
  };

  const formatAction = (action: string) => {
    return action.replace(/\./g, ' ').toUpperCase();
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Chưa có hoạt động nào</div>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getActionColor(log.action)} className="text-[10px]">
                      {formatAction(log.action)}
                    </Badge>
                    <span className="font-medium text-sm">{log.admin?.name || log.admin?.email || 'Hệ thống'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Đã thực hiện thao tác trên <span className="font-medium text-foreground">{log.targetType}</span> 
                    {log.targetId && ` (ID: ${log.targetId})`}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.createdAt), 'HH:mm dd/MM', { locale: vi })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
