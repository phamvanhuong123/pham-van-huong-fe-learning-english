import { SearchX, FileQuestion, BookOpen, UserX, type LucideIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminEmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'search' | 'file' | 'book' | 'user' | 'trash';
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  search: SearchX,
  file: FileQuestion,
  book: BookOpen,
  user: UserX,
  trash: Trash2
};

export function AdminEmptyState({
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu nào để hiển thị vào lúc này.',
  icon = 'search',
  action,
  className,
}: AdminEmptyStateProps) {
  const Icon = iconMap[icon] || SearchX;

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[300px] border border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20", className)}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[250px] mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="default" className="shadow-sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
