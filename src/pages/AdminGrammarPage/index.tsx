import { useState } from 'react';
import { useGetAdminGrammarTopics, useDeleteGrammarTopic } from '@/hooks/queries/useGrammarQuery';
import type { GrammarTopic } from '@/types/grammar.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit2, Trash2, BookOpen } from 'lucide-react';
import { TopicModal } from './components/TopicModal';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

function AdminGrammarPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<GrammarTopic | null>(null);
  
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    topicId: string | null;
    topicName: string;
  }>({ isOpen: false, topicId: null, topicName: '' });

  const { data, isLoading } = useGetAdminGrammarTopics({ search: searchTerm, limit: 100 });
  const deleteTopic = useDeleteGrammarTopic();

  const handleCreate = () => {
    setEditingTopic(null);
    setIsModalOpen(true);
  };

  const handleEdit = (topic: GrammarTopic) => {
    setEditingTopic(topic);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmState({ isOpen: true, topicId: id, topicName: name });
  };

  const executeDelete = () => {
    if (!confirmState.topicId) return;
    deleteTopic.mutate(confirmState.topicId, {
      onSuccess: () => {
        toast.success('Đã xóa chủ đề');
        setConfirmState({ isOpen: false, topicId: null, topicName: '' });
      },
      onError: () => {
        toast.error('Không thể xóa chủ đề này');
        setConfirmState({ isOpen: false, topicId: null, topicName: '' });
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Ngữ pháp</h1>
          <p className="text-sm text-muted-foreground mt-1">Danh sách các chủ đề ngữ pháp trên hệ thống.</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Thêm chủ đề mới
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm chủ đề..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên chủ đề</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Số lượng câu hỏi</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : !data?.data || data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Không tìm thấy chủ đề nào.
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((topic: GrammarTopic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">
                    {topic.name}
                    {topic.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{topic.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{topic.slug}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {topic._count?.questions || 0} câu
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(topic)}>
                        <Edit2 className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id, topic.name)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topic={editingTopic}
      />

      <ConfirmDialog
        open={confirmState.isOpen}
        onOpenChange={(isOpen) => setConfirmState(prev => ({ ...prev, isOpen }))}
        onConfirm={executeDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa chủ đề "${confirmState.topicName}"? Các câu hỏi bên trong cũng sẽ bị ảnh hưởng.`}
        variant="destructive"
      />
    </div>
  );
}

export default AdminGrammarPage;
