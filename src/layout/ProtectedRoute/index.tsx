import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { usePermission } from '@/hooks/usePermission';

interface ProtectedRouteProps {
  requiredRole?: 'STANDARD' | 'VIP' | 'ADMIN' | 'superAdmin';
  requiredPermissions?: string[];
  requireAdminAccess?: boolean;
}

function ProtectedRoute({ requiredRole, requiredPermissions, requireAdminAccess }: ProtectedRouteProps) {
  const { userInfo } = useAuthStore();
  const { hasAnyPermission } = usePermission();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Keep legacy role check for now if it's used
  if (requiredRole && userInfo.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Chặn người dùng thường vào Admin Panel (Phải là SuperAdmin hoặc có ít nhất 1 permission)
  if (requireAdminAccess) {
    const hasAdminAccess = userInfo.isSuperAdmin || (userInfo.permissions && userInfo.permissions.length > 0);
    if (!hasAdminAccess) {
      return <Navigate to="/403" replace />;
    }
  }

  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to="/403" replace />; 
  }

  return <Outlet />;
}

export default ProtectedRoute;
