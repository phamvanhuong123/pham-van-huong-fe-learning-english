import React from 'react'
import { Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import type { ClientExam } from '@/types/exam.type'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

interface ExamCardProps {
  exam: ClientExam
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const navigate = useNavigate()
  const { userInfo } = useAuthStore()

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200/60'
      case 'HARD':
        return 'bg-rose-50 text-rose-700 border-rose-200/60'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/60'
    }
  }

  const getDifficultyDot = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500'
      case 'MEDIUM':
        return 'bg-amber-500'
      case 'HARD':
        return 'bg-rose-500'
      default:
        return 'bg-slate-500'
    }
  }

  const isVipRequired = exam.type === 'VIP' && !userInfo?.isVip

  return (
    <Card
      className={cn(
        'group relative overflow-hidden flex flex-col bg-white transition-all duration-300',
        'border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1',
        exam.type === 'VIP' ? 'hover:border-amber-300/50' : 'hover:border-blue-200'
      )}
    >
      {/* Decorative top gradient for VIP */}
      {exam.type === 'VIP' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 opacity-80" />
      )}

      <CardHeader className="pb-4 pt-6 px-6">
        <div className="flex justify-between items-center mb-4">
          <Badge
            variant="secondary"
            className="bg-slate-100/80 text-slate-700 font-semibold tracking-wide text-xs px-2.5 py-1 border-none"
          >
            {exam.part === 'FULL' ? 'FULL TEST' : exam.part.replace('PART', 'PART ')}
          </Badge>

          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
              getDifficultyColor(exam.difficulty)
            )}
          >
            <div className={cn('w-1.5 h-1.5 rounded-full', getDifficultyDot(exam.difficulty))} />
            {exam.difficulty === 'EASY' ? 'Dễ' : exam.difficulty === 'MEDIUM' ? 'TB' : 'Khó'}
          </div>
        </div>

        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          {exam.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-2">
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6">
          {exam.description ||
            'Bài thi đánh giá năng lực TOEIC chuẩn format mới. Bài test giúp bạn làm quen cấu trúc đề và đánh giá nhanh năng lực.'}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{exam.duration} phút</span>
          </div>

          {exam.type === 'VIP' && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 px-2.5 py-1 rounded-md border border-amber-100/50">
              <span className="text-amber-700 font-bold tracking-wider text-[10px]">PREMIUM</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-6 px-6 border-t border-slate-50 mt-4">
        {isVipRequired ? (
          <Button
            onClick={() => navigate('/pricing')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm h-11"
          >
            Nâng cấp VIP để làm bài
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => navigate(`/exams/${exam.id}`)}
            className="w-full bg-white text-slate-900 border-slate-200 font-medium group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white hover:bg-blue-700 transition-all shadow-sm h-11"
          >
            Xem chi tiết
            <ArrowRight className="w-4 h-4 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
