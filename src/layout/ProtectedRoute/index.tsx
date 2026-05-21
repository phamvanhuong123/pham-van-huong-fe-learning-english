import { Outlet } from 'react-router';

interface ProtectedRouteProps {
  requiredRole?: 'STANDARD' | 'VIP' | 'ADMIN';
}

function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  return <Outlet />;
}

export default ProtectedRoute;
