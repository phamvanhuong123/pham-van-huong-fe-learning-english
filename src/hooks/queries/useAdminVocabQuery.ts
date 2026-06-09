import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import type { CreateVocabDto, UpdateVocabDto } from '@/types/vocab.type'

export const ADMIN_VOCAB_QUERY_KEY = 'admin_vocabs'

export const useAdminVocabs = (query: any) => {
  return useQuery({
    queryKey: [ADMIN_VOCAB_QUERY_KEY, query],
    queryFn: () => adminService.getSystemVocabs(query),
  })
}

export const useCreateAdminVocab = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVocabDto) => adminService.createSystemVocab(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_VOCAB_QUERY_KEY] })
    },
  })
}

export const useUpdateAdminVocab = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVocabDto }) =>
      adminService.updateSystemVocab(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_VOCAB_QUERY_KEY] })
    },
  })
}

export const useDeleteAdminVocab = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteSystemVocab(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_VOCAB_QUERY_KEY] })
    },
  })
}

export const useImportAdminVocabCsv = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => adminService.importSystemCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_VOCAB_QUERY_KEY] })
    },
  })
}
