import { Routes, Route } from 'react-router';
import ClientRoute from './ClientRoute';
import AuthRoute from './AuthRoute';
import DashboardRoute from './DashboardRoute';
import NotFoundPage from '@/pages/NotFoundPage';

function AllRoutes() {
  return (
    <Routes>
      {ClientRoute()}
      {AuthRoute()}
      {DashboardRoute()}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AllRoutes;
