import { useGetClientGrammarTopics } from '@/hooks/queries/useGrammarQuery'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, CheckCircle2, PlayCircle, Clock } from 'lucide-react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'

function GrammarPage() {
  const { data: topics, isLoading, isError } = useGetClientGrammarTopics()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="py-8 max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[250px] rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive">Đã xảy ra lỗi</h2>
        <p className="text-muted-foreground mt-2">Không thể tải danh sách chủ đề ngữ pháp.</p>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 md:px-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Ngữ Pháp TOEIC
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
          Nắm chắc các điểm ngữ pháp thường gặp nhất trong kỳ thi TOEIC thông qua các bài luyện tập
          tương tác chuyên sâu.
        </p>
      </div>

      {topics?.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold">Chưa có chủ đề nào</h3>
          <p className="text-muted-foreground mt-1">Các chủ đề ngữ pháp đang được cập nhật.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics?.map((topic, index) => {
            const hasQuestions = topic._count?.questions && topic._count.questions > 0
            const progress = topic.progress
            const progressPercent =
              progress && progress.totalQ > 0
                ? Math.round((progress.correctQ / progress.totalQ) * 100)
                : 0

            const isCompleted = progressPercent === 100

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl leading-tight line-clamp-2">
                        {topic.name}
                      </CardTitle>
                      {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />}
                    </div>
                    {topic.description && (
                      <CardDescription className="line-clamp-2 mt-2">
                        {topic.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {topic._count?.questions || 0} câu hỏi
                        </span>
                        {progress && (
                          <span className="flex items-center gap-1 font-medium text-primary">
                            XP: {progress.xpEarned}
                          </span>
                        )}
                      </div>

                      {progress ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span
                              className={
                                isCompleted ? 'text-green-600 dark:text-green-400' : 'text-primary'
                              }
                            >
                              {isCompleted
                                ? 'Đã thành thạo'
                                : `Đúng ${progress.correctQ}/${progress.totalQ} câu`}
                            </span>
                            <span>{progressPercent}%</span>
                          </div>
                          <Progress
                            value={progressPercent}
                            className={`h-2 ${isCompleted ? '[&>div]:bg-green-500' : ''}`}
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Chưa bắt đầu</span>
                            <span>0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t">
                    <Button
                      className="w-full font-semibold"
                      variant={progress ? 'outline' : 'default'}
                      disabled={!hasQuestions}
                      onClick={() => navigate(`/grammar/${topic.slug}/practice`)}
                    >
                      {!hasQuestions ? (
                        'Đang cập nhật câu hỏi'
                      ) : progress ? (
                        <>
                          <Clock className="mr-2 h-4 w-4" /> Làm lại bài
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" /> Bắt đầu luyện
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default GrammarPage
