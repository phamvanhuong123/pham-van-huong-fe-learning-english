import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Volume2 } from 'lucide-react'
import type { Vocab } from '@/types/vocab.type'
import { playVocabAudio } from '@/utils/audioHelper'

interface VocabTableProps {
  vocabs: Vocab[]
  isLoading: boolean
  onEdit: (vocab: Vocab) => void
  onDelete: (id: string) => void
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  LEARNING: 'bg-yellow-100 text-yellow-800',
  REVIEW: 'bg-orange-100 text-orange-800',
  MASTERED: 'bg-green-100 text-green-800',
}

const statusLabels: Record<string, string> = {
  NEW: 'Từ mới',
  LEARNING: 'Đang học',
  REVIEW: 'Chờ ôn tập',
  MASTERED: 'Đã thuộc',
}

export default function VocabTable({ vocabs, isLoading, onEdit, onDelete }: VocabTableProps) {
  if (isLoading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>
  }

  if (vocabs.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-md">
        Chưa có từ vựng nào. Hãy thêm từ mới để bắt đầu học!
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Từ vựng</TableHead>
            <TableHead>Nghĩa</TableHead>
            <TableHead>Chủ đề</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ôn tập tiếp</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vocabs.map((vocab) => (
            <TableRow key={vocab.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {vocab.word}
                  <span className="text-xs text-muted-foreground">{vocab.phonetic}</span>
                  <button
                    onClick={() => playVocabAudio(vocab.audioUrl, vocab.word)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate" title={vocab.meaning}>
                {vocab.meaning}
              </TableCell>
              <TableCell>
                {vocab.toeicTopic && <Badge variant="outline">{vocab.toeicTopic}</Badge>}
              </TableCell>
              <TableCell>
                <Badge
                  className={statusColors[vocab.schedule?.status || 'NEW']}
                  variant="secondary"
                >
                  {statusLabels[vocab.schedule?.status || 'NEW']}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {vocab.schedule?.nextReviewAt
                  ? new Date(vocab.schedule.nextReviewAt).toLocaleDateString()
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(vocab)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => onDelete(vocab.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
