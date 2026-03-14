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
import type { PaginatedResponse } from '@/types/common.type'

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

/** 내 프로젝트 가져오기 */

export const fetchMyProject = async (
  page: number
): Promise<PaginatedResponse<Project>> => {
  const { data } = await api.get('/project/me', { params: { page } })
  console.log('fetch :', data)
  return data
}
