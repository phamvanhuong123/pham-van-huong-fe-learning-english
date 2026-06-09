import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye, EyeOff, Trash2, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import type { AdminExamItem } from '@/types/exam.type'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { AdminTableLoading } from '@/components/admin/AdminTableLoading'

interface ExamTableProps {
  exams: AdminExamItem[]
  isLoading?: boolean
  onEdit: (e: AdminExamItem) => void
  onToggleStatus: (e: AdminExamItem) => void
  onDelete: (e: AdminExamItem) => void
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export function ExamTable({
  exams,
  isLoading,
  onEdit,
  onToggleStatus,
  onDelete,
  selectedIds = [],
  onSelectionChange,
}: ExamTableProps) {
  const toggleAll = () => {
    if (!onSelectionChange) return
    if (selectedIds.length === exams.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(exams.map((e) => e.id))
    }
  }

  const toggleOne = (id: string) => {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  if (isLoading) {
    return (
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-10">
                <Checkbox disabled />
              </TableHead>
              <TableHead>Mã đề</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Phân loại</TableHead>
              <TableHead>Câu hỏi</TableHead>
              <TableHead>Độ khó</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableLoading columns={8} rows={5} />
          </TableBody>
        </Table>
      </div>
    )
  }

  if (exams.length === 0) {
    return (
      <AdminEmptyState
        title="Không tìm thấy đề thi"
        description="Chưa có đề thi nào phù hợp với bộ lọc hiện tại."
        icon="file"
      />
    )
  }

  return (
    <div className="border border-border rounded-lg bg-card h-full flex flex-col overflow-hidden shadow-sm">
      <div className="flex-1 overflow-auto relative">
        <Table>
          <TableHeader className="bg-muted/80 backdrop-blur-sm sticky top-0 z-10 border-b border-border shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-10 h-12">
                <Checkbox
                  checked={exams.length > 0 && selectedIds.length === exams.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-25 h-12 font-semibold text-center">Mã đề</TableHead>
              <TableHead className="min-w-62.5 h-12 font-semibold text-foreground">
                Tiêu đề
              </TableHead>
              <TableHead className="h-12 font-semibold text-foreground">Phân loại</TableHead>
              <TableHead className="h-12 font-semibold text-foreground text-center">
                Câu hỏi
              </TableHead>
              <TableHead className="h-12 font-semibold text-foreground">Độ khó</TableHead>
              <TableHead className="h-12 font-semibold text-foreground">Trạng thái</TableHead>
              <TableHead className="text-center h-12 font-semibold text-foreground">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((e) => (
              <TableRow
                key={e.id}
                className={cn(
                  'group hover:bg-muted/45 transition-colors border-b border-border/50',
                  selectedIds.includes(e.id) && 'bg-primary/5'
                )}
              >
                <TableCell className="py-4">
                  <Checkbox
                    checked={selectedIds.includes(e.id)}
                    onCheckedChange={() => toggleOne(e.id)}
                  />
                </TableCell>
                <TableCell className="py-4 text-center">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {e.id.substring(0, 8)}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="font-medium text-foreground truncate max-w-75 cursor-default">
                          {e.title}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start" className="max-w-xs">
                        <p className="text-xs">{e.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant="secondary"
                      className="w-fit text-[10px] font-bold tracking-tight"
                    >
                      {e.part}
                    </Badge>
                    <Badge
                      variant={e.type === 'VIP' ? 'destructive' : 'outline'}
                      className={`${e.type === 'VIP' ? 'text-red-600 text-[11px] font-bold' : 'text-emerald-600 text-[11px] font-bold'} text-center`}
                    >
                      {e.type}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <span className="text-sm font-semibold text-foreground">{e.questionCount}</span>
                </TableCell>
                <TableCell className="py-4">
                  {e.difficulty === 'EASY' ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-tight"
                    >
                      Dễ
                    </Badge>
                  ) : e.difficulty === 'MEDIUM' ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/5 text-amber-600 border-amber-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-tight"
                    >
                      Vừa
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-rose-500/5 text-rose-600 border-rose-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-tight"
                    >
                      Khó
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  {e.isPublished ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-tighter">
                        Công khai
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                      <span className="text-xs font-semibold uppercase tracking-tighter">
                        Bản nháp
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(e)} className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(e)}
                        className={cn(
                          'cursor-pointer',
                          e.isPublished
                            ? 'text-amber-600 focus:text-amber-600'
                            : 'text-emerald-600 focus:text-emerald-600'
                        )}
                      >
                        {e.isPublished ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" /> Gỡ bài
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" /> Công khai bài
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(e)}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Xóa đề thi
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
