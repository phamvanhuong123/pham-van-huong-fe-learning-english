import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { SubscriptionStatus } from '@/types/subscription.type';

interface SubscriptionFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  status: SubscriptionStatus | 'ALL';
  setStatus: (value: SubscriptionStatus | 'ALL') => void;
}

export default function SubscriptionFilters({
  search,
  setSearch,
  status,
  setStatus
}: SubscriptionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Tìm theo email, STK, nội dung CK..." 
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="w-[180px]">
        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="PENDING">Đang chờ duyệt</SelectItem>
            <SelectItem value="APPROVED">Đã duyệt</SelectItem>
            <SelectItem value="REJECTED">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
