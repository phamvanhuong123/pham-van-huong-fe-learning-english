import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import type { VocabStatus } from '@/types/vocab.type'
import { useVocabTopics } from '@/hooks/queries/useVocabQuery'

interface VocabFiltersProps {
  search: string
  setSearch: (val: string) => void
  status: VocabStatus | 'ALL'
  setStatus: (val: VocabStatus | 'ALL') => void
  toeicTopic: string
  setToeicTopic: (val: string) => void
  onAddClick: () => void
  onImportClick: () => void
}

export default function VocabFilters({
  search,
  setSearch,
  status,
  setStatus,
  toeicTopic,
  setToeicTopic,
  onAddClick,
  onImportClick,
}: VocabFiltersProps) {
  const { data: topics = [] } = useVocabTopics()

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-[22px] -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
        <Input
          placeholder="Tìm kiếm từ vựng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 bg-background focus-visible:ring-primary/20 transition-all rounded-full"
        />
      </div>

      <Select value={status} onValueChange={(val: any) => setStatus(val)}>
        <SelectTrigger className="w-[180px] h-10 bg-background rounded-full focus:ring-primary/20 transition-all">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
          <SelectItem value="NEW">Từ mới</SelectItem>
          <SelectItem value="LEARNING">Đang học</SelectItem>
          <SelectItem value="REVIEW">Cần ôn</SelectItem>
          <SelectItem value="MASTERED">Đã thuộc</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={toeicTopic || 'ALL'}
        onValueChange={(val) => setToeicTopic(val === 'ALL' ? '' : val)}
      >
        <SelectTrigger className="w-[180px] h-10 bg-background rounded-full focus:ring-primary/20 transition-all">
          <SelectValue placeholder="Chủ đề TOEIC" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả chủ đề</SelectItem>
          {topics.map((topic) => (
            <SelectItem key={topic} value={topic}>
              {topic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onImportClick}>
          Import CSV
        </Button>
        <Button onClick={onAddClick}>+ Thêm từ</Button>
      </div>
    </div>
  )
}
