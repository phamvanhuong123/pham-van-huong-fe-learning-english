import authorizedAxiosInstance from '@/utils/authorizeAxios'
import type { Vocab } from '@/types/vocab.type'

const API_ROOT = '/vocab/flashcard'

export interface StudySession {
  id: string
  userId: string
  startedAt: string
  totalCards: number
  completedCards: number
}

export const vocabFlashcardService = {
  getTodayCards(limit = 50): Promise<Vocab[]> {
    return authorizedAxiosInstance
      .get<{ data: Vocab[] }>(`${API_ROOT}/today`, { params: { limit } })
      .then((res) => res.data.data)
  },

  startSession(totalCards: number) {
    return authorizedAxiosInstance
      .post<StudySession>(`${API_ROOT}/session`, { totalCards })
      .then((res) => res.data)
  },

  reviewCard(vocabId: string, rating: number, sessionId?: string) {
    return authorizedAxiosInstance
      .post(`${API_ROOT}/${vocabId}/review`, { rating, sessionId })
      .then((res) => res.data)
  },

  endSession(sessionId: string) {
    return authorizedAxiosInstance
      .put<StudySession>(`${API_ROOT}/session/${sessionId}/end`)
      .then((res) => res.data)
  },
}
