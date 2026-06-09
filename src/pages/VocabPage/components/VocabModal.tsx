import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateVocab, useUpdateVocab, useVocabTopics } from '@/hooks/queries/useVocabQuery'
import type { Vocab, CreateVocabDto } from '@/types/vocab.type'
import { toast } from 'sonner'
import { Volume2 } from 'lucide-react'
import { playVocabAudio } from '@/utils/audioHelper'

interface VocabModalProps {
  isOpen: boolean
  onClose: () => void
  vocab: Vocab | null
}

export default function VocabModal({ isOpen, onClose, vocab }: VocabModalProps) {
  const { data: topics = [] } = useVocabTopics()
  const isEditing = !!vocab

  const [formData, setFormData] = useState<CreateVocabDto>({
    word: '',
    meaning: '',
    phonetic: '',
    audioUrl: '',
    example: '',
    toeicTopic: '',
    collocations: '',
  })

  useEffect(() => {
    if (vocab) {
      setFormData({
        word: vocab.word,
        meaning: vocab.meaning,
        phonetic: vocab.phonetic || '',
        audioUrl: vocab.audioUrl || '',
        example: vocab.example || '',
        toeicTopic: vocab.toeicTopic || '',
        collocations: vocab.collocations || '',
      })
    } else {
      setFormData({
        word: '',
        meaning: '',
        phonetic: '',
        audioUrl: '',
        example: '',
        toeicTopic: '',
        collocations: '',
      })
    }
  }, [vocab, isOpen])

  const { mutateAsync: createVocab, isPending: isCreating } = useCreateVocab()
  const { mutateAsync: updateVocab, isPending: isUpdating } = useUpdateVocab()

  const isSubmitting = isCreating || isUpdating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await updateVocab({ id: vocab.id, data: formData })
        toast.success('Cập nhật từ vựng thành công')
      } else {
        await createVocab(formData)
        toast.success('Thêm từ vựng thành công')
      }
      onClose()
    } catch (error) {
      // Error handled by interceptor
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Sửa từ vựng' : 'Thêm từ vựng mới'}</DialogTitle>
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
                placeholder="/.../"
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
            <Label htmlFor="collocations">Collocations (Cụm từ đi kèm)</Label>
            <Input
              id="collocations"
              value={formData.collocations}
              onChange={(e) => setFormData({ ...formData, collocations: e.target.value })}
              placeholder="e.g. have an impact on..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="toeicTopic">Chủ đề TOEIC</Label>
              <Select
                value={formData.toeicTopic || ''}
                onValueChange={(val) => setFormData({ ...formData, toeicTopic: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audioFile">Upload Audio (Tùy chọn)</Label>
              <div className="flex flex-col gap-3">
                <div className="relative group">
                  <Input
                    id="audioFile"
                    type="file"
                    accept="audio/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setFormData({ ...formData, audioFile: file, audioUrl: '' })
                    }}
                  />
                  <div className="flex items-center gap-3 p-3 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/10 group-hover:bg-muted/40 group-hover:border-primary/50 transition-all">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                      <Volume2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-foreground truncate">
                        {formData.audioFile
                          ? formData.audioFile.name
                          : 'Chọn hoặc kéo thả file âm thanh'}
                      </span>
                      <span className="text-xs text-muted-foreground">Hỗ trợ MP3, WAV</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-tight">
                  Nếu không upload, hệ thống sẽ tự động tạo phát âm (TTS) dựa trên từ vựng.
                </p>

                {vocab?.audioUrl && !formData.audioFile && (
                  <div className="flex items-center justify-between mt-1 bg-primary/5 p-2 px-3 rounded-lg border border-primary/20">
                    <span className="text-xs font-semibold text-primary">Audio hiện tại</span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 flex items-center gap-2"
                      onClick={() =>
                        playVocabAudio(vocab.audioUrl || null, formData.word || vocab.word)
                      }
                    >
                      <Volume2 className="h-4 w-4" /> Nghe thử
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
