import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useClientExamStore } from '@/store/useClientExamStore';
import { getExamDetailsForClientApi, startExamApi, submitExamApi } from '@/services/clientExamService';
import { useExamAutoSave } from '@/hooks/useExamAutoSave';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import type { ClientExamData, ClientQuestion } from '@/types/clientExam.type';
import { ExamHeader } from './components/ExamHeader';
import { QuestionPalette } from './components/QuestionPalette';
import { ExamToolbar } from './components/ExamToolbar';

import { Part1Viewer } from './components/viewers/Part1Viewer';
import { Part2Viewer } from './components/viewers/Part2Viewer';
import { Part34Viewer } from './components/viewers/Part34Viewer';
import { Part5Viewer } from './components/viewers/Part5Viewer';
import { Part67Viewer } from './components/viewers/Part67Viewer';

export const ClientExamWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [examData, setExamData] = React.useState<ClientExamData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activePart, setActivePart] = React.useState<string>('');

  const { initExam, setSubmitting, resultId, answers, timeTaken, tabSwitchCount, clearExam } = useClientExamStore();
  useExamAutoSave();
  useAntiCheat();

  useEffect(() => {
    if (!id) return;

    const loadExam = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch đề thi
        const examRes = await getExamDetailsForClientApi(id);
        setExamData(examRes.data.data);


        const storeState = useClientExamStore.getState();
        if (storeState.examId === id && storeState.status === 'IN_PROGRESS' && storeState.resultId) {
          // Bù đắp thời gian gian lận nếu user đóng tab
          storeState.syncOfflineTime();
          // Khôi phục từ Local Storage, KHÔNG start mới!
          return;
        }

        // 2. Start bài thi (Tạo mới)
        const startRes = await startExamApi(id);
        const result = startRes.data.data;

        // Khởi tạo mới hoàn toàn
        initExam(result.id, id, {}, 0, 0);

      } catch (error) {
        toast.error("Lỗi khi tải đề thi");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [id, initExam, navigate]);

  const allQuestions = useMemo(() => {
    if (!examData) return [];
    let qs: ClientQuestion[] = [];
    if (examData.passageGroups) {
      examData.passageGroups.forEach(pg => qs.push(...pg.questions));
    }
    if (examData.questions) {
      qs.push(...examData.questions);
    }
    return qs.sort((a, b) => a.order - b.order);
  }, [examData]);

  // Group data by part
  const groupedData = useMemo(() => {
    if (!examData) return null;
    const groups: Record<string, { passageGroups: typeof examData.passageGroups, questions: typeof examData.questions }> = {};

    examData.passageGroups?.forEach(pg => {
      const part = pg.part || examData.part;
      if (!groups[part]) groups[part] = { passageGroups: [], questions: [] };
      groups[part].passageGroups.push(pg);
    });

    examData.questions?.forEach(q => {
      const part = q.part || examData.part;
      if (!groups[part]) groups[part] = { passageGroups: [], questions: [] };
      groups[part].questions.push(q);
    });

    return groups;
  }, [examData]);

  const availableParts = useMemo(() => {
    if (!groupedData) return [];
    return Object.keys(groupedData).sort();
  }, [groupedData]);

  // Khởi tạo activePart mặc định là Part đầu tiên
  useEffect(() => {
    if (availableParts.length > 0 && !activePart) {
      setActivePart(availableParts[0]);
    }
  }, [availableParts, activePart]);

  const handleSubmit = async (forceSubmit = false) => {
    if (!id || !resultId) return;

    if (!forceSubmit) {
      const answeredCount = Object.keys(answers).length;
      const isConfirm = window.confirm(`Bạn đã làm ${answeredCount}/${allQuestions.length} câu. Bạn có chắc chắn muốn nộp bài?`);
      if (!isConfirm) return;
    }

    try {
      setSubmitting(true);
      await submitExamApi(id, {
        resultId,
        answers,
        timeTaken,
        tabSwitchCount
      });
      toast.success("Nộp bài thành công!");
      clearExam(); // Xoá session lưu tạm sau khi nộp
      navigate(`/results/${resultId}`);
    } catch (error) {
      toast.error("Lỗi khi nộp bài. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !examData) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const renderPartViewers = () => {
    if (!groupedData || !activePart || !groupedData[activePart]) return null;

    const data = groupedData[activePart];
    const part = activePart;

    if (['PART1', 'PART2'].includes(part)) {
      const Viewer = part === 'PART1' ? Part1Viewer : Part2Viewer;
      return data.passageGroups.map(pg => {
        return pg.questions.map(q => <Viewer key={q.id} passageGroup={pg} question={q} />);
      });
    }

    if (['PART3', 'PART4'].includes(part)) {
      return data.passageGroups.map(pg => <Part34Viewer key={pg.id} passageGroup={pg} />);
    }

    if (part === 'PART5') {
      return data.questions.map(q => <Part5Viewer key={q.id} question={q} />);
    }

    if (['PART6', 'PART7'].includes(part)) {
      return data.passageGroups.map(pg => <Part67Viewer key={pg.id} passageGroup={pg} part={part} />);
    }

    return <div>Unsupported Part format: {part}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col">
      <ExamHeader title={examData.title} duration={examData.duration} onSubmit={handleSubmit} />

      {/* Part Navigation Toolbar */}
      <ExamToolbar
        parts={availableParts}
        activePart={activePart}
        onPartClick={(p) => setActivePart(p)}
      />

      <main className="flex-1 container mx-auto px-4 py-8 flex gap-8 items-start relative">
        <div className="flex-1 min-w-0">
          {renderPartViewers()}
        </div>

        <div className="w-80 hidden lg:block shrink-0">
          <QuestionPalette 
            questions={allQuestions} 
            activePart={activePart}
            onNavigateToPart={(p) => setActivePart(p)}
          />
        </div>
      </main>

      {/* Nút Submit cuối trang cho mobile */}
      <div className="lg:hidden p-4 bg-white border-t sticky bottom-0">
        <button
          onClick={() => handleSubmit(false)}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg"
        >
          Nộp Bài ({Object.keys(answers).length}/{allQuestions.length})
        </button>
      </div>
    </div>
  );
};
