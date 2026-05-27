import { useEffect, useState } from 'react';
import { Loader2, Award, BookOpen, Clock, FileText } from 'lucide-react';
import { getProfileStatsApi } from '@/services/profileService';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

export default function StatsTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getProfileStatsApi();
        setStats(res.data.data);
      } catch (error) {
        toast.error('Không thể tải thống kê');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statItems = [
    {
      title: 'Điểm cao nhất',
      value: stats?.highestScore || 0,
      icon: Award,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    {
      title: 'Bài thi đã làm',
      value: stats?.totalExams || 0,
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Từ vựng Master',
      value: `${stats?.masteredVocab || 0} / ${stats?.totalVocab || 0}`,
      icon: BookOpen,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      title: 'Thời gian tham gia',
      value: `${stats?.joinedDays || 0} ngày`,
      icon: Clock,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-semibold mb-8 tracking-tight">Thống kê học tập</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {statItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${item.bg}`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                  <h4 className="text-2xl font-bold tracking-tight mt-1">{item.value}</h4>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
