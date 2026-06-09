import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useGetAdminGrammarTopics, useDeleteGrammarTopic } from '@/hooks/queries/useGrammarQuery'
import type { GrammarTopic } from '@/types/grammar.type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Search, Edit2, Trash2, BookOpen, Eye } from 'lucide-react'
import { TopicModal } from './components/TopicModal'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { AdminTableLoading } from '@/components/admin/AdminTableLoading'

function AdminGrammarPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<GrammarTopic | null>(null)

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    topicId: string | null
    topicName: string
  }>({ isOpen: false, topicId: null, topicName: '' })

  const { data, isLoading } = useGetAdminGrammarTopics({ search: searchTerm, limit: 100 })
  const deleteTopic = useDeleteGrammarTopic()

  const handleCreate = () => {
    setEditingTopic(null)
    setIsModalOpen(true)
  }

  const handleEdit = (topic: GrammarTopic) => {
    setEditingTopic(topic)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string, name: string) => {
    setConfirmState({ isOpen: true, topicId: id, topicName: name })
  }

  const executeDelete = () => {
    if (!confirmState.topicId) return
    deleteTopic.mutate(confirmState.topicId, {
      onSuccess: () => {
        toast.success('Đã xóa chủ đề')
        setConfirmState({ isOpen: false, topicId: null, topicName: '' })
      },
      onError: () => {
        toast.error('Không thể xóa chủ đề này')
        setConfirmState({ isOpen: false, topicId: null, topicName: '' })
      },
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Ngữ pháp</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Danh sách các chủ đề ngữ pháp trên hệ thống.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Thêm chủ đề mới
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-xl border border-dashed">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Tìm kiếm chuyên đề..."
            className="pl-9 h-10 bg-background focus-visible:ring-primary/20 transition-all rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tên chủ đề</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Số lượng câu hỏi</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminTableLoading columns={4} rows={5} />
            ) : !data?.data || data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40">
                  <AdminEmptyState
                    title="Không tìm thấy chủ đề"
                    description="Chưa có chủ đề ngữ pháp nào."
                    icon="book"
                  />
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((topic: GrammarTopic) => (
                <TableRow key={topic.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell className="font-medium">
                    {topic.name}
                    {topic.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {topic.description}
                      </p>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/grammar/${topic.id}`)}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2 text-primary" /> Xem câu hỏi
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEdit(topic)}
                          className="cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4 mr-2 text-blue-500" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(topic.id, topic.name)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TopicModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} topic={editingTopic} />

      <ConfirmDialog
        open={confirmState.isOpen}
        onOpenChange={(isOpen) => setConfirmState((prev) => ({ ...prev, isOpen }))}
        onConfirm={executeDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa chủ đề "${confirmState.topicName}"? Các câu hỏi bên trong cũng sẽ bị ảnh hưởng.`}
        variant="destructive"
      />
    </div>
  )
}

export default AdminGrammarPage
