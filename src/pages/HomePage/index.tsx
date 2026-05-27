import { Link } from 'react-router';
import { ArrowRight, BookOpen, Crown, FileText, GraduationCap, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export default function HomePage() {
  const { userInfo } = useAuthStore();
  const isVip = userInfo?.isVip;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-violet-500/40 blur-[100px] rounded-full mix-blend-multiply animate-pulse" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/30 blur-[80px] rounded-full mix-blend-multiply" />
        </div>

        <div className="container px-4 relative z-10 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span>Nền tảng luyện thi TOEIC số 1</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Chinh phục TOEIC <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">
              nhanh chóng & hiệu quả
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Hệ thống luyện đề chuẩn cấu trúc thật, kết hợp học từ vựng thông minh qua Flashcard và ngân hàng ngữ pháp trọng tâm. Tất cả những gì bạn cần để đạt điểm cao.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg shadow-primary/25 transition-transform hover:scale-105" asChild>
              <Link to="/exams">
                Bắt đầu làm bài <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            {!isVip && (
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 rounded-full border-primary/20 hover:bg-primary/5 transition-transform hover:scale-105" asChild>
                <Link to="/pricing">
                  <Crown className="mr-2 w-5 h-5 text-yellow-500" /> Khám phá gói PRO
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES ── */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Hệ sinh thái học tập toàn diện</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Không chỉ là luyện đề, TOEIC Master cung cấp cho bạn một lộ trình học tập khép kín từ lúc mất gốc đến khi đạt mục tiêu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Luyện đề thực chiến</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Kho đề thi phong phú được cập nhật theo cấu trúc mới nhất. Thi thử như thi thật với thời gian đếm ngược.
              </p>
              <Link to="/exams" className="text-sm font-medium text-blue-600 inline-flex items-center hover:underline">
                Vào kho đề <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Từ vựng Flashcard</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Học hàng ngàn từ vựng TOEIC chia theo chủ đề. Tích hợp thuật toán thông minh giúp bạn nhớ lâu hơn.
              </p>
              <Link to="/vocab" className="text-sm font-medium text-emerald-600 inline-flex items-center hover:underline">
                Học từ vựng <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ngữ pháp trọng tâm</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Tổng hợp đầy đủ các chủ điểm ngữ pháp chắc chắn sẽ xuất hiện trong bài thi TOEIC kèm bài tập thực hành.
              </p>
              <Link to="/grammar" className="text-sm font-medium text-purple-600 inline-flex items-center hover:underline">
                Ôn ngữ pháp <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lịch sử & Thống kê</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Theo dõi chi tiết lịch sử làm bài, chấm điểm tự động và phân tích sự tiến bộ của bạn qua từng ngày.
              </p>
              <Link to="/history" className="text-sm font-medium text-orange-600 inline-flex items-center hover:underline">
                Xem lịch sử <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIP SECTION ── */}
      <section className="py-24">
        <div className="container px-4 mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border border-purple-500/20">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-50">Tài khoản PRO</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Tối đa hóa điểm số của bạn</h2>
                <p className="text-indigo-100 text-lg mb-8 opacity-90">
                  Nâng cấp lên thẻ thành viên PRO để mở khóa quyền xem giải thích chi tiết đáp án và truy cập không giới hạn vào kho đề thi độc quyền dành riêng cho học viên VIP.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button size="lg" className="bg-white text-purple-900 hover:bg-white/90 shadow-lg text-base h-12 px-8 rounded-full" asChild>
                    <Link to="/pricing">
                      Nâng cấp ngay
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-base h-12 px-8 rounded-full bg-transparent" asChild>
                    <Link to="/profile">
                      Quản lý gói cước
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Illustration/Icon */}
              <div className="hidden md:flex flex-shrink-0 relative">
                <div className="w-48 h-48 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl rotate-12 opacity-20 absolute top-4 right-4 blur-xl" />
                <div className="w-48 h-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl transform transition-transform hover:-translate-y-2 hover:rotate-3">
                  <Crown className="w-24 h-24 text-yellow-400 filter drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t bg-background py-10 text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 rounded flex items-center justify-center bg-primary/20 text-primary">
              <span className="font-bold text-xs">T</span>
            </div>
            <span className="font-bold text-foreground">TOEIC Master</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} TOEIC Master. Nền tảng luyện thi chất lượng cao.
          </p>
        </div>
      </footer>
    </div>
  );
}
