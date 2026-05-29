import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getReviewDetailsApi } from '@/services/resultService';
import { useResultStore } from '@/store/useResultStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ReviewQuestionList } from './components/ReviewQuestionList';
import { ReviewQuestionPalette } from './components/ReviewQuestionPalette';
import { ExamToolbar } from '@/pages/ClientExamWorkspacePage/components/ExamToolbar';

function ReviewModePage() {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { currentReview, setCurrentReview, isLoadingReview, setLoadingReview } = useResultStore();
  const [activePart, setActivePart] = useState<string>('');

  useEffect(() => {
    if (!resultId) return;

    const fetchReview = async () => {
      try {
        setLoadingReview(true);
        const res = await getReviewDetailsApi(resultId);
        setCurrentReview(res.data.data);
      } catch (error) {
        toast.error('Không thể tải dữ liệu xem lại');
        navigate(-1);
      } finally {
        setLoadingReview(false);
      }
    };

    fetchReview();
  }, [resultId, setCurrentReview, setLoadingReview, navigate]);

  const allQuestions = useMemo(() => {
    if (!currentReview) return [];
    const fromPassages = currentReview.passageGroups.flatMap(pg => pg.questions);
    const qs = [...fromPassages, ...currentReview.questions];
    return qs.sort((a, b) => a.order - b.order);
  }, [currentReview]);

  const groupedData = useMemo(() => {
    if (!currentReview) return null;
    const groups: Record<string, { passageGroups: typeof currentReview.passageGroups, questions: typeof currentReview.questions }> = {};

    currentReview.passageGroups.forEach(pg => {
      const part = pg.part || 'OTHER';
      if (!groups[part]) groups[part] = { passageGroups: [], questions: [] };
      groups[part].passageGroups.push(pg);
    });

    currentReview.questions.forEach(q => {
      const part = q.part || 'OTHER';
      if (!groups[part]) groups[part] = { passageGroups: [], questions: [] };
      groups[part].questions.push(q);
    });

    return groups;
  }, [currentReview]);

  const availableParts = useMemo(() => {
    if (!groupedData) return [];
    return Object.keys(groupedData).sort();
  }, [groupedData]);

  useEffect(() => {
    if (availableParts.length > 0 && !activePart) {
      setActivePart(availableParts[0]);
    }
  }, [availableParts, activePart]);

  if (isLoadingReview || !currentReview) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { title, resultSummary } = currentReview;

  const currentPassageGroups = groupedData?.[activePart]?.passageGroups || [];
  const currentQuestions = groupedData?.[activePart]?.questions || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-50 sticky top-0 shrink-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/results/${resultId}`)}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-gray-900 leading-tight">{title}</h1>
              <p className="text-xs text-gray-500 font-medium">Chế độ xem lại</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="text-center px-4 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
              <span className="block text-xs uppercase text-blue-500 font-bold">Số câu đúng</span>
              {resultSummary.correctQ} / {resultSummary.totalQ}
            </div>
            {resultSummary.isFullTest && (
              <div className="text-center px-4 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                <span className="block text-xs uppercase text-indigo-500 font-bold">Tổng điểm</span>
                {resultSummary.score}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toolbar for Parts (if Full Test or multiple parts) */}
      {availableParts.length > 1 && (
        <ExamToolbar
          parts={availableParts}
          activePart={activePart}
          onPartClick={(p) => setActivePart(p)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex gap-6 items-start relative">

        {/* Left: Questions & Passages */}
        <div className="flex-1 min-w-0">
          <ReviewQuestionList passageGroups={currentPassageGroups} standaloneQuestions={currentQuestions} />
        </div>

        {/* Right: Navigation Palette */}
        <div className="w-80 shrink-0 hidden lg:block sticky top-[100px]">
          <ReviewQuestionPalette 
            questions={allQuestions} 
            activePart={activePart}
            onNavigateToPart={(p) => setActivePart(p)}
          />
        </div>

      </main>
    </div>
  );
}

export default ReviewModePage;
