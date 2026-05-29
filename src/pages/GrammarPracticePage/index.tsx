import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useStartPracticeSession, useSubmitGrammarAnswer, useEndPracticeSession } from '@/hooks/queries/useGrammarQuery';
import type { GrammarPracticeStartResponse, GrammarAnswerResponse } from '@/types/grammar.type';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, ArrowRight, Loader2, Trophy, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

function GrammarPracticePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const startSession = useStartPracticeSession();
  const submitAnswer = useSubmitGrammarAnswer();
  const endSession = useEndPracticeSession();

  const [sessionData, setSessionData] = useState<GrammarPracticeStartResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answerResult, setAnswerResult] = useState<GrammarAnswerResponse | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    if (slug) {
      startSession.mutate(slug, {
        onSuccess: (data) => {
          setSessionData(data);
          setStats({ correct: 0, total: data.questions.length });
          setStartTime(Date.now());
        },
        onError: () => {
          toast.error('Không thể bắt đầu bài học. Vui lòng thử lại sau.');
          navigate('/grammar');
        }
      });
    }
  }, [slug]);

  if (!sessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Đang tải bài học...</p>
      </div>
    );
  }

  const handleSelectOption = (label: string) => {
    if (answerResult) return; // Không cho chọn lại nếu đã submit
    setSelectedLabel(label);
  };

  const handleSubmit = () => {
    if (!selectedLabel || !sessionData) return;

    setIsSubmitting(true);
    const currentQuestion = sessionData.questions[currentIndex];
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    submitAnswer.mutate({
      sessionId: sessionData.session.id,
      data: {
        questionId: currentQuestion.id,
        selectedLabel: selectedLabel,
        timeTakenSeconds: timeTaken
      }
    }, {
      onSuccess: (result) => {
        setAnswerResult(result);
        setIsSubmitting(false);
        if (result.isCorrect) {
          setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        }
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
        setIsSubmitting(false);
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < sessionData.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedLabel(null);
      setAnswerResult(null);
      setStartTime(Date.now());
    } else {
      // Kết thúc bài học
      endSession.mutate(sessionData.session.id, {
        onSuccess: () => {
          setIsFinished(true);
          toast.success('Chúc mừng bạn đã hoàn thành bài học!');
        }
      });
    }
  };

  const currentQuestion = sessionData.questions[currentIndex];
  const progressPercent = ((currentIndex + (answerResult ? 1 : 0)) / sessionData.questions.length) * 100;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <Trophy className="h-24 w-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Hoàn thành xuất sắc!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Bạn đã hoàn thành chủ đề <span className="font-semibold text-foreground">{sessionData.topic.name}</span>
          </p>

          <Card className="bg-muted/30 border-dashed mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-primary">{stats.correct}/{stats.total}</div>
                  <div className="text-sm text-muted-foreground mt-1">Câu trả lời đúng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500">+{stats.correct * 5}</div>
                  <div className="text-sm text-muted-foreground mt-1">XP Nhận được</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" onClick={() => navigate('/grammar')} className="w-full sm:w-auto">
            Quay lại danh sách
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 md:px-8 min-h-[80vh] flex flex-col">
      {/* Header & Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate('/grammar')} size="sm">
            Hủy bài học
          </Button>
          <div className="font-medium text-sm text-muted-foreground">
            {currentIndex + 1} / {sessionData.questions.length}
          </div>
        </div>
        <Progress value={progressPercent} className="h-2.5" />
      </div>

      {/* Question Area */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">
              {currentQuestion?.questionText}
            </h2>

            <div className="space-y-3">
              {currentQuestion?.options.map((option) => {
                const isSelected = selectedLabel === option.label;
                let optionStateClass = "border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer";
                let Icon = null;

                if (answerResult) {
                  if (option.label === answerResult.correctLabel) {
                    optionStateClass = "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 cursor-default";
                    Icon = CheckCircle2;
                  } else if (isSelected && !answerResult.isCorrect) {
                    optionStateClass = "border-destructive bg-destructive/10 text-destructive cursor-default";
                    Icon = XCircle;
                  } else {
                    optionStateClass = "opacity-50 cursor-default border-border";
                  }
                } else if (isSelected) {
                  optionStateClass = "border-primary bg-primary/5 border-2";
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.label)}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${optionStateClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold 
                        ${isSelected && !answerResult ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                        ${answerResult && option.label === answerResult.correctLabel ? 'bg-green-500 text-white' : ''}
                        ${answerResult && isSelected && !answerResult.isCorrect ? 'bg-destructive text-white' : ''}
                      `}>
                        {option.label}
                      </div>
                      <span className="text-lg">{option.text}</span>
                    </div>
                    {Icon && <Icon className="h-6 w-6" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Explanation Area */}
      <AnimatePresence>
        {answerResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 p-6 rounded-xl border ${answerResult.isCorrect
                ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-900'
                : 'bg-destructive/10 border-destructive/20'
              }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full mt-1 ${answerResult.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {answerResult.isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${answerResult.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                  {answerResult.isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                </h3>
                {answerResult.explanation ? (
                  <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: answerResult.explanation }} />
                ) : (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Không có giải thích chi tiết cho câu hỏi này.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t flex justify-end">
        {!answerResult ? (
          <Button
            size="lg"
            disabled={!selectedLabel || isSubmitting}
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Kiểm tra'}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleNext}
            className="w-full sm:w-auto px-8"
          >
            {currentIndex < sessionData.questions.length - 1 ? 'Tiếp tục' : 'Hoàn thành'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default GrammarPracticePage;
