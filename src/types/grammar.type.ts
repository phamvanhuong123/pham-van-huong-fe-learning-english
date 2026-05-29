export interface GrammarTopic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    questions: number;
  };
  progress?: {
    score: number;
    correctQ: number;
    totalQ: number;
    xpEarned: number;
    lastPracticed: string;
  } | null;
}

export interface GrammarQuestionOption {
  id: string;
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface GrammarQuestion {
  id: string;
  questionText: string | null;
  options: GrammarQuestionOption[];
}

export interface GrammarSession {
  id: string;
  userId: string;
  grammarTopicId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  totalQ: number;
  startedAt: string;
}

export interface GrammarPracticeStartResponse {
  session: GrammarSession;
  topic: GrammarTopic;
  questions: GrammarQuestion[];
}

export interface GrammarAnswerResponse {
  isCorrect: boolean;
  correctLabel?: 'A' | 'B' | 'C' | 'D';
  explanation: string | null;
}

export interface CreateGrammarTopicInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateGrammarTopicInput extends Partial<CreateGrammarTopicInput> {}
