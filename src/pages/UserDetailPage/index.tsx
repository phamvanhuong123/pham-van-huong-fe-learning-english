import { useParams, useNavigate } from 'react-router';
import { useUserDetail, useResetUserPassword, useKickUserSessions } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Key, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useState } from 'react';

function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUserDetail(id || '');

  const { mutate: resetPassword, isPending: resetting } = useResetUserPassword();
  const { mutate: kickSessions, isPending: kicking } = useKickUserSessions();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmKickOpen, setConfirmKickOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error || !user) {
    return <div className="p-8 text-rose-500">Lỗi khi tải thông tin chi tiết.</div>;
  }

  const handleResetPassword = () => {
    if (id) {
      resetPassword(id, { onSuccess: () => setConfirmResetOpen(false) });
    }
  };

  const handleKickSessions = () => {
    if (id) {
      kickSessions(id, { onSuccess: () => setConfirmKickOpen(false) });
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Chi tiết Người dùng</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-medium text-xs">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên hiển thị:</span>
                <span className="font-medium">{user.name || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày đăng ký:</span>
                <span className="font-medium">{format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                {user.isBanned ? <Badge variant="destructive">Bị khóa</Badge> : <Badge variant="default" className="bg-emerald-500">Hoạt động</Badge>}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Thao tác nguy hiểm</h3>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50" onClick={() => setConfirmResetOpen(true)}>
                <Key className="mr-2 h-4 w-4" /> Reset mật khẩu (Tạo mới ngẫu nhiên)
              </Button>
              <Button variant="outline" className="justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => setConfirmKickOpen(true)}>
                <LogOut className="mr-2 h-4 w-4" /> Đóng băng toàn bộ phiên đăng nhập
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Vai trò (Roles)</h3>
            {user.userRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Không có vai trò đặc biệt.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.userRoles.map((ur, idx) => (
                  <Badge key={idx} variant="secondary">{ur.role.name}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Các phiên đăng nhập (Active)</h3>
            {user.sessions?.length === 0 ? (
              <p className="text-sm text-muted-foreground">Không có phiên đăng nhập nào đang hoạt động.</p>
            ) : (
              <div className="space-y-4">
                {user.sessions?.map((session) => (
                  <div key={session.id} className="text-sm border-b pb-2 last:border-0">
                    <p><span className="text-muted-foreground">IP:</span> {session.ipAddress}</p>
                    <p><span className="text-muted-foreground">Thiết bị:</span> <span className="text-xs">{session.deviceInfo}</span></p>
                    <p><span className="text-muted-foreground">Hoạt động cuối:</span> {format(new Date(session.lastActiveAt), 'HH:mm dd/MM/yy', { locale: vi })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        title="Reset mật khẩu"
        description="Hệ thống sẽ tạo một mật khẩu ngẫu nhiên, gửi email cho người dùng, và đăng xuất họ khỏi tất cả các thiết bị. Bạn có chắc chắn?"
        onConfirm={handleResetPassword}
        isLoading={resetting}
        variant="destructive"
      />

      <ConfirmDialog
        open={confirmKickOpen}
        onOpenChange={setConfirmKickOpen}
        title="Đóng băng phiên đăng nhập"
        description="Hành động này sẽ vô hiệu hóa ngay lập tức tất cả các token hiện tại của người dùng. Họ sẽ bị văng ra khỏi hệ thống. Xác nhận?"
        onConfirm={handleKickSessions}
        isLoading={kicking}
        variant="destructive"
      />
    </div>
  );
}

export default UserDetailPage;
