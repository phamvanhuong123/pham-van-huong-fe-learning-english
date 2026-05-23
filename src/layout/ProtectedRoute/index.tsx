import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  requiredRole?: 'STANDARD' | 'VIP' | 'ADMIN' | 'superAdmin';
}

function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { userInfo } = useAuthStore();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userInfo.role !== requiredRole) {
    return <Navigate to="/" replace />; // Hoặc trang báo lỗi 403
  }

  return <Outlet />;
}

export default ProtectedRoute;
