import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
  getUserList,
  updateUser,
  type UpdateUserPayload,
} from '@/utils/api/admin'

const ADMIN_USER_BASE_KEY = ['users'] as const

export const useUserList = ({
  page = 1,
  limit = 10,
  search = '',
  sort = '-createdAt',
}: { page?: number; limit?: number; search?: string; sort?: string } = {}) =>
  useQuery({
    queryKey: [...ADMIN_USER_BASE_KEY, page, limit, search, sort],
    queryFn: () => getUserList({ page, limit, search, sort }),
  })

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_BASE_KEY })
    },
  })
}
