import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import type { CreateProjectPayload, ProjectSearchParams } from '@/types/project'
import {
  createProject,
  deleteProject,
  fetchMyProject,
  fetchProjectById,
  fetchProjects,
  updateProject,
} from '@/utils/api/project'

/**
 * 프로젝트 목록 조회 (페이지네이션 + 검색 조건)
 */
export const useProjects = (filter: ProjectSearchParams) => {
  return useQuery({
    queryKey: ['projects', filter] as const,
    queryFn: () => fetchProjects(filter),
  })
}

/** 프로젝트 상세 조회 */
export const useProjectById = (id: string) => {
  return useQuery({
    queryKey: ['project', id] as const,
    queryFn: () => fetchProjectById(id),
    enabled: Boolean(id),
  })
}

/** 프로젝트 등록 */
export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

/** 프로젝트 수정 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: string; payload: CreateProjectPayload }) =>
      updateProject(params.id, params.payload),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', project._id] })
    },
  })
}

/** 프로젝트 삭제 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.removeQueries({ queryKey: ['project', id] })
    },
  })
}

export const useGetMyProject = () => {
  return useInfiniteQuery({
    queryKey: ['my-projects'],
    queryFn: ({ pageParam }) => fetchMyProject(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // console.log('LAST:', lastPage)
      // console.log('ALL:', allPages)
      const nextPage = allPages.length + 1
      return nextPage <= lastPage.totalPages ? nextPage : undefined
    },
  })
}
