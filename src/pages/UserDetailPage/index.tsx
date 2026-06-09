import { useParams } from 'react-router'
import { useUserDetail, useResetUserPassword, useKickUserSessions } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Key, LogOut } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useState } from 'react'
import { UserExamHistory } from './components/UserExamHistory'

import { UAParser } from 'ua-parser-js'

function formatDevice(ua: string | null | undefined) {
  if (!ua) return 'Không xác định'
  try {
    const parser = new UAParser(ua)
    const result = parser.getResult()
    const os = result.os.name || 'Không xác định'
    const browser = result.browser.name || 'Không xác định'
    if (os === 'Không xác định' && browser === 'Không xác định') return 'Thiết bị lạ'
    return `${os} - ${browser}`
  } catch (error) {
    return 'Không thể xác định'
  }
}

function UserDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: user, isLoading, error } = useUserDetail(id || '')

  const { mutate: resetPassword, isPending: resetting } = useResetUserPassword()
  const { mutate: kickSessions, isPending: kicking } = useKickUserSessions()

  const [confirmResetOpen, setConfirmResetOpen] = useState(false)
  const [confirmKickOpen, setConfirmKickOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (error || !user) {
    return <div className="p-8 text-rose-500">Lỗi khi tải thông tin chi tiết.</div>
  }

  const handleResetPassword = () => {
    if (id) {
      resetPassword(id, { onSuccess: () => setConfirmResetOpen(false) })
    }
  }

  const handleKickSessions = () => {
    if (id) {
      kickSessions(id, { onSuccess: () => setConfirmKickOpen(false) })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xl font-bold shadow-sm">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              {user.name || user.email}
            </h2>
            <p className="text-[13px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user.isBanned ? (
            <Badge
              variant="destructive"
              className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              Bị khóa
            </Badge>
          ) : (
            <Badge
              variant="default"
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            >
              Hoạt động
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <section>
            <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Thông tin chung</h3>
            <div className="bg-white border border-border/50 rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] text-[13px]">
              <div className="flex px-4 py-3 border-b border-border/50 items-center">
                <span className="w-1/3 text-muted-foreground">User ID</span>
                <span
                  className="w-2/3 font-medium text-slate-900 font-mono text-[12px] truncate"
                  title={user.id}
                >
                  {user.id}
                </span>
              </div>
              <div className="flex px-4 py-3 border-b border-border/50 items-center">
                <span className="w-1/3 text-muted-foreground">Tên hiển thị</span>
                <span className="w-2/3 font-medium text-slate-900">{user.name || '—'}</span>
              </div>
              <div className="flex px-4 py-3 border-b border-border/50 items-center">
                <span className="w-1/3 text-muted-foreground">Email</span>
                <span className="w-2/3 font-medium text-slate-900">{user.email}</span>
              </div>
              <div className="flex px-4 py-3 items-center">
                <span className="w-1/3 text-muted-foreground">Ngày đăng ký</span>
                <span className="w-2/3 font-medium text-slate-900">
                  {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
            </div>
          </section>

          {/* Active Sessions */}
          <section>
            <h3 className="text-[14px] font-semibold text-slate-900 mb-3">
              Phiên đăng nhập (Sessions)
            </h3>
            <div className="bg-white border border-border/50 rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              {user.sessions?.length === 0 ? (
                <div className="p-4 text-[13px] text-muted-foreground text-center">
                  Không có phiên đăng nhập nào.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {user.sessions?.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 text-[13px] hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className="font-medium text-slate-900"
                          title={session.deviceInfo || undefined}
                        >
                          {formatDevice(session.deviceInfo)}
                        </span>
                        <span className="text-muted-foreground">
                          {format(new Date(session.lastActiveAt), 'HH:mm dd/MM', { locale: vi })}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                        IP:{' '}
                        <span className="font-mono text-[12px]">
                          {session.ipAddress === '::1' || session.ipAddress === '127.0.0.1'
                            ? 'Localhost'
                            : session.ipAddress}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Danger Zone & Roles */}
        <div className="space-y-6">
          <section>
            <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Vai trò hệ thống</h3>
            <div className="bg-white border border-border/50 rounded-xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] min-h-[100px]">
              {user.userRoles.length === 0 ? (
                <p className="text-[13px] text-muted-foreground text-center mt-3">
                  Không có vai trò đặc biệt.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.userRoles.map((ur, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none font-medium"
                    >
                      {ur.role.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-rose-600 mb-3 flex items-center gap-2">
              Bảo mật tài khoản
            </h3>
            <div className="bg-white border border-rose-200 rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <div className="p-4 border-b border-rose-100 bg-rose-50/20">
                <p className="text-[13px] text-slate-700 mb-4 leading-relaxed">
                  Tạo một mật khẩu ngẫu nhiên mới và gửi thẳng vào email của người dùng. Họ sẽ bị
                  đăng xuất khỏi mọi thiết bị hiện tại.
                </p>
                <Button
                  variant="outline"
                  className="w-full justify-start text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 bg-white"
                  onClick={() => setConfirmResetOpen(true)}
                >
                  <Key className="mr-2 h-4 w-4" /> Reset mật khẩu
                </Button>
              </div>
              <div className="p-4 bg-rose-50/20">
                <p className="text-[13px] text-slate-700 mb-4 leading-relaxed">
                  Đóng băng mọi phiên hoạt động. Người dùng sẽ văng ra khỏi hệ thống ngay lập tức mà
                  không cần đổi mật khẩu.
                </p>
                <Button
                  variant="outline"
                  className="w-full justify-start text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 bg-white"
                  onClick={() => setConfirmKickOpen(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Thu hồi Session
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Exam History - Moved outside the grid for full width */}
      <section className="pt-4">
        <h3 className="text-[14px] font-semibold text-slate-900 mb-3">Lịch sử làm bài</h3>
        <div className="bg-white border border-border/50 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] p-1 overflow-hidden">
          <UserExamHistory userId={user.id} />
        </div>
      </section>

      <ConfirmDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        title="Xác nhận Reset mật khẩu"
        description="Hệ thống sẽ tạo một mật khẩu ngẫu nhiên, gửi email cho người dùng, và đăng xuất họ khỏi tất cả các thiết bị."
        onConfirm={handleResetPassword}
        isLoading={resetting}
        variant="destructive"
      />

      <ConfirmDialog
        open={confirmKickOpen}
        onOpenChange={setConfirmKickOpen}
        title="Thu hồi phiên đăng nhập"
        description="Hành động này sẽ vô hiệu hóa ngay lập tức tất cả các token hiện tại của người dùng. Họ sẽ bị văng ra khỏi hệ thống ngay lập tức."
        onConfirm={handleKickSessions}
        isLoading={kicking}
        variant="destructive"
      />
    </div>
  )
}

export default UserDetailPage
