import { useAuthStore } from '@/store/useAuthStore'

export const usePermission = () => {
  const { userInfo } = useAuthStore()

  const hasPermission = (requiredPermission: string) => {
    if (!userInfo) return false
    // SuperAdmin bypasses all permission checks
    if (userInfo.isSuperAdmin) return true

    const allowedPermissions = userInfo.permissions || []
    return allowedPermissions.includes(requiredPermission)
  }

  const hasAnyPermission = (requiredPermissions: string[]) => {
    if (!userInfo) return false
    if (userInfo.isSuperAdmin) return true

    const allowedPermissions = userInfo.permissions || []
    return requiredPermissions.some((p) => allowedPermissions.includes(p))
  }

  return { hasPermission, hasAnyPermission }
}
