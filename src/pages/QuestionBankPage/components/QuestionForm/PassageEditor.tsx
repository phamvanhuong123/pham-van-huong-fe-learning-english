import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { MediaUploadInput } from '../MediaUploadInput';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface PassageEditorProps {
  part: string;
  passages: any[];
  setPassages: (val: any[]) => void;
}

export function PassageEditor({ part, passages, setPassages }: PassageEditorProps) {
  if (part === 'PART5') return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold border-b pb-2">
        {['PART1'].includes(part) ? 'Media Câu hỏi' : ['PART2', 'PART3', 'PART4'].includes(part) ? 'Media Audio/Video' : 'Nội dung Đoạn văn'}
      </h3>

      {passages.map((p, pIdx) => (
        <div key={pIdx} className="p-4 rounded-lg border bg-card/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-bold">
              {['PART6', 'PART7'].includes(part) 
                ? (part === 'PART7' ? `Đoạn văn ${pIdx + 1}` : 'Đoạn văn')
                : 'File Media'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại nội dung</Label>
              <Select value={p.mediaType} onValueChange={(v) => {
                const newP = [...passages];
                newP[pIdx].mediaType = v;
                setPassages(newP);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['PART1', 'PART6', 'PART7'].includes(part) && <SelectItem value="TEXT">Văn bản</SelectItem>}
                  {['PART1', 'PART2', 'PART3', 'PART4'].includes(part) && <SelectItem value="AUDIO">Âm thanh</SelectItem>}
                  {['PART1', 'PART6', 'PART7'].includes(part) && <SelectItem value="IMAGE">Hình ảnh</SelectItem>}
                  {['PART2', 'PART3', 'PART4'].includes(part) && <SelectItem value="VIDEO">Video</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            {p.mediaType !== 'TEXT' && (
              <div className="space-y-2">
                <Label>Upload File</Label>
                <MediaUploadInput
                  mediaType={p.mediaType as any}
                  value={p.mediaUrl}
                  pendingFile={p.mediaFile}
                  pendingPreviewUrl={p.previewUrl}
                  onFileSelect={(file, previewUrl) => {
                    const newP = [...passages];
                    newP[pIdx].mediaFile = file;
                    newP[pIdx].previewUrl = previewUrl;
                    newP[pIdx].mediaUrl = '';
                    setPassages(newP);
                  }}
                  onDeleteUploaded={() => {
                    const newP = [...passages];
                    newP[pIdx].mediaUrl = '';
                    setPassages(newP);
                  }}
                  onClearPending={() => {
                    const newP = [...passages];
                    newP[pIdx].mediaFile = undefined;
                    newP[pIdx].previewUrl = undefined;
                    setPassages(newP);
                  }}
                />
              </div>
            )}
          </div>

          {p.mediaType === 'TEXT' && (
            <div className="space-y-2">
              <Label>Nội dung đoạn văn</Label>
              <ReactQuill
                theme="snow"
                value={p.content || ''}
                onChange={(v) => {
                  const newP = [...passages];
                  newP[pIdx].content = v;
                  setPassages(newP);
                }}
                className="bg-background rounded-md"
              />
            </div>
          )}
          
          {['PART3', 'PART4', 'PART6', 'PART7'].includes(part) && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                {['PART3', 'PART4'].includes(part) ? 'Transcript / Lời thoại' : 'Bản dịch tiếng Việt'}
                <span className="text-xs font-normal text-muted-foreground">(tuỳ chọn)</span>
              </Label>
              <ReactQuill
                theme="snow"
                value={p.transcript || ''}
                onChange={(v) => {
                  const newP = [...passages];
                  newP[pIdx].transcript = v;
                  setPassages(newP);
                }}
                className="bg-background rounded-md"
              />
            </div>
          )}
        </div>
      ))}

      {part === 'PART7' && passages.length < 3 && (
        <Button variant="outline" className="h-11 rounded-md" onClick={() => setPassages([...passages, { mediaType: 'TEXT', content: '', mediaUrl: '', order: passages.length + 1 }])}>
          <Plus className="w-4 h-4 mr-2" /> Thêm Đoạn văn (Double/Triple)
        </Button>
      )}
    </div>
  );
}
