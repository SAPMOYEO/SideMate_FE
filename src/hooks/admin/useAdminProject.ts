import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProjectList, updateProjectHiddenStatus } from '@/utils/api/admin'
import type { ParamsTypes } from '@/types/common.type'

const ADMIN_PROJECT_BASE_KEY = ['projects'] as const

export const useAdminProject = ({
  page = 1,
  limit = 5,
  search = '',
  sort = '-createdAt',
}: ParamsTypes = {}) =>
  useQuery({
    queryKey: [...ADMIN_PROJECT_BASE_KEY, page, limit, search, sort],
    queryFn: () => getProjectList({ page, limit, search, sort }),
  })

export const useAdminProjectChangeHidden = ({
  id,
  hiddenYn,
}: {
  id: string
  hiddenYn: boolean
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => updateProjectHiddenStatus(id, hiddenYn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROJECT_BASE_KEY })
    },
  })
}
