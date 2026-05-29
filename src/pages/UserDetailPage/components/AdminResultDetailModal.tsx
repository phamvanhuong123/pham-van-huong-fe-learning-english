import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useMemo } from 'react';

interface AdminResultDetailModalProps {
  resultId: string;
  onClose: () => void;
}

export function AdminResultDetailModal({ resultId, onClose }: AdminResultDetailModalProps) {
  const { data: result, isLoading, error } = useQuery({
    queryKey: ['adminResultDetails', resultId],
    queryFn: () => adminService.getAdminResultDetails(resultId),
    enabled: !!resultId,
  });

  const parts = useMemo(() => {
    if (!result?.resultDetails) return [];
    const grouped = result.resultDetails.reduce((acc: any, detail: any) => {
      const rawPart = detail.question?.part;
      const part = rawPart ? rawPart.replace('PART', 'Part ') : 'Khác';
      if (!acc[part]) acc[part] = [];
      acc[part].push(detail);
      return acc;
    }, {});
    return Object.keys(grouped).sort();
  }, [result]);

  return (
    <Dialog open={!!resultId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b pb-4 bg-muted/20">
          <DialogTitle className="flex items-center gap-2 text-xl">
            Chi tiết Bài làm
            {result?.isFullTest && <Badge variant="default" className="bg-blue-600">Full Test</Badge>}
          </DialogTitle>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
            <div><span className="font-medium text-foreground">Học viên:</span> {result?.user?.name || result?.user?.email}</div>
            <div><span className="font-medium text-foreground">Đề thi:</span> {result?.exam?.title}</div>
            <div><span className="font-medium text-foreground">Điểm:</span> {result?.score} (Đúng: {result?.correctQ}/{result?.totalQ})</div>
            {result?.isFullTest && (
              <>
                <div><span className="font-medium text-foreground">Reading:</span> {result?.readingScore}</div>
                <div><span className="font-medium text-foreground">Listening:</span> {result?.listeningScore}</div>
              </>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="p-6 space-y-4 flex-1">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-rose-500">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p>Lỗi khi tải chi tiết bài thi.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue={parts[0]} className="flex-1 flex flex-col w-full">
              <div className="px-6 py-2 border-b">
                <TabsList className="w-full flex justify-start overflow-x-auto">
                  {parts.map(part => (
                    <TabsTrigger key={part} value={part} className="flex-1 sm:flex-none">
                      {part}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <ScrollArea className="flex-1 p-6 bg-muted/10">
                {parts.map(part => (
                  <TabsContent key={part} value={part} className="space-y-6 mt-0">
                    {result.resultDetails.filter((d: any) => {
                      const rawPart = d.question?.part;
                      const label = rawPart ? rawPart.replace('PART', 'Part ') : 'Khác';
                      return label === part;
                    }).map((detail: any, index: number) => {
                      const q = detail.question;
                      const correctOption = q.options?.find((o: any) => o.isCorrect);
                      
                      return (
                        <div key={detail.id} className={`p-4 rounded-xl border ${detail.isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'}`}>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {detail.isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-rose-500" />
                              )}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="font-medium text-base">
                                <span className="mr-2 text-muted-foreground">Câu {q.order}:</span>
                                {q.questionText || 'Câu hỏi hình ảnh / audio'}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {(q.options || []).map((opt: any) => {
                                  const isSelected = detail.selectedLabel === opt.label;
                                  const isCorrect = opt.isCorrect;
                                  
                                  let bgClass = "bg-background border";
                                  if (isSelected && isCorrect) bgClass = "bg-emerald-100 border-emerald-300 text-emerald-800";
                                  else if (isSelected && !isCorrect) bgClass = "bg-rose-100 border-rose-300 text-rose-800";
                                  else if (!isSelected && isCorrect) bgClass = "bg-emerald-50 border-emerald-300 border-dashed text-emerald-700";

                                  return (
                                    <div key={opt.id} className={`p-2 rounded-lg flex items-center gap-2 ${bgClass}`}>
                                      <span className="font-bold w-6 h-6 flex items-center justify-center bg-white/50 rounded-full text-xs">
                                        {opt.label}
                                      </span>
                                      <span className="flex-1">{opt.text}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {!detail.selectedLabel && (
                                <div className="text-sm text-rose-500 italic mt-2">
                                  * Học viên bỏ trống câu này. Đáp án đúng là {correctOption?.label}.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
