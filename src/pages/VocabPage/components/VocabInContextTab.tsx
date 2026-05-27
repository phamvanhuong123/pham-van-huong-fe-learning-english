import { useVocabs } from '@/hooks/queries/useVocabQuery';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playVocabAudio } from '@/utils/audioHelper';

function VocabInContextTab() {
  const { data, isLoading } = useVocabs({ limit: 100 });
  const vocabs = data?.data || [];

  // Chỉ lấy những từ vựng CÓ câu ví dụ
  const vocabsWithContext = vocabs.filter(v => v.example && v.example.trim().length > 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (vocabsWithContext.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-semibold">Chưa có ngữ cảnh nào</h3>
        <p className="text-muted-foreground mt-1">Hãy thêm câu ví dụ (example) cho các từ vựng để học qua ngữ cảnh.</p>
      </div>
    );
  }

  // Hàm highlight từ vựng trong câu ví dụ
  const highlightWord = (text: string, word: string) => {
    if (!word) return text;
    // Dùng regex để tìm từ (không phân biệt hoa thường)
    const regex = new RegExp(`(${word})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <span key={i} className="font-bold text-primary bg-primary/10 px-1 rounded">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Học qua ngữ cảnh thực tế</h2>
        <Badge variant="secondary">{vocabsWithContext.length} câu ví dụ</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vocabsWithContext.map((vocab) => (
          <Card key={vocab.id} className="overflow-hidden hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    {vocab.word}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-primary"
                      onClick={() => playVocabAudio(vocab.audioUrl || null, vocab.word)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {vocab.phonetic && <span className="mr-2">/{vocab.phonetic}/</span>}
                    {vocab.meaning}
                  </p>
                </div>
                {vocab.toeicTopic && (
                  <Badge variant="outline" className="bg-muted">
                    {vocab.toeicTopic}
                  </Badge>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-xl border border-border/50 text-lg leading-relaxed text-foreground/90">
                "{highlightWord(vocab.example!, vocab.word)}"
              </div>
              
              {vocab.collocations && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Thường đi kèm với:</p>
                  <div className="flex flex-wrap gap-2">
                    {vocab.collocations.split(',').map((col, idx) => (
                      <Badge key={idx} variant="secondary" className="font-normal text-xs">
                        {col.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default VocabInContextTab;
