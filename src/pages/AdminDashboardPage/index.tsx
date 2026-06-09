import { useDashboard } from '@/hooks/useDashboard'
import { StatsCard } from './components/StatsCard'
import { OverviewChart } from './components/OverviewChart'
import { Users, FileText, CheckCircle, Activity } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

function AdminDashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (error) {
    return (
      <div className="p-12 text-center text-rose-500 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl m-8 border border-dashed border-rose-200 shadow-sm">
        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold">Đã xảy ra lỗi</h3>
        <p>Lỗi khi tải dữ liệu trang tổng quan.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl border shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Tổng số người dùng"
            value={data?.stats?.totalUsers?.toLocaleString() || 0}
            icon={Users}
            description="Tài khoản đang hoạt động"
            trend="+12%"
          />
          <StatsCard
            title="Đề thi đã phát hành"
            value={data?.stats?.totalExams?.toLocaleString() || 0}
            icon={FileText}
            description="Đang mở cho học viên"
          />
          <StatsCard
            title="Lượt làm bài"
            value={data?.stats?.totalResults?.toLocaleString() || 0}
            icon={CheckCircle}
            description="Tổng bài thi đã hoàn thành"
            trend="+5%"
          />
        </div>
      )}

      <div>
        {isLoading ? (
          <Skeleton className="h-[450px] w-full rounded-xl border shadow-sm" />
        ) : (
          <OverviewChart data={data?.chartData} />
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage
