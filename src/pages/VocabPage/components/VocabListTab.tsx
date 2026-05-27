import { useState } from 'react';
import VocabStatsBar from './VocabStatsBar';
import VocabFilters from './VocabFilters';
import VocabTable from './VocabTable';
import VocabModal from './VocabModal';
import VocabImportModal from './VocabImportModal';
import { useVocabs, useDeleteVocab } from '@/hooks/queries/useVocabQuery';
import type { VocabStatus, Vocab } from '@/types/vocab.type';
import { toast } from 'sonner';

export default function VocabListTab() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<VocabStatus | 'ALL'>('ALL');
  const [toeicTopic, setToeicTopic] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingVocab, setEditingVocab] = useState<Vocab | null>(null);

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

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa từ vựng này không?')) {
      try {
        await deleteVocab(id);
        toast.success('Xóa từ vựng thành công');
      } catch (error) {
        // Error handled by interceptor
      }
    }
  };

  return (
    <div className="space-y-6">
      <VocabStatsBar />
      
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
    </div>
  );
}
