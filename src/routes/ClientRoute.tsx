import { Route } from 'react-router';
import ClientLayout from '@/layout/ClientLayout';
import HomePage from '@/pages/HomePage';
import ExamsPage from '@/pages/ExamsPage';
import VocabPage from '@/pages/VocabPage';
import GrammarPage from '@/pages/GrammarPage';
import HistoryPage from '@/pages/HistoryPage';
import ExamDetailPage from '@/pages/ExamDetailPage';
import { ClientExamWorkspacePage } from '@/pages/ClientExamWorkspacePage';

function ClientRoute() {
  return (
    <>
      <Route element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="exams/:id" element={<ExamDetailPage />} />
        <Route path="vocab" element={<VocabPage />} />
        <Route path="grammar" element={<GrammarPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
      <Route path="exams/:id/take" element={<ClientExamWorkspacePage />} />
    </>
  );
}

export default ClientRoute;
