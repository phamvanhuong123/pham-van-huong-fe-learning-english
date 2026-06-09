import { useState } from 'react'
import { useFlashcardStore } from '@/store/useFlashcardStore'
import { vocabSrsApiService } from '@/services/vocabSrsApiService'
import FlashcardCard from './FlashcardCard'
import FlashcardRating from './FlashcardRating'
import FlashcardProgress from './FlashcardProgress'
import VocabDashboard from './VocabDashboard'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function FlashcardTab() {
  const {
    cards,
    currentIndex,
    isFlipped,
    isSessionActive,
    setSession,
    flipCard,
    nextCard,
    endSession,
  } = useFlashcardStore()

  const [isLoading, setIsLoading] = useState(false)
  const [isRating, setIsRating] = useState(false) // prevent double click

  const startSessionForTopic = async (topic: string) => {
    try {
      setIsLoading(true)
      const sessionCards = await vocabSrsApiService.getStudySession(topic, 20) // Học mẻ 20 từ

      if (sessionCards.length === 0) {
        toast.success('Bạn đã hoàn thành mục tiêu cho chủ đề này!')
        return
      }

      setSession(sessionCards)
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi lấy danh sách từ vựng')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRate = async (rating: number) => {
    if (isRating) return

    try {
      setIsRating(true)
      const currentVocab = cards[currentIndex]

      // Gọi API báo kết quả
      const updatedSchedule = await vocabSrsApiService.submitReview(currentVocab.id, rating)

      if (updatedSchedule.status === 'LEARNING') {
        // Nút Lại/Khó (hoặc Tốt nhưng chưa đủ điểm qua cửa): đưa thẻ xuống cuối hàng đợi
        const updatedVocab = {
          ...currentVocab,
          schedule: updatedSchedule,
          previewIntervals: updatedSchedule.previewIntervals,
        }
        useFlashcardStore.getState().requeueCard(updatedVocab)
      }

      // Chuyển thẻ tiếp theo
      nextCard()
    } catch (error) {
      console.error(error)
      toast.error('Lưu kết quả thất bại')
    } finally {
      setIsRating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Đang chuẩn bị bộ bài cho bạn...</p>
      </div>
    )
  }

  if (!isSessionActive) {
    return <VocabDashboard onStartSession={startSessionForTopic} />
  }

  const currentVocab = cards[currentIndex]

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={endSession}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại Thư viện
        </Button>
        <div className="flex-1 max-w-sm mx-4">
          <FlashcardProgress current={currentIndex + 1} total={cards.length} />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <FlashcardCard vocab={currentVocab} isFlipped={isFlipped} onFlip={flipCard} />

        {isFlipped && (
          <div className="w-full max-w-2xl mt-4">
            <FlashcardRating
              onRate={handleRate}
              disabled={isRating}
              previewIntervals={currentVocab.previewIntervals}
            />
          </div>
        )}
      </div>
    </div>
  )
}
