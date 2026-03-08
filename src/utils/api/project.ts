import api from './api.instance'
import type { ProjectResponse } from '@/types/project.type'
import type { PaginatedResponse, ParamsTypes } from '@/types/common.type'

export const getProjectList = async ({
  page = 1,
  limit = 10,
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
