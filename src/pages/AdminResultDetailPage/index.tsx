import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { useMemo } from 'react'

function AdminResultDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminResultDetails', id],
    queryFn: () => adminService.getAdminResultDetails(id as string),
    enabled: !!id,
  })

  const parts = useMemo(() => {
    if (!result?.resultDetails) return []
    const grouped = result.resultDetails.reduce((acc: any, detail: any) => {
      const rawPart = detail.question?.part
      const part = rawPart ? rawPart.replace('PART', 'Part ') : 'Khác'
      if (!acc[part]) acc[part] = []
      acc[part].push(detail)
      return acc
    }, {})
    return Object.keys(grouped).sort()
  }, [result])

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-rose-500 min-h-[50vh]">
        <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-bold">Lỗi khi tải chi tiết bài thi</h3>
        <p className="mt-2">Bài thi không tồn tại hoặc có lỗi xảy ra.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          Chi tiết Bài làm
          {result?.isFullTest && (
            <Badge variant="default" className="bg-blue-600 text-sm">
              Full Test
            </Badge>
          )}
        </h2>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Học viên</p>
            <p className="font-semibold">{result?.user?.name || result?.user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Đề thi</p>
            <p className="font-semibold">{result?.exam?.title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tổng điểm</p>
            <p className="font-semibold text-primary">{result?.score}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Số câu đúng</p>
            <p className="font-semibold text-emerald-600">
              {result?.correctQ} / {result?.totalQ}
            </p>
          </div>
          {result?.isFullTest && (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reading Score</p>
                <p className="font-semibold">{result?.readingScore}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Listening Score</p>
                <p className="font-semibold">{result?.listeningScore}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <Tabs defaultValue={parts[0]} className="w-full">
          <div className="px-6 py-4 border-b bg-muted/20">
            <TabsList className="w-full flex justify-start overflow-x-auto h-auto p-1">
              {parts.map((part) => (
                <TabsTrigger key={part} value={part} className="px-6 py-2">
                  {part}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-6 bg-muted/5 min-h-[500px]">
            {parts.map((part) => (
              <TabsContent
                key={part}
                value={part}
                className="space-y-6 mt-0 focus-visible:outline-none"
              >
                {result.resultDetails
                  .filter((d: any) => {
                    const rawPart = d.question?.part
                    const label = rawPart ? rawPart.replace('PART', 'Part ') : 'Khác'
                    return label === part
                  })
                  .map((detail: any) => {
                    const q = detail.question
                    const correctOption = q.options?.find((o: any) => o.isCorrect)

                    return (
                      <div
                        key={detail.id}
                        className={`p-6 rounded-xl border-2 transition-all ${detail.isCorrect ? 'border-emerald-200/50 bg-emerald-50/30 hover:border-emerald-300' : 'border-rose-200/50 bg-rose-50/30 hover:border-rose-300'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex-shrink-0">
                            {detail.isCorrect ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : (
                              <XCircle className="w-6 h-6 text-rose-500" />
                            )}
                          </div>
                          <div className="flex-1 space-y-4">
                            {q.passageGroup?.passages?.length > 0 && (
                              <div className="space-y-4 mb-4">
                                {q.passageGroup.passages.map((passage: any) => (
                                  <div
                                    key={passage.id}
                                    className="p-4 bg-background rounded-xl border border-border shadow-sm"
                                  >
                                    {passage.mediaType === 'AUDIO' && passage.mediaUrl && (
                                      <audio
                                        controls
                                        src={passage.mediaUrl}
                                        className="w-full mb-3 h-10 outline-none"
                                      />
                                    )}
                                    {passage.mediaType === 'IMAGE' && passage.mediaUrl && (
                                      <img
                                        src={passage.mediaUrl}
                                        alt="Question Media"
                                        className="max-w-full rounded-lg mb-3 max-h-80 object-contain border"
                                      />
                                    )}
                                    {passage.content && (
                                      <div
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: passage.content }}
                                      />
                                    )}
                                    {passage.transcript && (
                                      <div className="mt-3 p-3 bg-muted/30 rounded-lg text-sm border border-border/50">
                                        <span className="font-semibold text-primary block mb-1">
                                          Transcript / Bản dịch:
                                        </span>
                                        <div
                                          className="whitespace-pre-wrap leading-relaxed"
                                          dangerouslySetInnerHTML={{ __html: passage.transcript }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="font-medium text-lg leading-relaxed">
                              <span className="mr-2 text-muted-foreground">Câu {q.order}:</span>
                              {q.questionText || (
                                <span className="text-muted-foreground italic">
                                  Câu hỏi hình ảnh / audio
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                              {(q.options || []).map((opt: any) => {
                                const isSelected = detail.selectedLabel === opt.label
                                const isCorrect = opt.isCorrect

                                let bgClass = 'bg-background border-border hover:bg-muted/50'
                                if (isSelected && isCorrect)
                                  bgClass =
                                    'bg-emerald-100 border-emerald-400 text-emerald-900 font-medium shadow-sm'
                                else if (isSelected && !isCorrect)
                                  bgClass =
                                    'bg-rose-100 border-rose-400 text-rose-900 font-medium shadow-sm'
                                else if (!isSelected && isCorrect)
                                  bgClass =
                                    'bg-emerald-50/50 border-emerald-300 border-dashed text-emerald-700'

                                return (
                                  <div
                                    key={opt.id}
                                    className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${bgClass}`}
                                  >
                                    <span
                                      className={`font-bold w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-sm ${isSelected ? 'bg-white/80' : 'bg-muted'}`}
                                    >
                                      {opt.label}
                                    </span>
                                    <span className="flex-1 mt-0.5">{opt.text}</span>
                                  </div>
                                )
                              })}
                            </div>

                            {!detail.selectedLabel && (
                              <div className="text-sm font-medium text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100 mt-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Học viên bỏ trống câu này. Đáp án đúng là{' '}
                                <span className="font-bold">{correctOption?.label}</span>.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminResultDetailPage
