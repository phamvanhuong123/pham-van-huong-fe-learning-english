import type { UserListDTO } from '@/services/adminService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ShieldAlert, Key, UserCog, Eye, Ban, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';

interface UserTableProps {
  users: UserListDTO[];
  pagination: any;
  isLoading: boolean;
  error: any;
  onPageChange: (page: number) => void;
  onOpenBanModal: (userId: string, isBanned: boolean) => void;
  onOpenAssignRoleModal: (userId: string) => void;
}

export function UserTable({ users, pagination, isLoading, error, onPageChange, onOpenBanModal, onOpenAssignRoleModal }: UserTableProps) {
  const navigate = useNavigate();

  if (error) {
    return <div className="text-center py-8 text-rose-500">Lỗi khi tải danh sách người dùng.</div>;
  }

  const renderRoles = (user: UserListDTO) => {
    const isVip = user.vipExpiresAt && new Date(user.vipExpiresAt) > new Date();

    if ((!user.userRoles || user.userRoles.length === 0) && !isVip) {
      return <Badge variant="outline">User</Badge>;
    }
    return (
      <div className="flex gap-1 flex-wrap">
        {user.userRoles && user.userRoles.map((ur, idx) => (
          <Badge key={idx} variant="secondary" className="text-[10px]">
            {ur.role.name}
          </Badge>
        ))}
        {isVip && (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-[10px] text-white">
            VIP
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email / Tên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                      <span className="text-xs text-muted-foreground">{user.name || 'Chưa cập nhật tên'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderRoles(user)}</TableCell>
                  <TableCell>
                    {user.isBanned ? (
                      <Badge variant="destructive">Đã khóa</Badge>
                    ) : (
                      <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Hoạt động</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenAssignRoleModal(user.id)}>
                          <UserCog className="mr-2 h-4 w-4" /> Cấp / Thu quyền
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onOpenBanModal(user.id, user.isBanned)}
                          className={user.isBanned ? "text-emerald-600" : "text-rose-600"}
                        >
                          {user.isBanned ? (
                            <><CheckCircle className="mr-2 h-4 w-4" /> Mở khóa tài khoản</>
                          ) : (
                            <><Ban className="mr-2 h-4 w-4" /> Khóa tài khoản</>
                          )}
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

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
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
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}


