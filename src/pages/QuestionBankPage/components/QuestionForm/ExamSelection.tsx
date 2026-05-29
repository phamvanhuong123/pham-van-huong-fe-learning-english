import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search } from 'lucide-react';

interface ExamSelectionProps {
  exams: any[];
  selectedExamId: string;
  onExamSelect: (val: string) => void;
}

export function ExamSelection({ exams, selectedExamId, onExamSelect }: ExamSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedExam = exams.find(e => e.id === selectedExamId);

  // Grouping and Filtering Exams for Combobox
  const filteredExams = exams.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.part.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const parts = ['PART1', 'PART2', 'PART3', 'PART4', 'PART5', 'PART6', 'PART7'];
  const groupedExams = parts.reduce((acc, p) => {
    const list = filteredExams.filter(e => e.part === p);
    if (list.length > 0) acc[p] = list;
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-4 max-w-md mx-auto py-8 bg-white p-6 rounded-lg border shadow-sm">
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-bold">Chọn Đề thi</h3>
        <p className="text-sm text-muted-foreground">Vui lòng chọn đề thi để tiếp tục tạo câu hỏi.</p>
      </div>
      <div className="space-y-2 relative">
        <Label className="text-sm font-medium">Đề thi</Label>
        {exams.length === 0 ? (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md text-center">
            Chưa có đề thi nào (Hãy tạo đề thi trước)
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm select-none hover:border-primary/50 hover:bg-accent/5 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 transition-all outline-none"
            >
              {selectedExam ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold">{selectedExam.part}</Badge>
                  <span className="truncate max-w-[280px] font-medium">{selectedExam.title}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">-- Chọn đề thi --</span>
              )}
              <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute left-0 right-0 z-[100] mt-1 max-h-[220px] rounded-md border border-border/50 bg-popover/95 backdrop-blur-xl p-2 shadow-lg animate-in fade-in zoom-in-95 duration-150 flex flex-col">
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm đề thi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                      autoFocus
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                    {Object.keys(groupedExams).length === 0 ? (
                      <div className="text-xs text-muted-foreground p-3 text-center">Không tìm thấy đề thi</div>
                    ) : (
                      Object.entries(groupedExams).map(([p, list]) => (
                        <div key={p} className="space-y-1">
                          <div className="text-[10px] font-bold text-muted-foreground/70 uppercase px-2 tracking-wider py-1 border-b border-border/30">
                            {p}
                          </div>
                          {list.map(e => (
                            <button
                              key={e.id}
                              type="button"
                              onClick={() => {
                                onExamSelect(e.id);
                                setIsDropdownOpen(false);
                                setSearchTerm('');
                              }}
                              className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-left hover:bg-primary/10 hover:text-primary transition-all font-medium"
                            >
                              <Badge variant="secondary" className="text-[8px] uppercase font-bold shrink-0">{e.part}</Badge>
                              <span className="truncate">{e.title}</span>
                            </button>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
