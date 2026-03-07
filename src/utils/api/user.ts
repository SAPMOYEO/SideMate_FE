import api from './api.instance'
import type { UserResponse } from '@/types/user'

// ---------------- 유저 관련 API (admin) ----------------
export interface UserListResponse {
  data: UserResponse[]
  totalCount: number
  totalPages: number
  todayCount: number
}

export const getUserList = async ({
  page = 1,
  limit = 10,
}: {
  page?: number
  limit?: number
} = {}): Promise<UserListResponse> => {
  const { data } = await api.get('/admin/users', { params: { page, limit } })
  return data
}

export type UpdateUserPayload = {
  role?: UserResponse['role']
  isActive?: boolean
}

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<UserResponse> => {
  const { data } = await api.patch(`/admin/users/${userId}`, payload)
  return data.data
}
//--------------------------------------------------------
