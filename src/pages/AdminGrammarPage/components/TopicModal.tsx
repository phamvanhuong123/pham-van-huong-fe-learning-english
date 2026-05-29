import { useState, useEffect } from 'react';
import { useCreateGrammarTopic, useUpdateGrammarTopic } from '@/hooks/queries/useGrammarQuery';
import type { GrammarTopic } from '@/types/grammar.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: GrammarTopic | null;
}

export function TopicModal({ isOpen, onClose, topic }: TopicModalProps) {
  const createTopic = useCreateGrammarTopic();
  const updateTopic = useUpdateGrammarTopic();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    if (topic) {
      setFormData({
        name: topic.name,
        slug: topic.slug,
        description: topic.description || ''
      });
    } else {
      setFormData({ name: '', slug: '', description: '' });
    }
  }, [topic, isOpen]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!topic) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData({ ...formData, name, slug });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Vui lòng điền tên và slug');
      return;
    }

    if (topic) {
      updateTopic.mutate(
        { id: topic.id, data: formData },
        {
          onSuccess: () => {
            toast.success('Cập nhật thành công');
            onClose();
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại');
          }
        }
      );
    } else {
      createTopic.mutate(formData, {
        onSuccess: () => {
          toast.success('Tạo chủ đề thành công');
          onClose();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Tạo thất bại');
        }
      });
    }
  };

  const isPending = createTopic.isPending || updateTopic.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{topic ? 'Sửa chủ đề ngữ pháp' : 'Thêm chủ đề ngữ pháp mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên chủ đề <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="VD: Thì hiện tại đơn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) <span className="text-destructive">*</span></Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="thi-hien-tai-don"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả ngắn gọn về chủ đề này..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {topic ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
