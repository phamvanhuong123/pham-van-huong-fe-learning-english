import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import type { SubscriptionStatus } from '@/types/subscription.type'

interface SubscriptionFiltersProps {
  search: string
  setSearch: (value: string) => void
  status: SubscriptionStatus | 'ALL'
  setStatus: (value: SubscriptionStatus | 'ALL') => void
}

export default function SubscriptionFilters({
  search,
  setSearch,
  status,
  setStatus,
}: SubscriptionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-xl border border-dashed mb-6 items-center">
      <div className="relative flex-1 max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
        <Input
          placeholder="Tìm theo email, STK, nội dung CK..."
          className="pl-9 h-10 bg-background focus-visible:ring-primary/20 transition-all rounded-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-full sm:w-[180px]">
        <Select value={status} onValueChange={(val: any) => setStatus(val)}>
          <SelectTrigger className="h-10 bg-background focus:ring-primary/20 transition-all rounded-full">
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
  )
}
