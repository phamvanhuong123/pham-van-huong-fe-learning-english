import { useVocabStats } from '@/hooks/queries/useVocabQuery';

const statsConfig = [
  { key: 'NEW', label: 'Từ mới', color: 'bg-blue-100 text-blue-800' },
  { key: 'LEARNING', label: 'Đang học', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'REVIEW', label: 'Cần ôn', color: 'bg-orange-100 text-orange-800' },
  { key: 'MASTERED', label: 'Đã thuộc', color: 'bg-green-100 text-green-800' },
] as const;

export default function VocabStatsBar() {
  const { data: stats, isLoading } = useVocabStats();

  if (isLoading) {
    return <div className="h-16 bg-muted animate-pulse rounded-lg mb-6"></div>;
  }

  const defaultStats = { NEW: 0, LEARNING: 0, REVIEW: 0, MASTERED: 0 };
  const currentStats = stats || defaultStats;

  return (
    <div className="flex gap-4 mb-6">
      {statsConfig.map(({ key, label, color }) => (
        <div key={key} className={`flex-1 p-4 rounded-lg flex flex-col items-center justify-center ${color}`}>
          <span className="text-sm font-medium">{label}</span>
          <span className="text-2xl font-bold">{currentStats[key]}</span>
        </div>
      ))}
    </div>
  );
}
