import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { toast } from 'sonner'

export const useUsers = (filters: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}) => {
  return useQuery({
    queryKey: ['adminUsers', filters],
    queryFn: () => adminService.getUsers(filters),
  })
}

export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: ['adminUser', id],
    queryFn: () => adminService.getUserById(id),
    enabled: !!id,
  })
}

export const useBanUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isBanned, reason }: { id: string; isBanned: boolean; reason?: string }) =>
      adminService.banUser(id, isBanned, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      queryClient.invalidateQueries({ queryKey: ['adminUser', variables.id] })
      toast.success(
        variables.isBanned ? 'Đã khóa tài khoản thành công' : 'Đã mở khóa tài khoản thành công'
      )
    },
    onError: (error: any) => {
      // Error is handled globally by axios interceptor usually, but can add specifics here
      console.error(error)
    },
  })
}

export const useAssignRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminService.updateUserRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      queryClient.invalidateQueries({ queryKey: ['adminUser', variables.id] })
      toast.success('Đã phân quyền thành công')
    },
  })
}

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: (id: string) => adminService.resetUserPassword(id),
    onSuccess: () => {
      toast.success('Đã gửi email reset mật khẩu cho người dùng')
    },
  })
}

export const useKickUserSessions = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.kickUserSessions(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['adminUser', id] })
      toast.success('Đã kick toàn bộ phiên đăng nhập của người dùng')
    },
  })
}
