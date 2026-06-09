import React, { useEffect, useState } from 'react'
import { BookOpen, Calendar, Loader2, Search, Trash2 } from 'lucide-react'
import { getMyNotesApi } from '@/services/profileService'
import { deleteNoteApi } from '@/services/questionService'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import { Input } from '@/components/ui/input'
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog'

interface Note {
  id: string
  questionId: string
  content: string
  updatedAt: string
  question: {
    id: string
    part: string
    questionText: string | null
  }
}

const MyNotebookPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getMyNotesApi()
        if (res.data && res.data.data) {
          const validNotes = res.data.data.filter((note: Note) => note.content.trim() !== '')
          setNotes(validNotes)
        }
      } catch (error) {
        toast.error('Không thể tải Sổ tay cá nhân')
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return
    try {
      setIsDeleting(true)
      await deleteNoteApi(noteToDelete)
      setNotes(notes.filter((note) => note.questionId !== noteToDelete))
      toast.success('Đã xóa ghi chú')
    } catch (error) {
      toast.error('Không thể xóa ghi chú')
    } finally {
      setIsDeleting(false)
      setNoteToDelete(null)
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.question.questionText &&
        note.question.questionText.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" /> Sổ tay cá nhân
          </h1>
          <p className="text-gray-500 mt-1">
            Nơi lưu trữ tất cả các ghi chú và lời giải thích từ AI của bạn.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm ghi chú..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-indigo-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cuốn sổ tay đang trống</h3>
          <p className="text-gray-500">
            Bạn chưa có ghi chú nào. Hãy ôn tập và lưu lại những kiến thức quan trọng nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col h-full relative group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    {note.question.part}
                  </span>
                  <button
                    onClick={() => setNoteToDelete(note.questionId)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    title="Xóa ghi chú"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(note.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </span>
              </div>

              {note.question.questionText && (
                <div className="text-sm font-medium text-gray-800 mb-3 line-clamp-2 italic border-l-2 border-gray-200 pl-3">
                  "{note.question.questionText}"
                </div>
              )}

              <div className="text-sm text-gray-600 prose prose-sm prose-indigo max-w-none flex-grow bg-gray-50 p-3 rounded-lg overflow-y-auto max-h-[350px] mt-3 custom-scrollbar">
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
        onConfirm={confirmDeleteNote}
        title="Xóa ghi chú"
        description="Bạn có chắc chắn muốn xóa ghi chú này? Hành động này không thể hoàn tác."
        isLoading={isDeleting}
      />
    </div>
  )
}

export default MyNotebookPage
