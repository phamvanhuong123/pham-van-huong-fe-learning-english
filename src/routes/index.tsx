import { Routes } from 'react-router';
import ClientRoute from './ClientRoute';
import AuthRoute from './AuthRoute';
import DashboardRoute from './DashboardRoute';

function AllRoutes() {
  return (
    <Routes>
      {ClientRoute()}
      {AuthRoute()}
      {DashboardRoute()}
    </Routes>
  );
}

export default AllRoutes;
