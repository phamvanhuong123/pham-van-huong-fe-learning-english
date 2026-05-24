import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Clock, BarChart, BookOpen, ChevronLeft, Play, ShieldAlert, Award } from 'lucide-react';
import { getExamDetailsForClientApi } from '@/services/clientExamService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { ClientExamData } from '@/types/clientExam.type';

function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ClientExamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate('/exams')}
          className="flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Quay lại danh sách
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 md:p-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Award className="w-48 h-48" />
            </div>

            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="flex gap-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase backdrop-blur-sm">
                  {exam.part === 'FULL' ? 'FULL TEST' : exam.part.replace('PART', 'PART ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase backdrop-blur-sm
                  ${exam.difficulty === 'EASY' ? 'bg-green-500/20 text-green-100' :
                    exam.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-100' :
                      'bg-red-500/20 text-red-100'}`}
                >
                  {exam.difficulty}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{exam.title}</h1>
              <p className="text-blue-100 text-lg">{exam.description || 'Bài thi đánh giá năng lực theo cấu trúc TOEIC chuẩn. Phù hợp để kiểm tra trình độ hiện tại của bạn.'}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 flex flex-col items-center justify-center text-center">
                <Clock className="w-8 h-8 text-blue-500 mb-3" />
                <p className="text-sm text-gray-500 font-medium mb-1">Thời gian làm bài</p>
                <p className="text-2xl font-bold text-gray-900">{exam.duration} phút</p>
              </div>

              <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100/50 flex flex-col items-center justify-center text-center">
                <BookOpen className="w-8 h-8 text-orange-500 mb-3" />
                <p className="text-sm text-gray-500 font-medium mb-1">Tổng số câu hỏi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.questions} câu</p>
              </div>

              <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100/50 flex flex-col items-center justify-center text-center">
                <BarChart className="w-8 h-8 text-purple-500 mb-3" />
                <p className="text-sm text-gray-500 font-medium mb-1">Đoạn văn / Audio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.passages}</p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-10 flex gap-4 items-start">
              <ShieldAlert className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-bold mb-1">Lưu ý trước khi làm bài:</h4>
                <ul className="text-yellow-700/80 text-sm space-y-1.5 list-disc pl-4">
                  <li>Hệ thống sẽ tự động bắt đầu đếm ngược thời gian ngay khi bạn bấm nút.</li>
                  <li>Nếu rớt mạng, tiến trình sẽ được lưu tạm và tự động đồng bộ khi có mạng lại.</li>
                  <li><strong>Tuyệt đối không chuyển Tab</strong> hay rời khỏi màn hình trong quá trình làm bài. Hệ thống sẽ ghi nhận và đánh dấu gian lận.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => navigate(`/exams/${exam.id}/take`)}
                className="h-16 px-12 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg hover:shadow-blue-600/25 transition-all hover:-translate-y-1"
              >
                <Play className="w-6 h-6 mr-2 fill-current" />
                Bắt Đầu Làm Bài
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamDetailPage;
