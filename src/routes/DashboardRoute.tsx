import { Route, Navigate } from 'react-router';
import ProtectedRoute from '@/layout/ProtectedRoute';
import DashboardLayout from '@/layout/DasboardLayout';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import UserManagerPage from '@/pages/UserManagerPage';
import RoleManagerPage from '@/pages/RoleManagerPage';
import SubscriptionManagerPage from '@/pages/SubscriptionManagerPage';
import QuestionBankPage from '@/pages/QuestionBankPage';
import ExamManagementPage from '@/pages/ExamManagementPage';
import AdminNotificationsPage from '@/pages/AdminNotificationsPage';
import TrashManagerPage from '@/pages/TrashManagerPage';
import AdminVocabPage from '@/pages/AdminVocabPage';
import AdminGrammarPage from '@/pages/AdminGrammarPage';

function DashboardRoute() {
  return (
    <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN" />}>
      {/* Layer 2: Layout — sidebar + main content */}
      <Route element={<DashboardLayout />}>
        {/* Redirect /admin → /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagerPage />} />
        <Route path="roles" element={<RoleManagerPage />} />
        <Route path="subscriptions" element={<SubscriptionManagerPage />} />
        <Route path="questions" element={<QuestionBankPage />} />
        <Route path="exams" element={<ExamManagementPage />} />
        <Route path="vocab" element={<AdminVocabPage />} />
        <Route path="grammar" element={<AdminGrammarPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="trash" element={<TrashManagerPage />} />
      </Route>
    </Route>
  );
}

export default DashboardRoute;
