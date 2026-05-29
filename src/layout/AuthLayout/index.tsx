import { Outlet } from 'react-router';
import {
  BookOpen,
  Sparkles,
  Trophy,
  GraduationCap,
  Target,
  Compass,
  BrainCircuit,
  Award
} from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="h-screen max-h-screen w-full flex flex-col lg:flex-row bg-background overflow-hidden relative antialiased">

      <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] h-full relative flex-col justify-between p-12 overflow-hidden bg-slate-50 dark:bg-[#0f111a] border-r border-border/40">

   
        <div className="w-100 h-100 rounded-full bg-primary/5 blur-[120px] absolute -top-40 -left-40 animate-aurora-1 pointer-events-none" />
        <div className="w-112.5 h-112.5 rounded-full bg-primary/4 blur-[130px] absolute -right-20 top-1/4 animate-aurora-2 pointer-events-none" />

       
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

      
        <div className="absolute top-[15%] left-[10%] text-slate-300 dark:text-slate-800 animate-float-1 select-none pointer-events-none">
          <BookOpen className="w-12 h-12" />
        </div>
        <div className="absolute top-[25%] right-[15%] text-slate-300 dark:text-slate-800 animate-float-2 select-none pointer-events-none">
          <BrainCircuit className="w-16 h-16" />
        </div>
        <div className="absolute bottom-[35%] left-[15%] text-slate-300 dark:text-slate-800 animate-float-3 select-none pointer-events-none">
          <Compass className="w-10 h-10" />
        </div>
        <div className="absolute bottom-[20%] right-[10%] text-slate-300 dark:text-slate-800 animate-float-1 select-none pointer-events-none">
          <Trophy className="w-14 h-14" />
        </div>
        <div className="absolute top-[48%] left-[8%] text-slate-300 dark:text-slate-800/60 animate-float-2 select-none pointer-events-none">
          <Award className="w-10 h-10" />
        </div>
        <div className="absolute bottom-[45%] right-[12%] text-slate-300 dark:text-slate-800/60 animate-float-3 select-none pointer-events-none">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Header - Brand Identity */}
        <div className="flex items-center gap-3 relative z-10 select-none">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl shadow-sm">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-foreground">TOEIC MASTER</h1>
            <p className="text-[10px] text-muted-foreground/60 tracking-widest font-mono">EDTECH PLATFORM</p>
          </div>
        </div>

        {/* Center Content - Realistic Greeting */}
        <div className="my-auto max-w-lg mx-auto w-full relative z-10 text-left">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/15 text-primary select-none">
              <Sparkles className="w-3.5 h-3.5" />
              Luyện thi trực tuyến hiệu quả
            </span>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight">
              Đồng hành cùng bạn <br />
              trên con đường chinh phục TOEIC
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hệ thống cung cấp thư viện đề thi đa dạng, các bài tập thực hành bám sát cấu trúc đề thi thực tế và công cụ theo dõi tiến trình làm bài chi tiết, giúp bạn nâng cấp điểm số của mình một cách có định hướng và hiệu quả.
            </p>
          </div>
        </div>

        {/* Footer - Static information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground/50 border-t border-border/40 pt-6 relative z-10 select-none">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>TOEIC Master — Hệ thống học tập & rèn luyện trực tuyến</span>
          </div>
        </div>
      </div>


      <div className="w-full lg:w-[42%] xl:w-[40%] h-full overflow-y-auto flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 bg-background relative">

        {/* Soft background aura for Mobile */}
        <div className="lg:hidden w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] absolute top-1/4 -right-10 pointer-events-none" />
        <div className="lg:hidden w-[250px] h-[250px] rounded-full bg-primary/4 blur-[70px] absolute bottom-1/4 -left-10 pointer-events-none" />

        <div className="lg:hidden flex items-center gap-2.5 mb-8 select-none">
          <div className="flex items-center justify-center w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg">
            <Target className="w-5.5 h-5.5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">TOEIC Master</h1>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[400px] relative z-10 animate-fade-in duration-300">
          <Outlet />
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden mt-8 text-center text-xs text-muted-foreground/60 select-none">
          <p>© 2026 TOEIC Master. All rights reserved.</p>
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;