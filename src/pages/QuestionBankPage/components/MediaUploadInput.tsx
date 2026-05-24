import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteMediaApi } from '@/services/questionService';
import { cn } from '@/lib/utils';

export type MediaType = 'AUDIO' | 'IMAGE' | 'VIDEO';

interface MediaUploadInputProps {
  /** URL Cloudinary đã upload (existing) */
  value?: string;
  /** File object chờ upload (chưa lên Cloudinary) */
  pendingFile?: File;
  /** Blob URL để preview file chờ */
  pendingPreviewUrl?: string;
  /** Callback khi user chọn file mới (chưa upload, chỉ lưu tạm) */
  onFileSelect: (file: File, previewUrl: string) => void;
  /** Callback khi xoá file đã có URL trên Cloudinary */
  onDeleteUploaded: (url: string) => void;
  /** Callback khi huỷ file đang chờ (chưa upload) */
  onClearPending: () => void;
  mediaType: MediaType;
  className?: string;
}

export function MediaUploadInput({
  value,
  pendingFile,
  pendingPreviewUrl,
  onFileSelect,
  onDeleteUploaded,
  onClearPending,
  mediaType,
  className,
}: MediaUploadInputProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptMap: Record<MediaType, string> = {
    AUDIO: 'audio/*',
    IMAGE: 'image/*',
    VIDEO: 'video/*',
  };

  const mediaLabel = mediaType === 'AUDIO' ? 'âm thanh' : mediaType === 'IMAGE' ? 'hình ảnh' : 'video';

  // URL hiển thị preview: ưu tiên blob URL (pending), sau đó mới dùng URL Cloudinary
  const previewSrc = pendingPreviewUrl || value;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tạo blob URL để preview cục bộ, KHÔNG upload ngay
    const blobUrl = URL.createObjectURL(file);
    onFileSelect(file, blobUrl);

    // Reset input để có thể chọn lại cùng file
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (pendingFile) {
      // File chưa upload → chỉ xoá khỏi state, không tốn API
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
      onClearPending();
      return;
    }

    if (value) {
      // File đã upload → gọi API xoá Cloudinary
      try {
        setIsDeleting(true);
        await deleteMediaApi(value);
        onDeleteUploaded(value);
        toast.success('Đã xoá file khỏi hệ thống');
      } catch (err: any) {
        // Nếu backend chưa có API → fallback: chỉ xoá khỏi state, không crash
        console.warn('Delete media API chưa sẵn sàng, chỉ xoá cục bộ:', err);
        onDeleteUploaded(value);
        toast.info('Đã xoá khỏi form (file trên server sẽ được dọn dẹp sau)');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      {previewSrc ? (
        <div className="relative border rounded-xl overflow-hidden bg-muted/30 group">
          {/* Badge "Chờ upload" nếu là file pending */}
          {pendingFile && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Chờ lưu
            </div>
          )}

          {mediaType === 'IMAGE' && (
            <div className="aspect-video relative bg-black/5 flex items-center justify-center">
              <img src={previewSrc} alt="Uploaded preview" className="max-h-[300px] w-auto object-contain" />
            </div>
          )}
          {mediaType === 'AUDIO' && (
            <div className="p-4 flex items-center gap-4 bg-card border-b">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <PlayCircle className="w-5 h-5" />
              </div>
              <audio src={previewSrc} controls className="w-full h-10 outline-none" />
            </div>
          )}
          {mediaType === 'VIDEO' && (
            <div className="aspect-video relative bg-black">
              <video src={previewSrc} controls className="w-full h-full object-contain" />
            </div>
          )}

          {/* Nút X */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full shadow-lg"
              onClick={handleClear}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors text-center hover:bg-muted/50 hover:border-primary/50 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Nhấn để chọn {mediaLabel}</p>
            <p className="text-xs text-muted-foreground">File sẽ được tải lên khi bạn nhấn Lưu</p>
          </div>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept={acceptMap[mediaType]}
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
