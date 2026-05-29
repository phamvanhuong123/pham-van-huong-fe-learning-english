import { Volume2, ImageIcon, FileText, BookOpen, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewPaneProps {
  part: string;
  passages: any[];
  questions: any[];
}

export function PreviewPane({ part, passages, questions }: PreviewPaneProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Info banner */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <Eye className="w-5 h-5 text-blue-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Chế độ xem trước</p>
          <p className="text-xs text-blue-600">Giao diện này mô phỏng chính xác cách học viên sẽ thấy khi làm bài thi.</p>
        </div>
      </div>

      {/* Media / Passage Preview */}
      {passages.length > 0 && (
        <div className="space-y-3">
          {/* ── PART 1 SPECIAL ── */}
          {part === 'PART1' && passages.map((p, pIdx) => {
            const mediaSrc = p.previewUrl || p.mediaUrl;
            return (
              <div key={pIdx} className="space-y-3">
                <div className="rounded-lg border overflow-hidden bg-white shadow-sm">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hình ảnh</span>
                    {p.mediaFile && <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Chờ lưu</span>}
                  </div>
                  <div className="p-4">
                    {mediaSrc ? (
                      <video src={mediaSrc} muted playsInline className="w-full max-h-64 object-contain rounded bg-black/5" />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/40 gap-2">
                        <ImageIcon className="w-10 h-10" /><p className="text-xs">Chưa chọn file video</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border overflow-hidden bg-white shadow-sm">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bài nghe</span>
                  </div>
                  <div className="p-4">
                    {mediaSrc ? <audio src={mediaSrc} controls className="w-full" /> : (
                      <div className="flex flex-col items-center justify-center py-4 text-muted-foreground/40 gap-2">
                        <Volume2 className="w-8 h-8" /><p className="text-xs">Chưa có audio</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── PART 2, 3, 4: Audio / Video theo thứ tự ── */}
          {['PART2', 'PART3', 'PART4'].includes(part) && passages.map((p, pIdx) => {
            const mediaSrc = p.previewUrl || p.mediaUrl;
            return (
              <div key={pIdx} className="rounded-lg border overflow-hidden bg-white shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b">
                  {p.mediaType === 'AUDIO' ? <Volume2 className="w-4 h-4 text-muted-foreground" /> : <ImageIcon className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {p.mediaType === 'AUDIO' ? 'Bài nghe' : 'Video'}
                  </span>
                  {p.mediaFile && <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Chờ lưu</span>}
                </div>
                <div className="p-4">
                  {p.mediaType === 'AUDIO' && mediaSrc && <audio src={mediaSrc} controls className="w-full" />}
                  {p.mediaType === 'VIDEO' && mediaSrc && <video src={mediaSrc} controls className="w-full rounded max-h-56" />}
                  {!mediaSrc && (
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/40 gap-2">
                      <Volume2 className="w-10 h-10" /><p className="text-xs">Chưa chọn file</p>
                    </div>
                  )}
                  {['PART3', 'PART4'].includes(part) && p.transcript && p.transcript !== '<p><br></p>' && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-700 select-none">
                        📝 Xem Transcript / Lời thoại
                      </summary>
                      <div className="mt-2 prose prose-sm max-w-none text-xs text-muted-foreground leading-relaxed p-3 bg-slate-50 rounded-md border border-slate-200"
                        dangerouslySetInnerHTML={{ __html: p.transcript }} />
                    </details>
                  )}
                </div>
              </div>
            );
          })}

          {/* ── PART 6, 7: render theo đúng thứ tự — TEXT inline, IMAGE có frame ── */}
          {['PART6', 'PART7'].includes(part) && (() => {
            const allTranscripts = passages.filter(p => p.transcript && p.transcript !== '<p><br></p>');
            return (
              <div className="rounded-lg border overflow-hidden bg-white shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nội dung bài đọc</span>
                </div>
                <div className="p-4 space-y-4">
                  {passages.map((p, pIdx) => {
                    const mediaSrc = p.previewUrl || p.mediaUrl;
                    if (p.mediaType === 'TEXT') {
                      return p.content && p.content !== '<p><br></p>' ? (
                        <div key={pIdx} className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground"
                          dangerouslySetInnerHTML={{ __html: p.content }} />
                      ) : (
                        <p key={pIdx} className="text-xs text-muted-foreground/40 italic text-center py-2">Chưa có nội dung đoạn văn</p>
                      );
                    }
                    if (p.mediaType === 'IMAGE') {
                      return (
                        <div key={pIdx}>
                          {mediaSrc ? (
                            <img src={mediaSrc} alt="Hình minh hoạ" className="max-h-64 mx-auto rounded object-contain border" />
                          ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/40 gap-2 border rounded">
                              <ImageIcon className="w-10 h-10" /><p className="text-xs">Chưa chọn hình ảnh</p>
                            </div>
                          )}
                          {p.mediaFile && <p className="text-[10px] text-center text-amber-600 mt-1">⏳ Chờ lưu</p>}
                        </div>
                      );
                    }
                    return null;
                  })}

                  {/* Bản dịch / Transcript — gộp tất cả cuối cùng */}
                  {allTranscripts.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700 select-none">
                        🇻🇳 Bản dịch tiếng Việt
                      </summary>
                      <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100 space-y-3">
                        {allTranscripts.map((p, i) => (
                          <div key={i} className="prose prose-sm max-w-none text-xs text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: p.transcript! }} />
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Questions Preview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {questions.length > 1 ? `${questions.length} Câu hỏi` : 'Câu hỏi'}
          </h4>
        </div>
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="rounded-lg border bg-white shadow-sm overflow-hidden">
            {/* Question header */}
            <div className="px-5 py-4 border-b bg-muted/20">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {q.questionText || (
                    <span className="text-muted-foreground/50 italic">
                      {['PART1', 'PART2'].includes(part!) ? 'Câu hỏi được tạo tự động từ nội dung audio / ảnh' : 'Chưa nhập nội dung câu hỏi'}
                    </span>
                  )}
                </p>
              </div>
            </div>
            {/* Options */}
            <div className="p-4 grid grid-cols-1 gap-2">
              {q.options.map((opt: any, optIdx: number) => (
                <div
                  key={optIdx}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border transition-all",
                    opt.isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : "border-border bg-background text-foreground"
                  )}
                >
                  <span className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 border-2",
                    opt.isCorrect
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-muted-foreground/30 text-muted-foreground"
                  )}>
                    {opt.label}
                  </span>
                  <span className={cn("text-sm flex-1", opt.isCorrect && "font-medium")}>
                    {opt.text || <span className="text-muted-foreground/40 italic">Chưa nhập đáp án {opt.label}</span>}
                  </span>
                  {opt.isCorrect && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">✓ Đáp án đúng</span>
                  )}
                </div>
              ))}
            </div>
            {/* Explanation */}
            {q.explanation && q.explanation !== '<p><br></p>' && (
              <div className="px-4 pb-4">
                <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200">
                  <span className="text-xs font-bold text-amber-700 shrink-0 mt-0.5">💡</span>
                  <div 
                    className="prose prose-sm max-w-none text-xs text-amber-900 leading-relaxed [&>p]:m-0"
                    dangerouslySetInnerHTML={{ __html: q.explanation }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
