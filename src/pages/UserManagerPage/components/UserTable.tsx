import type { UserListDTO } from '@/services/adminService'
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
import { MoreHorizontal, UserCog, Eye, Ban, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useNavigate } from 'react-router'
import { AdminTableLoading } from '@/components/admin/AdminTableLoading'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'

interface UserTableProps {
  users: UserListDTO[]
  pagination: any
  isLoading: boolean
  error: any
  onPageChange: (page: number) => void
  onOpenBanModal: (userId: string, isBanned: boolean) => void
  onOpenAssignRoleModal: (userId: string) => void
}

export function UserTable({
  users,
  pagination,
  isLoading,
  error,
  onPageChange,
  onOpenBanModal,
  onOpenAssignRoleModal,
}: UserTableProps) {
  const navigate = useNavigate()

  if (error) {
    return (
      <div className="text-center py-8 text-rose-500 bg-white border border-rose-100 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        Lỗi khi tải danh sách người dùng.
      </div>
    )
  }

  const renderRoles = (user: UserListDTO) => {
    const isVip = user.vipExpiresAt && new Date(user.vipExpiresAt) > new Date()

    if ((!user.userRoles || user.userRoles.length === 0) && !isVip) {
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-medium border-none shadow-none text-[11px]"
        >
          User
        </Badge>
      )
    }
    return (
      <div className="flex gap-1.5 flex-wrap">
        {user.userRoles &&
          user.userRoles.map((ur, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none font-medium shadow-none text-[11px]"
            >
              {ur.role.name}
            </Badge>
          ))}
        {isVip && (
          <Badge
            variant="default"
            className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 shadow-none font-medium text-[11px]"
          >
            VIP
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 text-[12px] font-medium text-muted-foreground">
                User
              </TableHead>
              <TableHead className="h-10 text-[12px] font-medium text-muted-foreground">
                Vai trò
              </TableHead>
              <TableHead className="h-10 text-[12px] font-medium text-muted-foreground">
                Trạng thái
              </TableHead>
              <TableHead className="h-10 text-[12px] font-medium text-muted-foreground">
                Ngày tạo
              </TableHead>
              <TableHead className="h-10 text-[12px] font-medium text-muted-foreground text-right">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminTableLoading columns={5} rows={5} />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40">
                  <AdminEmptyState
                    title="Không tìm thấy người dùng"
                    description="Không có người dùng nào phù hợp với tìm kiếm."
                    icon="user"
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-slate-900 text-[13px]">{user.email}</span>
                      <span className="text-[12px] text-muted-foreground">{user.name || '—'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderRoles(user)}</TableCell>
                  <TableCell>
                    {user.isBanned ? (
                      <Badge
                        variant="destructive"
                        className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200 shadow-none font-medium text-[11px]"
                      >
                        Đã khóa
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 shadow-none font-medium text-[11px]"
                      >
                        Hoạt động
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-[13px] text-slate-600">
                    {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl shadow-lg border-border/50"
                      >
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          className="text-[13px] cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onOpenAssignRoleModal(user.id)}
                          className="text-[13px] cursor-pointer"
                        >
                          <UserCog className="mr-2 h-4 w-4 text-muted-foreground" /> Cấp / Thu quyền
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onOpenBanModal(user.id, user.isBanned)}
                          className={`text-[13px] cursor-pointer focus:bg-rose-50 focus:text-rose-700 ${user.isBanned ? 'text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700' : 'text-rose-600'}`}
                        >
                          {user.isBanned ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" /> Mở khóa tài khoản
                            </>
                          ) : (
                            <>
                              <Ban className="mr-2 h-4 w-4" /> Khóa tài khoản
                            </>
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
        <div className="flex items-center justify-between pt-2">
          <p className="text-[12px] text-muted-foreground">
            Hiển thị trang <span className="font-medium text-slate-900">{pagination.page}</span>{' '}
            trên <span className="font-medium text-slate-900">{pagination.totalPages}</span>
          </p>
          <div className="flex items-center space-x-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="h-8 text-[12px] bg-white border-border/50 shadow-none hover:bg-slate-50"
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="h-8 text-[12px] bg-white border-border/50 shadow-none hover:bg-slate-50"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
