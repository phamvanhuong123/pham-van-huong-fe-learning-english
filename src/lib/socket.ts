import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { handleLogoutApi } from '../services/authServices'

let socket: Socket | null = null

const SOCKET_URL = import.meta.env.VITE_API_ROOT
  ? import.meta.env.VITE_API_ROOT.replace('/api/v1', '')
  : 'http://localhost:5000'

export const connectSocket = (token: string) => {
  if (socket) return

  socket = io(SOCKET_URL, {
    withCredentials: true,
  })

  socket.on('connect', () => {
    socket?.emit('authenticate', { token })
  })

  socket.on('authenticated', () => {
    console.log('Socket authenticated')
  })

  socket.on('unauthorized', (data: { message: string }) => {
    console.error('Socket unauthorized:', data.message)
    disconnectSocket()
  })

  // Handle global notifications
  socket.on('new_notification', (data: any) => {
    toast.info(` ${data.title}`, {
      description: data.body,
      duration: 5000,
    })

    // Invalidate queries để NotificationBell tải lại ngay lập tức
    import('../main').then((module) => {
      module.queryClient.invalidateQueries({ queryKey: ['notifications'] })
    })
  })

  // You can listen to other global events here if needed,
  // e.g., session kicked, account banned
  socket.on('session_kicked', () => {
    toast.error('Phiên đăng nhập của bạn đã bị ngắt bởi Quản trị viên')
    handleLogoutApi().then(() => {
      window.location.href = '/login'
    })
  })

  socket.on('account_banned', () => {
    toast.error('Tài khoản của bạn đã bị khóa')
    handleLogoutApi().then(() => {
      window.location.href = '/login'
    })
  })

  // Handle real-time VIP status update
  socket.on('vip_status_updated', (data: { isVip: boolean }) => {
    import('../store/useAuthStore').then((module) => {
      module.useAuthStore.getState().updateUserInfo({ isVip: data.isVip })
    })
  })
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
