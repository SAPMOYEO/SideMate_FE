import api from './api.instance'
import type { UserResponse } from '@/types/user.type'
import type { PaginatedResponse } from '@/types/common.type'
//-------------------------- 유저 관련 타입 정의 -------------------------
export type UpdateUserPayload = {
  role?: UserResponse['role']
  isActive?: boolean
}
//------------------------------------------------------------------

// ---------------- 유저 관련 API (admin) ----------------
export const getUserList = async ({
  page = 1,
  limit = 10,
  search = '',
  sort = '-createdAt',
}: {
  page?: number
  limit?: number
  search?: string
  sort?: string
} = {}): Promise<PaginatedResponse<UserResponse>> => {
  const { data } = await api.get('/admin/users', {
    params: {
      page,
      limit,
      sort,
      ...(search && { query: search }),
    },
  })
  return data
}
//-------------------------------------------------------------------

//---------------- 유저 업데이트 API (admin) ----------------
export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<UserResponse> => {
  const { data } = await api.patch(`/admin/users/${userId}`, payload)
  return data.data
}
//--------------------------------------------------------
