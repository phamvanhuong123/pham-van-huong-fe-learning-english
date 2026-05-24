import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { getPublishedExamsApi } from '@/services/clientExamService';
import { toast } from 'sonner';

import { ExamsHeader } from './components/ExamsHeader';
import { ExamsFilter } from './components/ExamsFilter';
import { ExamCard, type Exam } from './components/ExamCard';
import { ExamsPagination } from './components/ExamsPagination';

function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [part, setPart] = useState('ALL');
  const [difficulty, setDifficulty] = useState('ALL');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit: 12 };
      if (search) params.search = search;
      if (part !== 'ALL') params.part = part;
      if (difficulty !== 'ALL') params.difficulty = difficulty;

      const res = await getPublishedExamsApi(params);
      const data = res.data.data;
      const meta = res.data.meta;

      setExams(data);
      setTotalPages(meta.totalPages || 1);
      setTotal(meta.total || 0);
    } catch (error) {
      toast.error('Không thể tải danh sách đề thi. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, part, difficulty]);

  const handleFilter = () => {
    setPage(1);
    fetchExams();
  };

  return (
    <div className="py-12 bg-gray-50/50 min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 max-w-6xl">
        <ExamsHeader />

        <ExamsFilter
          search={search}
          setSearch={setSearch}
          part={part}
          setPart={setPart}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onFilter={handleFilter}
        />

        {/* Status Bar */}
        <div className="mb-6 flex justify-between items-center text-sm text-gray-500 font-medium px-2">
          <span>Tìm thấy <strong className="text-blue-600">{total}</strong> đề thi</span>
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Không tìm thấy đề thi</h3>
            <p className="text-gray-500 mt-1">Vui lòng thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && (
          <ExamsPagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
      </div>
    </div>
  );
}

export default ExamsPage;
