import { useState } from 'react';
import { useAdminVocabs, useDeleteAdminVocab } from '@/hooks/queries/useAdminVocabQuery';
import VocabTable from '../VocabPage/components/VocabTable';
import VocabFilters from '../VocabPage/components/VocabFilters';
import VocabModal from './components/AdminVocabModal';
import AdminVocabImportModal from './components/AdminVocabImportModal';
import type { Vocab, VocabStatus } from '@/types/vocab.type';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function AdminVocabPage() {
  const [search, setSearch] = useState('');
  const [toeicTopic, setToeicTopic] = useState('');
  const [status, setStatus] = useState<VocabStatus | 'ALL'>('ALL'); // Not strictly needed for system vocabs but kept for filter compatibility

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingVocab, setEditingVocab] = useState<Vocab | null>(null);
  
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    vocabId: string | null;
  }>({ isOpen: false, vocabId: null });

  const { data: vocabsData, isLoading } = useAdminVocabs({
    search: search || undefined,
    toeicTopic: toeicTopic || undefined,
    page: 1,
    limit: 100
  });

  const { mutateAsync: deleteVocab } = useDeleteAdminVocab();

  const handleAddClick = () => {
    setEditingVocab(null);
    setIsModalOpen(true);
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleEditClick = (vocab: Vocab) => {
    setEditingVocab(vocab);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmState({ isOpen: true, vocabId: id });
  };

  const executeDelete = async () => {
    if (!confirmState.vocabId) return;
    try {
      await deleteVocab(confirmState.vocabId);
      toast.success('Xóa từ vựng thành công');
    } catch (error) {
      // Handled by interceptor
    } finally {
      setConfirmState({ isOpen: false, vocabId: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Từ vựng hệ thống</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý kho từ vựng chung của hệ thống.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden flex flex-col h-full">
        <div className="bg-zinc-50/50 dark:bg-zinc-900/20 p-4 border-b border-dashed">
          <VocabFilters 
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            toeicTopic={toeicTopic}
            setToeicTopic={setToeicTopic}
            onAddClick={handleAddClick}
            onImportClick={handleImportClick}
          />
        </div>
        
        <div className="p-4 flex-1">
          <VocabTable 
            vocabs={vocabsData?.data || []} 
            isLoading={isLoading} 
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <VocabModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vocab={editingVocab} 
      />

      <AdminVocabImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />

      <ConfirmDialog
        open={confirmState.isOpen}
        onOpenChange={(isOpen) => setConfirmState(prev => ({ ...prev, isOpen }))}
        onConfirm={executeDelete}
        title="Xác nhận xóa"
        description="Xóa từ vựng hệ thống sẽ làm ảnh hưởng đến các người dùng đang tham chiếu (nếu có sau này). Bạn có chắc không?"
        variant="destructive"
      />
    </div>
  );
}
