import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ApplicationListQuery,
  CreateApplicationPayload,
} from '@/types/application'
import {
  createApplication,
  deleteApplication,
  fetchApplicationsByProjectId,
  fetchMyApplication,
  updateApplicationStatus,
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

/** 지원한 프로젝트 조회 */

export const useMyApplication = () => {
  return useQuery({
    queryKey: ['applications'] as const,
    queryFn: () => fetchMyApplication(),
  })
}

/** 지원자 승인 및 거절*/

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: 'APPROVED' | 'REJECTED'
    }) => updateApplicationStatus({ applicationId: id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
