import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { vocabSrsApiService } from '@/services/vocabSrsApiService'
import type { SrsDashboardStat } from '@/services/vocabSrsApiService'
import { Loader2, Play, Folder, BookOpen } from 'lucide-react'

interface VocabDashboardProps {
  onStartSession: (topic: string) => void
}

export default function VocabDashboard({ onStartSession }: VocabDashboardProps) {
  const [stats, setStats] = useState<SrsDashboardStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await vocabSrsApiService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (stats.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">Chưa có từ vựng nào</h3>
        <p className="text-muted-foreground mt-2">Hãy thêm từ vựng để bắt đầu học nhé.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const totalDue = stat.newCount + stat.learningCount + stat.reviewCount

          return (
            <Card key={stat.topic} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                  {stat.topic}
                </CardTitle>
                <CardDescription>
                  {totalDue > 0
                    ? `Bạn có ${totalDue} thẻ cần học hôm nay.`
                    : 'Đã hoàn thành mục tiêu hôm nay!'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground font-medium mb-1">Mới</span>
                      <span
                        className={`text-sm font-bold px-2 py-1 rounded ${stat.newCount > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-muted-foreground opacity-50'}`}
                      >
                        {stat.newCount}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground font-medium mb-1">
                        Đang học
                      </span>
                      <span
                        className={`text-sm font-bold px-2 py-1 rounded ${stat.learningCount > 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'text-muted-foreground opacity-50'}`}
                      >
                        {stat.learningCount}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground font-medium mb-1">Ôn tập</span>
                      <span
                        className={`text-sm font-bold px-2 py-1 rounded ${stat.reviewCount > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-muted-foreground opacity-50'}`}
                      >
                        {stat.reviewCount}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={totalDue === 0}
                  onClick={() => onStartSession(stat.topic)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Học ngay
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
