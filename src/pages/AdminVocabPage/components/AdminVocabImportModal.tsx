import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, AlertCircle, FileText } from 'lucide-react';
import { useImportAdminVocabCsv } from '@/hooks/queries/useAdminVocabQuery';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdminVocabImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminVocabImportModal({ isOpen, onClose }: AdminVocabImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: importCsv, isPending } = useImportAdminVocabCsv();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImportResult(null); // reset result
    }
  };

  const handleImport = async () => {
    if (!file) return;
    try {
      const res = await importCsv(file);
      setImportResult(res.data);
      if (res.data.errorCount > 0) {
        toast.warning(`Import thành công ${res.data.successCount} từ hệ thống, lỗi ${res.data.errorCount} từ`);
      } else {
        toast.success(`Import thành công toàn bộ ${res.data.successCount} từ hệ thống`);
      }
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleExportTemplate = () => {
    const csvContent = "word,meaning,phonetic,audioUrl,example,toeicTopic,collocations\napple,quả táo,/ˈæp.əl/,,I eat an apple.,General,eat an apple";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'system_vocab_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Từ vựng hệ thống</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 flex gap-2" onClick={handleExportTemplate}>
              <Download className="h-4 w-4" /> Tải file mẫu CSV
            </Button>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-10 w-10 text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-10 w-10 mb-2" />
                <span className="font-medium">Click để chọn file CSV</span>
                <span className="text-xs">Chỉ hỗ trợ file .csv (Tối đa 1000 dòng)</span>
              </div>
            )}
          </div>

          {importResult && (
            <Alert variant={importResult.errorCount > 0 ? "destructive" : "default"} className={importResult.errorCount === 0 ? "bg-green-50 text-green-800 border-green-200" : ""}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Kết quả import</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1">
                  <div>✅ Thành công: {importResult.successCount} từ</div>
                  {importResult.errorCount > 0 && (
                    <>
                      <div className="text-red-600">❌ Lỗi: {importResult.errorCount} từ</div>
                      <div className="max-h-24 overflow-y-auto text-xs mt-2 p-2 bg-background/50 rounded border">
                        {importResult.errors.map((e: any, i: number) => (
                          <div key={i}>Dòng {e.row}: {JSON.stringify(e.error)}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Đóng</Button>
            <Button onClick={handleImport} disabled={!file || isPending}>
              {isPending ? 'Đang xử lý...' : 'Bắt đầu Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
