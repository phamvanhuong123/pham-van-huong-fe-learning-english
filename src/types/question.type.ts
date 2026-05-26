import type { ExamPart, QuestionDifficulty } from './exam.type'

export type MediaType = 'IMAGE' | 'AUDIO' | 'VIDEO' | 'TEXT'
export type PassageType = 'SINGLE' | 'DOUBLE' | 'TRIPLE'

export interface QuestionOption {
  label: string // 'A' | 'B' | 'C' | 'D'
  text: string
  isCorrect: boolean
}

export interface StandaloneQuestion {
  id: string
  examId: string
  order: number
  questionText: string
  difficulty: QuestionDifficulty
  explanation?: string
  options: QuestionOption[]
  isGroup: false
}

// ============================================================
// Passage (Part 1-4, 6-7)
// ============================================================
export interface Passage {
  id?: string
  mediaType: MediaType
  mediaUrl?: string
  content?: string
  transcript?: string // Lời thoại (Part 3, 4) hoặc Bản dịch (Part 6, 7)
  order: number
  // Client-side only (lazy upload)
  mediaFile?: File
  previewUrl?: string
}

// ============================================================
// Question inside a Group
// ============================================================
export interface GroupQuestion {
  id?: string
  order: number
  questionText: string
  difficulty: QuestionDifficulty
  explanation?: string
  options: QuestionOption[]
}

// ============================================================
// Question Group (Part 1-4, 6-7)
// ============================================================
export interface QuestionGroup {
  id: string
  examId: string
  passageType: PassageType
  passages: Passage[]
  questions: GroupQuestion[]
  isGroup: true
}

// ============================================================
// Union type for table rows
// ============================================================
export type QuestionRow = StandaloneQuestion | QuestionGroup

// ============================================================
// Query Params
// ============================================================
export interface QuestionQueryParams {
  page: number
  limit: number
  search?: string
  examId?: string
  difficulty?: string
  part?: ExamPart | string
}

// ============================================================
// API Response
// ============================================================
export interface QuestionPagination {
  total: number
  totalPages: number
  currentPage: number
}

export interface QuestionsResponse {
  questions: QuestionRow[]
  pagination: QuestionPagination
}

// ============================================================
// Form Payloads
// ============================================================
export interface StandaloneQuestionPayload {
  examId: string
  order: number
  questionText: string
  difficulty: QuestionDifficulty
  explanation?: string
  options: QuestionOption[]
}

export interface QuestionGroupPayload {
  examId: string
  passageType: PassageType
  passages: Omit<Passage, 'mediaFile' | 'previewUrl'>[]
  questions: GroupQuestion[]
}
