import { Route } from 'react-router';
import ClientLayout from '@/layout/ClientLayout';
import ProtectedRoute from '@/layout/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import ExamsPage from '@/pages/ExamsPage';
import VocabPage from '@/pages/VocabPage';
import GrammarPage from '@/pages/GrammarPage';
import GrammarPracticePage from '@/pages/GrammarPracticePage';
import HistoryPage from '@/pages/HistoryPage';
import ExamDetailPage from '@/pages/ExamDetailPage';
import { ClientExamWorkspacePage } from '@/pages/ClientExamWorkspacePage';
import ScoreReportPage from '@/pages/ScoreReportPage';
import ReviewModePage from '@/pages/ReviewModePage';
import UpgradeVipPage from '@/pages/UpgradeVipPage';
import ProfilePage from '@/pages/ProfilePage';

function ClientRoute() {
  return (
    <>
      <Route element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="exams/:id" element={<ExamDetailPage />} />
        <Route path="vocab" element={<VocabPage />} />
        <Route path="grammar" element={<GrammarPage />} />
        <Route path="grammar/:slug/practice" element={<GrammarPracticePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="pricing" element={<UpgradeVipPage />} />
          <Route path="results/:resultId" element={<ScoreReportPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="exams/:id/take" element={<ClientExamWorkspacePage />} />
        <Route path="results/:resultId/review" element={<ReviewModePage />} />
      </Route>
    </>
  );
}

export default ClientRoute;
