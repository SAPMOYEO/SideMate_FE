import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ApplicationListQuery,
  CreateApplicationPayload,
} from '@/types/application'
import {
  createApplication,
  deleteApplication,
  fetchApplicationsByProjectId,
} from '@/utils/api/application'

/** 프로젝트 지원 생성 */
export const useCreateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) =>
      createApplication(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['project', payload.project] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

/** 지원 취소 */
export const useDeleteApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) => deleteApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

/** 지원 목록 조회 */
export const useApplications = (
  projectId: string,
  query: ApplicationListQuery = {},
  enabled = true
) => {
  return useQuery({
    queryKey: ['applications', projectId, query] as const,
    queryFn: () => fetchApplicationsByProjectId(projectId, query),
    enabled: enabled && Boolean(projectId),
  })
}
