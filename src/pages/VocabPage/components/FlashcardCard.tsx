import type { Vocab } from '@/types/vocab.type';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { playVocabAudio } from '@/utils/audioHelper';

interface FlashcardCardProps {
  vocab: Vocab;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashcardCard({ vocab, isFlipped, onFlip }: FlashcardCardProps) {
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playVocabAudio(vocab.audioUrl || null, vocab.word);
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto h-[400px] sm:h-[450px] cursor-pointer perspective-1000`}
      onClick={!isFlipped ? onFlip : undefined}
    >
      <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-x-180' : ''}`}>
        
        {/* Mặt trước */}
        <div className="absolute w-full h-full backface-hidden bg-card border rounded-2xl shadow-md p-8 flex flex-col items-center justify-center">
          {vocab.toeicTopic && (
            <Badge variant="outline" className="absolute top-4 left-4">
              {vocab.toeicTopic}
            </Badge>
          )}
          <h2 className="text-5xl sm:text-6xl font-bold text-center mb-4">{vocab.word}</h2>
          <div className="flex items-center gap-3 text-2xl text-muted-foreground">
            {vocab.phonetic && <span>{vocab.phonetic}</span>}
            <Button variant="ghost" size="icon" onClick={handlePlayAudio} className="h-10 w-10 rounded-full">
              <Volume2 className="h-6 w-6 text-primary" />
            </Button>
          </div>
          {!isFlipped && (
            <div className="absolute bottom-8 text-muted-foreground animate-pulse">
              Chạm để lật thẻ
            </div>
          )}
        </div>

        {/* Mặt sau */}
        <div className="absolute w-full h-full backface-hidden rotate-x-180 bg-primary/5 border-primary/20 border rounded-2xl shadow-md p-8 flex flex-col items-center justify-center overflow-y-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-2">{vocab.word}</h2>
          <div className="text-xl text-primary font-medium text-center mb-6">{vocab.meaning}</div>
          
          {vocab.example && (
            <div className="w-full bg-background/50 rounded-lg p-4 mb-4 border">
              <div className="text-sm text-muted-foreground font-semibold mb-1">Ví dụ:</div>
              <div className="italic">{vocab.example}</div>
            </div>
          )}
          
          {vocab.collocations && (
            <div className="w-full bg-background/50 rounded-lg p-4 border">
              <div className="text-sm text-muted-foreground font-semibold mb-1">Collocations:</div>
              <div>{vocab.collocations}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
