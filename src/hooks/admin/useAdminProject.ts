import { useQuery } from '@tanstack/react-query'
import { getProjectList } from '@/utils/api/project'
import type { ParamsTypes } from '@/types/common.type'

const ADMIN_PROJECT_BASE_KEY = ['projects'] as const

export const useAdminProject = ({
  page = 1,
  limit = 10,
  search = '',
  sort = '-createdAt',
}: ParamsTypes = {}) =>
  useQuery({
    queryKey: [...ADMIN_PROJECT_BASE_KEY, page, limit, search, sort],
    queryFn: () => getProjectList({ page, limit, search, sort }),
  })
