import { useEffect, useState } from 'react'
import { SearchX, LayoutGrid } from 'lucide-react'
import { getPublishedExamsApi } from '@/services/clientExamService'
import { toast } from 'sonner'

import { ExamsHeader } from './components/ExamsHeader'
import { ExamsFilter } from './components/ExamsFilter'
import { ExamCard } from './components/ExamCard'
import { ExamsPagination } from './components/ExamsPagination'
import type { ClientExam } from '@/types/exam.type'

function ExamsPage() {
  const [exams, setExams] = useState<ClientExam[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filters state
  const [search, setSearch] = useState('')
  const [part, setPart] = useState('ALL')
  const [difficulty, setDifficulty] = useState('ALL')

  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchExams = async () => {
    setIsLoading(true)
    try {
      const params: any = { page, limit: 12 }
      if (search) params.search = search
      if (part !== 'ALL') params.part = part
      if (difficulty !== 'ALL') params.difficulty = difficulty

      const res = (await getPublishedExamsApi(params)) as any

      const data = res.data?.data || []
      const meta = res.data?.meta || {}

      setExams(data)
      setTotalPages(meta.totalPages || 1)
      setTotal(meta.total || 0)
    } catch (error) {
      toast.error('Không thể tải danh sách đề thi. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, part, difficulty, search]) // search added so it auto-fetches

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [search, part, difficulty])

  // Keep for compatibility if child components still call it explicitly
  const handleFilter = () => {
    setPage(1)
    fetchExams()
  }

  return (
    <div className="py-10 bg-white min-h-[calc(100vh-64px)] selection:bg-blue-100 selection:text-blue-900">
      <div className="container mx-auto px-4 max-w-[1200px]">
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
            <LayoutGrid className="w-4 h-4" />
            <span>
              Tìm thấy <strong className="text-slate-900">{total}</strong> đề thi phù hợp
            </span>
          </div>
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[380px] bg-slate-50/50 rounded-xl animate-pulse border border-slate-100"
              ></div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
              <SearchX className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-slate-500 max-w-sm text-center">
              Rất tiếc, chúng tôi không tìm thấy đề thi nào phù hợp với tiêu chí của bạn. Vui lòng
              thử lại với từ khóa khác.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && exams.length > 0 && (
          <div className="mt-12">
            <ExamsPagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ExamsPage
