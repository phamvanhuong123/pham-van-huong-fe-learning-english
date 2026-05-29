// ============================================================
// TOEIC Parts
// ============================================================
export const TOEIC_PARTS = ['PART1', 'PART2', 'PART3', 'PART4', 'PART5', 'PART6', 'PART7'] as const;

export const TOEIC_PART_LABELS: Record<string, string> = {
  PART1: 'Part 1 - Mô tả hình ảnh',
  PART2: 'Part 2 - Hỏi & Đáp',
  PART3: 'Part 3 - Đoạn hội thoại',
  PART4: 'Part 4 - Bài nói ngắn',
  PART5: 'Part 5 - Điền từ vào câu',
  PART6: 'Part 6 - Điền từ vào đoạn văn',
  PART7: 'Part 7 - Đọc hiểu',
};

// ============================================================
// Difficulty
// ============================================================
export const DIFFICULTY_OPTIONS = [
  { value: 'EASY',   label: 'Dễ' },
  { value: 'MEDIUM', label: 'Trung bình' },
  { value: 'HARD',   label: 'Khó' },
] as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  EASY:   'Dễ',
  MEDIUM: 'Trung bình',
  HARD:   'Khó',
};

// ============================================================
// Pagination
// ============================================================
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

// ============================================================
// Single-question parts (không có câu hỏi con)
// ============================================================
export const SINGLE_QUESTION_PARTS = ['PART1', 'PART2', 'PART5'] as const;

// ============================================================
// Media type labels
// ============================================================
export const MEDIA_TYPE_LABELS: Record<string, string> = {
  IMAGE: 'Hình ảnh',
  AUDIO: 'Âm thanh',
  VIDEO: 'Video',
  TEXT:  'Văn bản',
};
