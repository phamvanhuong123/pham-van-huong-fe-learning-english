import { Bell, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/queries/useNotificationQuery';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function NotificationBell() {
  const { data, isLoading } = useNotifications(1, 20); // Fetch top 20
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.data || [];
  const unreadCount = data?.meta.unreadCount || 0;

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate(id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background border-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0 shadow-lg border-muted">
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
          <h3 className="font-semibold text-sm">Thông báo</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-primary hover:text-primary/80 px-2"
              onClick={() => markAllAsRead.mutate()}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto flex flex-col scrollbar-thin">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Đang tải thông báo...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">Bạn chưa có thông báo nào</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                className={`
                  flex flex-col p-4 border-b last:border-0 cursor-pointer transition-colors
                  ${notif.isRead ? 'bg-background hover:bg-muted/50' : 'bg-primary/5 hover:bg-primary/10'}
                `}
              >
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className={`text-sm ${notif.isRead ? 'font-medium text-foreground/80' : 'font-semibold text-primary'}`}>
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                  {notif.body}
                </p>
                <span className="flex items-center text-[10px] text-muted-foreground mt-2 font-medium">
                  <Clock className="w-3 h-3 mr-1 opacity-70" />
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                </span>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
