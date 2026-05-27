import { useEffect, useState } from 'react';
import { useFlashcardStore } from '@/store/useFlashcardStore';
import { vocabFlashcardService } from '@/services/vocabFlashcardService';
import FlashcardCard from './FlashcardCard';
import FlashcardRating from './FlashcardRating';
import FlashcardProgress from './FlashcardProgress';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function FlashcardTab() {
  const {
    sessionId, cards, currentIndex, isFlipped, isSessionActive,
    setSession, flipCard, nextCard, endSession
  } = useFlashcardStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isRating, setIsRating] = useState(false); // prevent double click
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isSessionActive) {
      vocabFlashcardService.getTodayCards(50).then(cards => {
        setPendingCount(cards.length);
      }).catch(console.error);
    }
  }, [isSessionActive]);

  const startNewSession = async () => {
    try {
      setIsLoading(true);
      const todayCards = await vocabFlashcardService.getTodayCards(50); // limit 50

      if (todayCards.length === 0) {
        setIsLoading(false);
        return; // handle empty state in UI
      }

      const session = await vocabFlashcardService.startSession(todayCards.length);
      setSession(session.id, todayCards);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRate = async (rating: number) => {
    if (isRating || !sessionId) return;

    try {
      setIsRating(true);
      const currentVocab = cards[currentIndex];
      await vocabFlashcardService.reviewCard(currentVocab.id, rating, sessionId);

      if (rating === 1) {
        useFlashcardStore.getState().requeueCard(currentVocab);
      }

      // Chuyển thẻ tiếp theo
      nextCard();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRating(false);
    }
  };

  const handleFinish = async () => {
    if (sessionId) {
      await vocabFlashcardService.endSession(sessionId);
    }
    endSession();
  };

  // Nếu đang loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Đang chuẩn bị bộ thẻ cho bạn...</p>
      </div>
    );
  }

  // Nếu chưa có session active
  if (!isSessionActive) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Sẵn sàng ôn tập?</h2>

        {pendingCount === null ? (
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <Loader2 className="h-4 w-4 animate-spin" /> Đang kiểm tra số từ cần ôn...
          </div>
        ) : pendingCount === 0 ? (
          <div className="mb-8">
            <p className="text-green-600 font-medium mb-2">Tuyệt vời! Bạn không còn từ vựng nào cần ôn tập hôm nay.</p>
            <p className="text-muted-foreground text-sm">Hãy nghỉ ngơi hoặc học thêm từ mới nhé.</p>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-xl font-medium text-primary mb-2">Hôm nay bạn có <span className="font-bold text-2xl">{pendingCount}</span> từ cần ôn tập.</p>
            <p className="text-muted-foreground text-sm">Thuật toán SM-2 đã chuẩn bị sẵn các từ vựng này dựa trên lịch sử học của bạn. Hãy bắt đầu để duy trì trí nhớ nhé!</p>
          </div>
        )}

        <Button size="lg" onClick={startNewSession} className="w-full text-lg h-12" disabled={pendingCount === 0 || pendingCount === null}>
          Bắt đầu phiên học
        </Button>
      </div>
    );
  }

  // Nếu đã học xong tất cả thẻ
  if (currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Chúc mừng!</h2>
        <p className="text-muted-foreground mb-8">
          Bạn đã hoàn thành phiên ôn tập hôm nay.
          Hãy quay lại vào ngày mai nhé.
        </p>
        <Button size="lg" onClick={handleFinish} className="w-full">
          Hoàn tất
        </Button>
      </div>
    );
  }

  const currentVocab = cards[currentIndex];

  return (
    <div className="py-8 flex flex-col items-center">
      <FlashcardProgress current={currentIndex + 1} total={cards.length} />

      <FlashcardCard
        vocab={currentVocab}
        isFlipped={isFlipped}
        onFlip={flipCard}
      />

      <div className={`transition-opacity duration-300 w-full ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <FlashcardRating onRate={handleRate} disabled={isRating} />
      </div>
    </div>
  );
}
