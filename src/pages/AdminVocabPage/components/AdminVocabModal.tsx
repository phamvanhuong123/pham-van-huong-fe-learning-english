import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateAdminVocab, useUpdateAdminVocab } from '@/hooks/queries/useAdminVocabQuery';
import type { Vocab, CreateVocabDto } from '@/types/vocab.type';
import { toast } from 'sonner';

interface AdminVocabModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocab: Vocab | null; 
}

const TOPICS = ['Business', 'Office', 'Travel', 'Health', 'Finance', 'General'];

export default function AdminVocabModal({ isOpen, onClose, vocab }: AdminVocabModalProps) {
  const isEditing = !!vocab;
  
  const [formData, setFormData] = useState<CreateVocabDto>({
    word: '', meaning: '', phonetic: '', audioUrl: '', example: '', toeicTopic: '', collocations: ''
  });

  useEffect(() => {
    if (vocab) {
      setFormData({
        word: vocab.word,
        meaning: vocab.meaning,
        phonetic: vocab.phonetic || '',
        audioUrl: vocab.audioUrl || '',
        example: vocab.example || '',
        toeicTopic: vocab.toeicTopic || '',
        collocations: vocab.collocations || ''
      });
    } else {
      setFormData({
        word: '', meaning: '', phonetic: '', audioUrl: '', example: '', toeicTopic: '', collocations: ''
      });
    }
  }, [vocab, isOpen]);

  const { mutateAsync: createVocab, isPending: isCreating } = useCreateAdminVocab();
  const { mutateAsync: updateVocab, isPending: isUpdating } = useUpdateAdminVocab();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateVocab({ id: vocab.id, data: formData });
        toast.success('Cập nhật từ vựng hệ thống thành công');
      } else {
        await createVocab(formData);
        toast.success('Thêm từ vựng hệ thống thành công');
      }
      onClose();
    } catch (error) {
      // Handled by interceptor
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Sửa từ vựng hệ thống' : 'Thêm từ vựng hệ thống'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="word">Từ vựng (*)</Label>
              <Input 
                id="word" 
                value={formData.word} 
                onChange={(e) => setFormData({ ...formData, word: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phonetic">Phiên âm</Label>
              <Input 
                id="phonetic" 
                value={formData.phonetic} 
                onChange={(e) => setFormData({ ...formData, phonetic: e.target.value })} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meaning">Nghĩa (*)</Label>
            <Input 
              id="meaning" 
              value={formData.meaning} 
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="example">Ví dụ</Label>
            <Textarea 
              id="example" 
              value={formData.example} 
              onChange={(e) => setFormData({ ...formData, example: e.target.value })} 
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collocations">Collocations</Label>
            <Input 
              id="collocations" 
              value={formData.collocations} 
              onChange={(e) => setFormData({ ...formData, collocations: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="toeicTopic">Chủ đề TOEIC</Label>
              <Select 
                value={formData.toeicTopic || ""} 
                onValueChange={(val) => setFormData({ ...formData, toeicTopic: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  {TOPICS.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audioUrl">URL Audio</Label>
              <Input 
                id="audioUrl" 
                type="url"
                value={formData.audioUrl} 
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
