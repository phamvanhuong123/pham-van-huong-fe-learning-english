import { Routes, Route } from 'react-router'
import ClientRoute from './ClientRoute'
import AuthRoute from './AuthRoute'
import DashboardRoute from './DashboardRoute'
import NotFoundPage from '@/pages/NotFoundPage'
import ForbiddenPage from '@/pages/ForbiddenPage'

function AllRoutes() {
  return (
    <Routes>
      {ClientRoute()}
      {AuthRoute()}
      {DashboardRoute()}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AllRoutes
