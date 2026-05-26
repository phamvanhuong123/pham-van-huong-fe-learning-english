import type { ExamPart, QuestionDifficulty } from './exam.type';

// ============================================================
// Enums / Unions
// ============================================================
export type ResultStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

// ============================================================
// Response Types
// ============================================================

export interface PartBreakdown {
  total: number;
  correct: number;
}

export interface ResultRecord {
  id: string;
  userId: string;
  examId: string;
  status: ResultStatus;
  score: number;
  totalQ: number;
  correctQ: number;
  timeTaken: number;
  startedAt: string;
  submittedAt: string | null;
  listeningScore: number | null;
  readingScore: number | null;
  listeningCorrect: number | null;
  readingCorrect: number | null;
  tabSwitchCount: number;
  isFullTest: boolean;
  partBreakdown: Record<string, PartBreakdown> | null;
  weakPoints: string[] | null;
  exam?: {
    id: string;
    title: string;
    description: string;
    part: ExamPart;
    difficulty: QuestionDifficulty;
    duration: number;
  };
}

export interface ResultPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ResultHistoryResponse {
  data: ResultRecord[];
  meta: ResultPagination;
}

export interface ReviewOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface ReviewUserAnswer {
  selectedLabel: string | null;
  isCorrect: boolean;
}

export interface ReviewQuestion {
  id: string;
  order: number;
  part: ExamPart | null;
  questionText: string | null;
  difficulty: QuestionDifficulty;
  explanation: string | null;
  options: ReviewOption[];
  userAnswer: ReviewUserAnswer | null;
  note: string | null;
}

export interface ReviewPassage {
  id: string;
  content: string | null;
  transcript: string | null;
  mediaUrl: string | null;
  mediaType: 'TEXT' | 'AUDIO' | 'IMAGE' | 'VIDEO';
  order: number;
}

export interface ReviewPassageGroup {
  id: string;
  passages: ReviewPassage[];
  questions: ReviewQuestion[];
}

export interface ReviewDetailsResponse {
  id: string;
  title: string;
  part: ExamPart;
  duration: number;
  resultSummary: Omit<ResultRecord, 'userId' | 'examId' | 'status' | 'startedAt' | 'submittedAt' | 'exam'>;
  passageGroups: ReviewPassageGroup[];
  questions: ReviewQuestion[];
}
