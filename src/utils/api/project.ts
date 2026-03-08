import type {
  CreateProjectPayload,
  CreateProjectRes,
  DeleteProjectRes,
  Project,
  ProjectDetailRes,
  ProjectRes,
  ProjectSearchParams,
} from '@/types/project'
import api from './api.instance'
import type { ProjectResponse } from '@/types/project.type'
import type { PaginatedResponse, ParamsTypes } from '@/types/common.type'

/** 프로젝트 목록 조회 (페이지네이션 + 검색 조건) */
export const fetchProjects = async (
  filter: ProjectSearchParams
): Promise<ProjectRes> => {
  const { data } = await api.get('/project', { params: { filter } })
  return data
}

/** 프로젝트 상세 조회 */
export const fetchProjectById = async (id: string): Promise<Project> => {
  const { data } = await api.get<ProjectDetailRes>(`/project/${id}`)
  return data.data
}

/** 프로젝트 등록 */
export const createProject = async (
  payload: CreateProjectPayload
): Promise<Project> => {
  const { data } = await api.post<CreateProjectRes>('/project', payload)
  return data.project
}

/** 프로젝트 수정 */
export const updateProject = async (
  id: string,
  payload: CreateProjectPayload
): Promise<Project> => {
  const { data } = await api.put<CreateProjectRes>(`/project/${id}`, payload)
  return data.project
}

/** 프로젝트 삭제 */
export const deleteProject = async (id: string): Promise<DeleteProjectRes> => {
  const { data } = await api.delete<DeleteProjectRes>(`/project/${id}`)
  return data
}

export const getProjectList = async ({
  page = 1,
  limit = 5,
  search = '',
  sort = '-createdAt',
}: ParamsTypes = {}): Promise<PaginatedResponse<ProjectResponse>> => {
  const { data } = await api.get('/admin/projects', {
    params: {
      page,
      limit,
      sort,
      ...(search && { query: search }),
    },
  })
  return data
}

export const updateProjectHiddenStatus = async (
  projectId: string,
  hiddenYn: boolean
) => {
  try {
    const { data } = await api.patch(`/admin/projects/${projectId}/hidden`, {
      hiddenYn,
    })
    return data
  } catch (err) {
    console.error('Error updating project hidden status:', err)
    throw err // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
}
