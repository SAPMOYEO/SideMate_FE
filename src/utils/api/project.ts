import api from './api.instance'
import type { ProjectResponse } from '@/types/project.type'
import type { PaginatedResponse, ParamsTypes } from '@/types/common.type'

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
