import { cn } from '@/lib/utils';
import type { SubscriptionStatus } from '@/types/subscription.type';

export default function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        {
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20": status === 'PENDING',
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20": status === 'APPROVED',
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20": status === 'REJECTED',
        }
      )}
    >
      {status === 'PENDING' && 'Đang chờ'}
      {status === 'APPROVED' && 'Đã duyệt'}
      {status === 'REJECTED' && 'Từ chối'}
    </span>
  );
}
