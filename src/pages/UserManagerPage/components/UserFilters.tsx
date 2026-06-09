import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface UserFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  role: string
  onRoleChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
}

export function UserFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: UserFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [localSearch, onSearchChange])

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-xl border border-dashed">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-[23px] -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
        <Input
          placeholder="Tìm kiếm theo email, tên..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9 h-10 bg-background focus-visible:ring-primary/20 transition-all rounded-full"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[150px] h-10 bg-background focus:ring-primary/20 transition-all rounded-full">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả vai trò</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="STANDARD">Standard</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px] h-10 bg-background focus:ring-primary/20 transition-all rounded-full">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
            <SelectItem value="BANNED">Đã khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
