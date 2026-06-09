import { Route, Navigate } from 'react-router'
import ProtectedRoute from '@/layout/ProtectedRoute'
import DashboardLayout from '@/layout/DasboardLayout'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import UserManagerPage from '@/pages/UserManagerPage'
import RoleManagerPage from '@/pages/RoleManagerPage'
import SubscriptionManagerPage from '@/pages/SubscriptionManagerPage'
import QuestionBankPage from '@/pages/QuestionBankPage'
import ExamManagementPage from '@/pages/ExamManagementPage'
import AdminNotificationsPage from '@/pages/AdminNotificationsPage'
import TrashManagerPage from '@/pages/TrashManagerPage'
import AdminVocabPage from '@/pages/AdminVocabPage'
import AdminGrammarPage from '@/pages/AdminGrammarPage'
import AdminGrammarDetailPage from '@/pages/AdminGrammarDetailPage'
import UserDetailPage from '@/pages/UserDetailPage'
import AdminResultDetailPage from '@/pages/AdminResultDetailPage'
import AdminLogsPage from '@/pages/AdminLogsPage'
import { PERMISSIONS } from '@/config/rbacConfig'

function DashboardRoute() {
  return (
    // Instead of requiredRole="superAdmin", we check for basic admin access (or we can just let any logged-in user in, but they need some permissions)
    // Actually, if we remove requiredRole="superAdmin", any user can access /admin but the inner routes will block them.
    // However, to keep it simple, let's keep the outer route protected for ADMIN or SUPERADMIN, or just use ProtectedRoute.
    <Route path="/admin" element={<ProtectedRoute requireAdminAccess={true} />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />

        <Route element={<ProtectedRoute requiredPermissions={[PERMISSIONS.USER_MANAGE]} />}>
          <Route path="users" element={<UserManagerPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="results/:id" element={<AdminResultDetailPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[PERMISSIONS.ROLE_MANAGE]} />}>
          <Route path="roles" element={<RoleManagerPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[PERMISSIONS.SUBSCRIPTION_MANAGE]} />}>
          <Route path="subscriptions" element={<SubscriptionManagerPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[PERMISSIONS.QUESTION_MANAGE]} />}>
          <Route path="questions" element={<QuestionBankPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[PERMISSIONS.EXAM_MANAGE]} />}>
          <Route path="exams" element={<ExamManagementPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[PERMISSIONS.VOCAB_MANAGE]} />}>
          <Route path="vocab" element={<AdminVocabPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[PERMISSIONS.GRAMMAR_MANAGE]} />}>
          <Route path="grammar" element={<AdminGrammarPage />} />
          <Route path="grammar/:topicId" element={<AdminGrammarDetailPage />} />
        </Route>

        {/* Notifications and Trash could require specific permissions, but for now we can group them under SYSTEM or SUPERADMIN */}
        {/* If superAdmin bypasses everything, we can just require a dummy permission or leave it open, but let's restrict it */}
        <Route element={<ProtectedRoute requiredPermissions={[PERMISSIONS.ROLE_MANAGE]} />}>
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="trash" element={<TrashManagerPage />} />
        </Route>
      </Route>
    </Route>
  )
}

export default DashboardRoute
