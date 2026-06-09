import authorizedAxiosInstance from '@/utils/authorizeAxios'

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  isRead: boolean
  type: string
  createdAt: string
}

export interface NotificationResponse {
  data: Notification[]
  meta: {
    total: number
    unreadCount: number
    page: number
    limit: number
    totalPages: number
  }
}

export const notificationService = {
  getMyNotifications: async (page = 1, limit = 10): Promise<NotificationResponse> => {
    const res = await authorizedAxiosInstance.get(
      `/notifications/my-notifications?page=${page}&limit=${limit}`
    )
    return res.data
  },

  markAsRead: async (id: string): Promise<void> => {
    await authorizedAxiosInstance.patch(`/notifications/${id}/read`)
  },

  markAllAsRead: async (): Promise<void> => {
    await authorizedAxiosInstance.patch('/notifications/mark-all-read')
  },
}
