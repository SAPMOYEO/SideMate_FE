import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
  getUserList,
  updateUser,
  type UpdateUserPayload,
} from '@/utils/api/user'

const ADMIN_USER_BASE_KEY = ['users'] as const

export const useUserList = ({
  page = 1,
  limit = 10,
}: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: [...ADMIN_USER_BASE_KEY, page, limit],
    queryFn: () => getUserList({ page, limit }),
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
