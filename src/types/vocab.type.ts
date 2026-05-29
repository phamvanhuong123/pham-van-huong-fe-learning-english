export type VocabStatus = 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';

export interface VocabSchedule {
  vocabId: string;
  ef: number;
  interval: number;
  repetitions: number;
  nextReviewAt: string;
  lastReviewAt: string | null;
  status: VocabStatus;
}

export interface Vocab {
  id: string;
  userId: string | null;
  word: string;
  meaning: string;
  phonetic: string | null;
  audioUrl: string | null;
  example: string | null;
  toeicTopic: string | null;
  collocations: string | null;
  createdAt: string;
  updatedAt: string;
  schedule?: VocabSchedule;
}

export interface CreateVocabDto {
  word: string;
  meaning: string;
  phonetic?: string;
  audioUrl?: string;
  audioFile?: File | null;
  example?: string;
  toeicTopic?: string;
  collocations?: string;
}

export interface UpdateVocabDto extends Partial<CreateVocabDto> {}

export interface VocabQuery {
  search?: string;
  toeicTopic?: string;
  status?: VocabStatus;
  page?: number;
  limit?: number;
}

export interface VocabStats {
  NEW: number;
  LEARNING: number;
  REVIEW: number;
  MASTERED: number;
}
