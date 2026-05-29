import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { getResultDetailApi } from '@/services/resultService';
import { useResultStore } from '@/store/useResultStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Target, AlertTriangle } from 'lucide-react';
import { ScoreCircle } from './components/ScoreCircle';
import { PartBreakdownChart } from './components/PartBreakdownChart';

function ScoreReportPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { currentResult, setCurrentResult, isLoadingResult, setLoadingResult } = useResultStore();

  useEffect(() => {
    if (!resultId) return;

    const fetchResult = async () => {
      try {
        setLoadingResult(true);
        const res = await getResultDetailApi(resultId);
        setCurrentResult(res.data.data);
      } catch (error) {
        toast.error('Không thể tải kết quả thi');
        navigate('/history');
      } finally {
        setLoadingResult(false);
      }
    };

    fetchResult();
  }, [resultId, setCurrentResult, setLoadingResult, navigate]);

  if (isLoadingResult || !currentResult) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const {
    exam,
    score,
    listeningScore,
    readingScore,
    correctQ,
    totalQ,
    timeTaken,
    isFullTest,
    partBreakdown,
    weakPoints,
    tabSwitchCount,
    listeningCorrect,
    readingCorrect
  } = currentResult;

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeString = `${minutes}p ${seconds}s`;

  return (
    <div className="py-8 bg-gray-50/50 min-h-[calc(100vh-64px)] font-sans">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/history')} className="text-gray-600 hover:text-gray-900 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về lịch sử
          </Button>
          <Button onClick={() => navigate(`/results/${resultId}/review`)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <BookOpen className="w-4 h-4 mr-2" />
            Xem lại bài làm
          </Button>
        </div>

        {/* Exam Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam?.title || 'Đề thi TOEIC'}</h1>
          <div className="text-gray-500 flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {timeString}</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {correctQ}/{totalQ} câu đúng</span>
            {tabSwitchCount > 0 && (
              <span className="flex items-center gap-1 text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                <AlertTriangle className="w-4 h-4" /> Vi phạm tab {tabSwitchCount} lần
              </span>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Overall Score */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-gray-100 shadow-sm bg-white overflow-hidden relative pt-6">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tổng Điểm</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-8">
                <ScoreCircle score={score} maxScore={isFullTest ? 990 : totalQ * 5} isFullTest={isFullTest} />

                {isFullTest && (
                  <div className="w-full flex justify-between mt-8 px-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Listening</p>
                      <p className="text-2xl font-bold text-blue-600">{listeningScore || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">{listeningCorrect || 0}/100 đúng</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Reading</p>
                      <p className="text-2xl font-bold text-indigo-600">{readingScore || 0}</p>
                      <p className="text-xs text-gray-500 mt-1">{readingCorrect || 0}/100 đúng</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {weakPoints && weakPoints.length > 0 && (
              <Card className="border-orange-100 shadow-sm bg-orange-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-orange-700 text-base">
                    <AlertTriangle className="w-5 h-5" />
                    Cần Cải Thiện
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-800 mb-3">Tỷ lệ đúng của bạn dưới 70% ở các phần sau:</p>
                  <div className="flex flex-wrap gap-2">
                    {weakPoints.map(wp => (
                      <span key={wp} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">
                        {wp.replace('PART', 'Part ')}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Part Breakdown */}
          <div className="lg:col-span-2">
            <Card className="border-gray-100 shadow-sm bg-white h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Target className="w-5 h-5 text-blue-500" />
                  Phân Tích Chi Tiết
                </CardTitle>
              </CardHeader>
              <CardContent>
                {partBreakdown && Object.keys(partBreakdown).length > 0 ? (
                  <PartBreakdownChart breakdown={partBreakdown} />
                ) : (
                  <div className="text-center py-10 text-gray-400">Không có dữ liệu phân tích chi tiết.</div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ScoreReportPage;
