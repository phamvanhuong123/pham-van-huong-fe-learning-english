import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Clock, BarChart, BookOpen, ChevronLeft, Play, ShieldAlert, RotateCcw } from 'lucide-react';
import { getExamDetailsForClientApi } from '@/services/clientExamService';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';
import type { ClientExamData } from '@/types/clientExam.type';
import { useClientExamStore } from '@/store/useClientExamStore';

function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ClientExamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy trạng thái từ store để kiểm tra xem có bài làm dở không
  const activeExamId = useClientExamStore((state) => state.examId);
  const activeStatus = useClientExamStore((state) => state.status);
  const clearExam = useClientExamStore((state) => state.clearExam);

  const hasActiveSession = activeExamId === id && activeStatus === 'IN_PROGRESS';

  useEffect(() => {
    if (!id) return;
    const fetchExamDetails = async () => {
      try {
        setIsLoading(true);
        const res = await getExamDetailsForClientApi(id);
        setExam(res.data.data);
      } catch (error) {
        toast.error('Không tìm thấy đề thi hoặc có lỗi xảy ra.');
        navigate('/exams');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExamDetails();
  }, [id, navigate]);

  // Tính toán số lượng câu hỏi và đoạn văn
  const stats = useMemo(() => {
    if (!exam) return { passages: 0, questions: 0 };
    let passageCount = 0;
    let questionCount = 0;

    if (exam.passageGroups) {
      passageCount += exam.passageGroups.length;
      exam.passageGroups.forEach(pg => {
        questionCount += pg.questions.length;
      });
    }
    if (exam.questions) {
      questionCount += exam.questions.length;
    }

    return { passages: passageCount, questions: questionCount };
  }, [exam]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!exam) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/exams')}
          className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Quay lại danh sách
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">

          {/* Cột trái: Thông tin chính & Lưu ý */}
          <div className="flex-1 p-6 md:p-8 flex flex-col">
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase">
                {exam.part === 'FULL' ? 'FULL TEST' : exam.part.replace('PART', 'PART ')}
              </span>
              <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase border
                ${exam.difficulty === 'EASY' ? 'bg-green-50 border-green-100 text-green-600' :
                  exam.difficulty === 'MEDIUM' ? 'bg-yellow-50 border-yellow-100 text-yellow-600' :
                    'bg-red-50 border-red-100 text-red-600'}`}
              >
                {exam.difficulty}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-3">{exam.title}</h1>
            <p className="text-gray-500 text-base mb-8 flex-1">{exam.description || 'Bài thi đánh giá năng lực theo cấu trúc TOEIC chuẩn. Phù hợp để kiểm tra trình độ hiện tại của bạn.'}</p>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mt-auto flex gap-3 items-start">
              <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-bold mb-1 text-sm">Lưu ý trước khi làm bài:</h4>
                <ul className="text-yellow-700/80 text-xs space-y-1 list-disc pl-4">
                  <li>Hệ thống tự bắt đầu đếm ngược thời gian khi bấm nút.</li>
                  <li>Tiến trình sẽ được lưu tạm khi rớt mạng.</li>
                  <li><strong>Tuyệt đối không chuyển Tab</strong> hay rời màn hình. Hệ thống sẽ ghi nhận gian lận.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cột phải: Thống kê & Nút chức năng */}
          <div className="w-full md:w-80 p-6 md:p-8 bg-gray-50/50 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
            <div className="space-y-3 mb-8">
              <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-md"><Clock className="w-5 h-5 text-blue-500" /></div>
                  <span className="text-sm font-medium text-gray-600">Thời gian</span>
                </div>
                <span className="font-bold text-gray-900">{exam.duration} phút</span>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-2 rounded-md"><BookOpen className="w-5 h-5 text-orange-500" /></div>
                  <span className="text-sm font-medium text-gray-600">Số câu hỏi</span>
                </div>
                <span className="font-bold text-gray-900">{stats.questions}</span>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-md"><BarChart className="w-5 h-5 text-purple-500" /></div>
                  <span className="text-sm font-medium text-gray-600">Đoạn văn</span>
                </div>
                <span className="font-bold text-gray-900">{stats.passages}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {hasActiveSession ? (
                <>
                  <Button
                    onClick={() => navigate(`/exams/${exam.id}/take`)}
                    className="w-full h-12 font-bold bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-all"
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Tiếp Tục Bài Đang Làm
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const isConfirm = window.confirm("Bắt đầu bài thi mới sẽ xoá toàn bộ tiến trình làm bài hiện tại. Bạn có chắc chắn?");
                      if (isConfirm) {
                        clearExam();
                        navigate(`/exams/${exam.id}/take`);
                      }
                    }}
                    className="w-full h-12 font-bold border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-md transition-all"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Bắt Đầu Lại Từ Đầu
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    clearExam();
                    navigate(`/exams/${exam.id}/take`);
                  }}
                  className="w-full h-12 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-all"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Bắt Đầu Làm Bài
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamDetailPage;
