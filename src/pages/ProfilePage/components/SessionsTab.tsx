import { useEffect, useState } from 'react'
import { Loader2, Monitor, Smartphone, LogOut, ShieldAlert } from 'lucide-react'
import {
  getSessionsApi,
  revokeAllOtherSessionsApi,
  revokeSessionApi,
} from '@/services/sessionService'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { UAParser } from 'ua-parser-js'

export default function SessionsTab() {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<any[]>([])
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  const fetchSessions = async () => {
    try {
      const res = await getSessionsApi()
      setSessions(res.data.data)
    } catch (error) {
      toast.error('Không thể tải danh sách thiết bị')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleRevokeOne = async (id: string) => {
    setRevokingId(id)
    try {
      await revokeSessionApi(id)
      toast.success('Đã đăng xuất thiết bị')
      setSessions(sessions.filter((s) => s.id !== id))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setRevokingId(null)
    }
  }

  const handleRevokeAll = async () => {
    setRevokingAll(true)
    try {
      const res = await revokeAllOtherSessionsApi()
      toast.success(res.data?.message || 'Đã đăng xuất tất cả thiết bị khác')
      setSessions(sessions.filter((s) => s.isCurrent))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setRevokingAll(false)
    }
  }

  const isMobile = (deviceInfo?: string) => {
    if (!deviceInfo) return false
    const lower = deviceInfo.toLowerCase()
    return lower.includes('mobi') || lower.includes('android') || lower.includes('iphone')
  }

  const parseDevice = (deviceInfo?: string) => {
    if (!deviceInfo) return 'Thiết bị không rõ'

    const parser = new UAParser(deviceInfo)
    const result = parser.getResult()
    const browserName = result.browser.name
    const osName = result.os.name

    if (browserName && osName) {
      return `${browserName} trên ${osName}`
    } else if (browserName) {
      return browserName
    } else if (osName) {
      return osName
    }

    // Fallback if parsing fails
    const match = deviceInfo.match(/^([^\(]+)/)
    if (match) return match[1].trim()
    return deviceInfo.substring(0, 30)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const otherSessions = sessions.filter((s) => !s.isCurrent)

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Quản lý thiết bị</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Các thiết bị hiện đang đăng nhập vào tài khoản của bạn
          </p>
        </div>
        {otherSessions.length > 0 && (
          <Button
            variant="outline"
            onClick={handleRevokeAll}
            disabled={revokingAll}
            className="whitespace-nowrap transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
          >
            {revokingAll ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldAlert className="mr-2 h-4 w-4" />
            )}
            Đăng xuất tất cả nơi khác
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const mobile = isMobile(session.deviceInfo)
          const DeviceIcon = mobile ? Smartphone : Monitor

          return (
            <div
              key={session.id}
              className="flex items-start sm:items-center justify-between p-4 rounded-xl border bg-card transition-colors hover:bg-muted/30"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm sm:text-base">
                      {parseDevice(session.deviceInfo)}
                    </h4>
                    {session.isCurrent && (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs font-medium border-0"
                      >
                        Thiết bị này
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="hidden sm:inline text-border">•</span>
                    <span>
                      Hoạt động:{' '}
                      {formatDistanceToNow(new Date(session.lastActiveAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8 p-0 sm:w-auto sm:px-3 sm:py-2 sm:rounded-md"
                  disabled={revokingId === session.id}
                  onClick={() => handleRevokeOne(session.id)}
                  title="Đăng xuất thiết bị này"
                >
                  {revokingId === session.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Đăng xuất</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
