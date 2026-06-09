import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { getResultHistoryApi } from '@/services/resultService'
import { useResultStore } from '@/store/useResultStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { History, ArrowRight } from 'lucide-react'

function HistoryPage() {
  const navigate = useNavigate()
  const { history, setHistory, isLoadingHistory, setLoadingHistory } = useResultStore()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true)
        const res = await getResultHistoryApi({ page, limit: 10 })
        setHistory(res.data.data.data)
        setTotalPages(res.data.data.meta.totalPages || 1)
      } catch (error) {
        toast.error('Không thể tải lịch sử làm bài')
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [page, setHistory, setLoadingHistory])

  return (
    <div className="py-12 bg-gray-50/50 min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <History className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lịch Sử Thi</h1>
            <p className="text-gray-500 mt-1">Xem lại kết quả các bài thi bạn đã hoàn thành.</p>
          </div>
        </div>

        <Card className="border-gray-100 shadow-sm bg-white">
          <CardContent className="p-0">
            {isLoadingHistory ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">Bạn chưa hoàn thành bài thi nào.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/exams')}>
                  Khám phá đề thi ngay
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead>Ngày thi</TableHead>
                      <TableHead>Đề thi</TableHead>
                      <TableHead>Loại đề</TableHead>
                      <TableHead className="text-center">Kết quả</TableHead>
                      <TableHead className="text-center">Thời gian</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record) => (
                      <TableRow key={record.id} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="font-medium text-gray-900">
                          {record.submittedAt
                            ? format(new Date(record.submittedAt), 'dd/MM/yyyy HH:mm', {
                                locale: vi,
                              })
                            : 'N/A'}
                        </TableCell>
                        <TableCell
                          className="max-w-50 truncate"
                          title={record.exam?.title || record.grammarTopic?.name}
                        >
                          {record.exam?.title || record.grammarTopic?.name || 'Unknown Exam'}
                        </TableCell>
                        <TableCell>
                          {record.grammarTopic ? (
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700 border-purple-200"
                            >
                              Ngữ pháp
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-white">
                              {record.exam?.part === 'FULL' ? 'Full Test' : record.exam?.part}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {record.isFullTest ? (
                            <span className="font-bold text-blue-600">{record.score}</span>
                          ) : (
                            <span className="font-semibold text-gray-700">
                              {record.correctQ}/{record.totalQ}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-gray-500 text-sm">
                          {Math.floor(record.timeTaken / 60)}p {record.timeTaken % 60}s
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => navigate(`/results/${record.id}`)}
                          >
                            Chi tiết <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination placeholder if totalPages > 1 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Trang trước
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
