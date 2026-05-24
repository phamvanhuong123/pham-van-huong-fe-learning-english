import { useEffect, useRef, useState } from 'react';
import { useClientExamStore } from '../store/useClientExamStore';
import { autoSaveExamApi } from '../services/clientExamService';
import { toast } from 'sonner';

export const useExamAutoSave = () => {
  const { examId, resultId, answers, timeTaken, tabSwitchCount, status } = useClientExamStore();
  const [isSaving, setIsSaving] = useState(false);
  const lastAnswersRef = useRef<Record<string, string>>({});

  useEffect(() => {
    // Chỉ chạy autosave khi đang thi
    if (status !== 'IN_PROGRESS' || !examId || !resultId) return;

    const interval = setInterval(async () => {
      // Nếu đang trong quá trình save của chu kỳ trước thì bỏ qua (chống Race Condition)
      if (isSaving) return;

      // Tính diff
      const currentAnswers = answers;
      const prevAnswers = lastAnswersRef.current;

      const hasChanges = Object.keys(currentAnswers).length !== Object.keys(prevAnswers).length ||
        Object.keys(currentAnswers).some(key => currentAnswers[key] !== prevAnswers[key]);

      if (hasChanges) {
        try {
          setIsSaving(true);
          await autoSaveExamApi(examId, {
            resultId,
            answers: currentAnswers,
            timeTaken,
            tabSwitchCount
          });
          // Lưu lại bản nháp đã gửi thành công
          lastAnswersRef.current = { ...currentAnswers };
        } catch (error) {
          console.error("Lỗi Autosave:", error);
          toast.error("Mất kết nối mạng. Hệ thống đang tạm lưu offline.", { duration: 3000, id: 'autosave-err' });
        } finally {
          setIsSaving(false);
        }
      }
    }, 30000); // Mỗi 30 giây

    return () => clearInterval(interval);
  }, [examId, resultId, answers, timeTaken, tabSwitchCount, status, isSaving]);

  return { isSaving };
};
