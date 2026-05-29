import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, ChevronDown, ChevronRight, Headphones, ImageIcon, AlignLeft, ListCollapse, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminTableLoading } from '@/components/admin/AdminTableLoading';

interface QuestionTableProps {
  questions: any[];
  isLoading?: boolean;
  onEdit: (item: any, isGroup: boolean) => void;
  onDelete: (item: any, isGroup: boolean) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  isGroupedView?: boolean;
}

export function QuestionTable({
  questions,
  isLoading,
  onEdit,
  onDelete,
  selectedIds = [],
  onSelectionChange,
  isGroupedView = false
}: QuestionTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(groupId)) newSet.delete(groupId);
    else newSet.add(groupId);
    setExpandedGroups(newSet);
  };

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (selectedIds.length === questions.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(questions.map(q => q.id));
    }
  };

  const toggleOne = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  // Build hybrid display data
  const displayData = useMemo(() => {
    if (!isGroupedView) {
      // Flattened view
      return questions.map(q => ({ type: 'FLAT', id: q.id, question: q }));
    }

    // Grouped view
    const map = new Map<string, any>();
    const result: any[] = [];

    questions.forEach(q => {
      if (!q.passageGroupId) {
        result.push({ type: 'STANDALONE', id: q.id, question: q });
      } else {
        if (!map.has(q.passageGroupId)) {
          const groupObj = {
            type: 'GROUP',
            id: q.passageGroupId,
            passageGroup: q.passageGroup,
            subQuestions: [q],
            exam: q.exam
          };
          map.set(q.passageGroupId, groupObj);
          result.push(groupObj);
        } else {
          map.get(q.passageGroupId)!.subQuestions.push(q);
        }
      }
    });
    return result;
  }, [questions, isGroupedView]);

  if (isLoading) {
    return (
      <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40px]"><Checkbox disabled /></TableHead>
              <TableHead>ID / #</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Đề thi / Part</TableHead>
              <TableHead>Độ khó</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableLoading columns={6} rows={5} />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <AdminEmptyState 
        title="Không tìm thấy câu hỏi" 
        description="Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại." 
        icon="search" 
      />
    );
  }

  return (
    <div className="border border-border rounded-lg bg-card h-full flex flex-col overflow-hidden shadow-sm">
      <div className="flex-1 overflow-auto min-h-0 custom-scrollbar relative">
        <Table>
          <TableHeader className="bg-muted/80 backdrop-blur-sm sticky top-0 z-10 border-b border-border shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[40px] h-12">
                <Checkbox
                  checked={questions.length > 0 && selectedIds.length === questions.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-[100px] h-12 font-semibold">ID / #</TableHead>
              <TableHead className="min-w-[300px] h-12 font-semibold text-foreground">Nội dung</TableHead>
              <TableHead className="h-12 font-semibold text-foreground">Đề thi / Part</TableHead>
              <TableHead className="h-12 font-semibold text-foreground">Độ khó</TableHead>
              <TableHead className="text-center h-12 font-semibold text-foreground">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item) => {
              if (item.type === 'FLAT' || item.type === 'STANDALONE') {
                const q = item.question;
                return (
                  <TableRow key={q.id} className={cn(
                    "group hover:bg-muted/40 transition-colors border-b border-border/50",
                    selectedIds.includes(q.id) && "bg-primary/5"
                  )}>
                    <TableCell className="py-4">
                      <Checkbox
                        checked={selectedIds.includes(q.id)}
                        onCheckedChange={() => toggleOne(q.id)}
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{q.id.substring(0, 6)}</span>
                        <span className="text-sm font-semibold text-foreground">Câu {q.order}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="max-w-[400px]">
                        {/* Badge 'Thuộc nhóm đoạn văn' removed per user request */}
                        <p className="text-sm font-medium text-foreground truncate" title={q.questionText || "Câu hỏi không có text (Part 1/2)"}>
                          {q.questionText || <span className="italic text-muted-foreground">Không có văn bản câu hỏi</span>}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-foreground truncate max-w-[200px]" title={q.exam?.title}>{q.exam?.title || 'N/A'}</span>
                        <span className="text-xs text-muted-foreground font-semibold">{q.exam?.part}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {q.difficulty === 'EASY' ? (
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-tight">Dễ</Badge>
                      ) : q.difficulty === 'MEDIUM' ? (
                        <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-tight">Vừa</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-500/5 text-rose-600 border-rose-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-tight">Khó</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => onEdit(q.passageGroupId ? q.passageGroup : q, !!q.passageGroupId)} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(q.passageGroupId ? q.passageGroup : q, !!q.passageGroupId)} className="text-destructive focus:text-destructive cursor-pointer">
                            <Trash2 className="w-4 h-4 mr-2" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              }

              if (item.type === 'GROUP') {
                const isExpanded = expandedGroups.has(item.id);
                const pGroup = item.passageGroup;
                const passages = pGroup?.passages || [];

                // Determine media types in group
                const hasAudio = passages.some((p: any) => p.mediaType === 'AUDIO');
                const hasImage = passages.some((p: any) => p.mediaType === 'IMAGE');
                const hasText = passages.some((p: any) => p.mediaType === 'TEXT' && p.content);

                return (
                  <React.Fragment key={item.id}>
                    {/* Group Header Row */}
                    <TableRow className="bg-muted/30 hover:bg-muted/50 cursor-pointer border-b border-border/50" onClick={() => toggleGroup(item.id)}>
                      <TableCell className="py-3">
                        {/* No global checkbox for group itself to avoid complex logic, or we can leave it empty */}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full shrink-0">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4" />}
                          </Button>
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                            Cụm {item.subQuestions.length} câu
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-4">
                          <div className="flex gap-2 text-muted-foreground">
                            {hasAudio && <span title="Có Audio"><Headphones className="w-4 h-4 text-blue-500" /></span>}
                            {hasImage && <span title="Có Hình ảnh"><ImageIcon className="w-4 h-4 text-emerald-500" /></span>}
                            {hasText && <span title="Có Đoạn văn"><AlignLeft className="w-4 h-4 text-amber-500" /></span>}
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            Nhóm câu hỏi Part {item.exam?.part?.replace('PART', '')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-foreground truncate max-w-[200px]" title={item.exam?.title}>{item.exam?.title || 'N/A'}</span>
                          <span className="text-xs text-muted-foreground font-semibold">{item.exam?.part}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3"></TableCell>
                      <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full"
                            onClick={() => onEdit(pGroup, true)}
                            title="Sửa nhóm câu hỏi"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                            onClick={() => onDelete(pGroup, true)}
                            title="Xóa toàn bộ nhóm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Sub-questions rows */}
                    {isExpanded && item.subQuestions.map((q: any) => (
                      <TableRow key={q.id} className={cn(
                        "bg-background/50 hover:bg-muted/20 border-b border-border/30",
                        selectedIds.includes(q.id) && "bg-primary/5"
                      )}>
                        <TableCell className="py-2 pl-8 border-l-2 border-l-primary/30">
                          <Checkbox
                            checked={selectedIds.includes(q.id)}
                            onCheckedChange={() => toggleOne(q.id)}
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          <span className="text-xs font-semibold text-foreground">Câu {q.order}</span>
                        </TableCell>
                        <TableCell className="py-2">
                          <p className="text-xs text-muted-foreground truncate max-w-[400px]">
                            {q.questionText || <span className="italic">Không có văn bản câu hỏi</span>}
                          </p>
                        </TableCell>
                        <TableCell className="py-2"></TableCell>
                        <TableCell className="py-2">
                          {q.difficulty === 'EASY' ? (
                            <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 px-1.5 py-0 text-[9px] uppercase">Dễ</Badge>
                          ) : q.difficulty === 'MEDIUM' ? (
                            <Badge variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20 px-1.5 py-0 text-[9px] uppercase">Vừa</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-rose-500/5 text-rose-600 border-rose-500/20 px-1.5 py-0 text-[9px] uppercase">Khó</Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] text-muted-foreground hover:text-primary"
                            onClick={() => onEdit(pGroup, true)}
                          >
                            Sửa nhóm
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              }

              return null;
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
