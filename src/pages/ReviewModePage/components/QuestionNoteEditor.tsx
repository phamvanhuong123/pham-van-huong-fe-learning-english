import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, BookmarkPlus } from 'lucide-react';
import { toast } from 'sonner';
import { upsertQuestionNoteApi } from '@/services/resultService';

interface QuestionNoteEditorProps {
  questionId: string;
  initialNote: string | null;
}

export const QuestionNoteEditor: React.FC<QuestionNoteEditorProps> = ({ questionId, initialNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(initialNote || '');
  const [savedNote, setSavedNote] = useState(initialNote || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await upsertQuestionNoteApi(questionId, noteContent);
      setSavedNote(noteContent);
      setIsEditing(false);
      toast.success('Đã lưu ghi chú');
    } catch (error) {
      toast.error('Lỗi khi lưu ghi chú');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNoteContent(savedNote);
    setIsEditing(false);
  };

  if (!isEditing && !savedNote) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        onClick={() => setIsEditing(true)}
      >
        <BookmarkPlus className="w-4 h-4 mr-2" /> Thêm ghi chú cá nhân (từ vựng, ngữ pháp cần nhớ)
      </Button>
    );
  }

  if (!isEditing && savedNote) {
    return (
      <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-200 group relative pr-12">
        <h5 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Ghi chú của bạn</h5>
        <div className="text-gray-800 text-sm whitespace-pre-wrap">{savedNote}</div>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-2 text-yellow-600 hover:bg-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Chỉnh sửa ghi chú</h5>
      <textarea
        className="w-full min-h-[100px] p-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        placeholder="Nhập ghi chú của bạn về câu hỏi này..."
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        disabled={isSaving}
      />
      <div className="flex justify-end gap-2 mt-3">
        <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
          <X className="w-4 h-4 mr-1" /> Hủy
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-1" /> {isSaving ? 'Đang lưu...' : 'Lưu ghi chú'}
        </Button>
      </div>
    </div>
  );
};
