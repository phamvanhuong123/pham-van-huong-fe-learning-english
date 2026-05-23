export type ExamPart = 'PART1' | 'PART2' | 'PART3' | 'PART4' | 'PART5' | 'PART6' | 'PART7' | 'FULL';
export type ExamType = 'FREE' | 'VIP';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface AdminExamItem {
  id: string;
  title: string;
  description?: string;
  part: ExamPart;
  difficulty: QuestionDifficulty;
  type: ExamType;
  duration: number;
  isPublished: boolean;
  questionCount: number;
  parentExamId?: string | null;
  childExams?: { id: string; part: ExamPart; title: string; questionCount: number }[];
}

export interface ExamCreateBody {
  title: string;
  description?: string;
  part: ExamPart;
  difficulty: QuestionDifficulty;
  type: ExamType;
  duration: number;
  childrenIdExam?: string[];
}
