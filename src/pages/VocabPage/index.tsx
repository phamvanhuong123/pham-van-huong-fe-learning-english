import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VocabListTab from './components/VocabListTab';
import FlashcardTab from './components/FlashcardTab';
import { BookOpen, Layers } from 'lucide-react';

function VocabPage() {
  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Từ vựng TOEIC</h1>
        <p className="text-muted-foreground mt-2">Quản lý và ôn tập từ vựng bằng phương pháp Lặp lại ngắt quãng (SM-2).</p>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="list" className="flex items-center gap-2 px-6">
            <BookOpen className="h-4 w-4" /> Danh sách từ vựng
          </TabsTrigger>
          <TabsTrigger value="flashcard" className="flex items-center gap-2 px-6">
            <Layers className="h-4 w-4" /> Ôn tập Flashcard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="m-0">
          <VocabListTab />
        </TabsContent>

        <TabsContent value="flashcard" className="m-0">
          <FlashcardTab />
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default VocabPage;
