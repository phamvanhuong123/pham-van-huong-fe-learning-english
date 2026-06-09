import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vocabService } from '@/services/vocabService'
import type { VocabQuery, CreateVocabDto, UpdateVocabDto } from '@/types/vocab.type'

export const VOCAB_QUERY_KEY = 'vocabs'
export const VOCAB_STATS_KEY = 'vocab_stats'
export const VOCAB_TOPICS_KEY = 'vocab_topics'

export const useVocabs = (query: VocabQuery) => {
  return useQuery({
    queryKey: [VOCAB_QUERY_KEY, query],
    queryFn: () => vocabService.getVocabs(query),
  })
}

export const useVocabStats = () => {
  return useQuery({
    queryKey: [VOCAB_STATS_KEY],
    queryFn: () => vocabService.getVocabStats(),
  })
}

export const useVocabTopics = () => {
  return useQuery({
    queryKey: [VOCAB_TOPICS_KEY],
    queryFn: () => vocabService.getVocabTopics(),
  })
}

export const useCreateVocab = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVocabDto) => vocabService.createVocab(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOCAB_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [VOCAB_STATS_KEY] })
      queryClient.invalidateQueries({ queryKey: [VOCAB_TOPICS_KEY] })
    },
  })
}

export const useUpdateVocab = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVocabDto }) =>
      vocabService.updateVocab(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOCAB_QUERY_KEY] })
    },
  })
}

export const useDeleteVocab = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vocabService.deleteVocab(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOCAB_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [VOCAB_STATS_KEY] })
      queryClient.invalidateQueries({ queryKey: [VOCAB_TOPICS_KEY] })
    },
  })
}

export const useImportVocabCsv = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => vocabService.importCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VOCAB_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [VOCAB_STATS_KEY] })
      queryClient.invalidateQueries({ queryKey: [VOCAB_TOPICS_KEY] })
    },
  })
}
