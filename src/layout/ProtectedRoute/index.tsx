import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';
import { usePermission } from '@/hooks/usePermission';

interface ProtectedRouteProps {
  requiredRole?: 'STANDARD' | 'VIP' | 'ADMIN' | 'superAdmin';
  requiredPermissions?: string[];
}

function ProtectedRoute({ requiredRole, requiredPermissions }: ProtectedRouteProps) {
  const { userInfo } = useAuthStore();
  const { hasAnyPermission } = usePermission();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Keep legacy role check for now if it's used
  if (requiredRole && userInfo.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to="/admin" replace />; // Redirect to dashboard or 403
  }

  return <Outlet />;
}

export default ProtectedRoute;
