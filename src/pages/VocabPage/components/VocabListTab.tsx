import { useState } from 'react';
import VocabFilters from './VocabFilters';
import VocabTable from './VocabTable';
import VocabModal from './VocabModal';
import VocabImportModal from './VocabImportModal';
import { useVocabs, useDeleteVocab } from '@/hooks/queries/useVocabQuery';
import type { VocabStatus, Vocab } from '@/types/vocab.type';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function VocabListTab() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<VocabStatus | 'ALL'>('ALL');
  const [toeicTopic, setToeicTopic] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingVocab, setEditingVocab] = useState<Vocab | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    vocabId: string | null;
  }>({ isOpen: false, vocabId: null });

  // Queries
  const { data: vocabsData, isLoading } = useVocabs({
    search: search || undefined,
    status: status !== 'ALL' ? status : undefined,
    toeicTopic: toeicTopic || undefined,
    page: 1,
    limit: 100 // Tạm thời load 100 từ
  });

  const { mutateAsync: deleteVocab } = useDeleteVocab();

  // Handlers
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
      // Error handled by interceptor
    } finally {
      setConfirmState({ isOpen: false, vocabId: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-sm border p-6">
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

        <VocabTable
          vocabs={vocabsData?.data || []}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      <VocabModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vocab={editingVocab}
      />

      <VocabImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <ConfirmDialog
        open={confirmState.isOpen}
        onOpenChange={(isOpen) => setConfirmState(prev => ({ ...prev, isOpen }))}
        onConfirm={executeDelete}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa từ vựng này không? Hành động này không thể hoàn tác."
        variant="destructive"
      />
    </div>
  );
}
