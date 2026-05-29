import { QuestionBankContainer } from './components/QuestionBankContainer';

export default function QuestionBankPage() {
  return (
    <div className="p-6 h-full flex flex-col space-y-6 bg-background">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Ngân hàng Câu hỏi</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-3xl">
          Quản lý toàn bộ câu hỏi trên hệ thống. Dễ dàng tra cứu câu hỏi độc lập (Part 5) hoặc quản lý cấu trúc nhóm câu hỏi phức tạp (Part 1, 2, 3, 4, 6, 7).
        </p>
      </div>

      <QuestionBankContainer />
    </div>
  );
}
