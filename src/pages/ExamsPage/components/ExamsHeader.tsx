import React from 'react'
import { Sparkles } from 'lucide-react'

export const ExamsHeader: React.FC = () => {
  return (
    <div className="relative mb-12 rounded-3xl overflow-hidden bg-gradient-to-b from-blue-50/50 to-white border border-blue-100/50 p-8 md:p-12 shadow-sm text-center">
      {/* Background abstract blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full opacity-40 pointer-events-none">
        <div className="absolute top-0 left-10 w-64 h-64 bg-blue-200 blur-3xl rounded-full mix-blend-multiply opacity-50" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-200 blur-3xl rounded-full mix-blend-multiply opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-6 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cập nhật liên tục đề thi ETS mới nhất</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Thư viện Đề thi Thực chiến
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Làm quen với áp lực phòng thi qua hàng trăm bộ đề chuẩn cấu trúc. Đánh giá chính xác năng
          lực và chinh phục mục tiêu TOEIC của bạn.
        </p>
      </div>
    </div>
  )
}
