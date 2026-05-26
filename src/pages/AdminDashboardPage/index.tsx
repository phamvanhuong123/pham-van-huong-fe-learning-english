import { useDashboard } from '@/hooks/useDashboard';
import { StatsCard } from './components/StatsCard';
import { RecentActivity } from './components/RecentActivity';
import { Users, FileText, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function AdminDashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (error) {
    return (
      <div className="p-8 text-center text-rose-500">
        <p>Lỗi khi tải dữ liệu trang tổng quan.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">Tổng quan về hệ thống và các hoạt động gần đây.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard 
            title="Tổng Người Dùng" 
            value={data?.stats?.totalUsers || 0} 
            icon={Users} 
            color="text-blue-500"
            description="Tài khoản đang hoạt động"
          />
          <StatsCard 
            title="Tổng Đề Thi" 
            value={data?.stats?.totalExams || 0} 
            icon={FileText} 
            color="text-indigo-500"
            description="Tổng số đề thi trên hệ thống"
          />
          <StatsCard 
            title="Lượt Làm Bài" 
            value={data?.stats?.totalResults || 0} 
            icon={CheckCircle} 
            color="text-emerald-500"
            description="Tổng số bài thi đã được nộp"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        {/* Phần bên trái có thể để chart sau này, hiện tại RecentActivity chiếm 3 cột */}
        {isLoading ? (
          <Skeleton className="col-span-3 h-[400px] rounded-xl" />
        ) : (
          <RecentActivity logs={data?.recentActivity || []} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
