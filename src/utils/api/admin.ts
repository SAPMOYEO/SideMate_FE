import api from './api.instance'
import type { ProjectResponse } from '@/types/admin.project.type'
import type { PaginatedResponse, ParamsTypes } from '@/types/common.type'
import type { UserResponse } from '@/types/user.type'

// ──────────────────────────────────────────────────────────────────
// Banner
// ──────────────────────────────────────────────────────────────────
export interface Banner {
  _id: string
  imageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type BannerPayload = Pick<Banner, 'imageUrl' | 'isActive'>

export interface BannersResponse {
  data: Banner[]
  totalCount: number
  totalPages: number
}

/** 배너 목록 조회 (페이지네이션) */
export const fetchBanners = async ({
  page = 1,
  limit = 5,
}: {
  page?: number
  limit?: number
} = {}): Promise<BannersResponse> => {
  const { data } = await api.get('/admin/banners', { params: { page, limit } })
  return data
}

/** 배너 등록 */
export const createBanner = async (payload: BannerPayload): Promise<Banner> => {
  const { data } = await api.post('/admin/banners', payload)
  return data.data
}

/** 배너 수정 */
export const updateBanner = async (
  id: string,
  payload: Partial<BannerPayload>
): Promise<Banner> => {
  const { data } = await api.patch(`/admin/banners/${id}`, payload)
  return data.data
}

/** 배너 삭제 */
export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`/admin/banners/${id}`)
}
//-------------------------- 유저 관련 타입 정의 -------------------------
export type UpdateUserPayload = {
  role?: UserResponse['role']
  isActive?: boolean
}
//------------------------------------------------------------------
export interface AdminLoginPayload {
  name: string
  password: string
}

export interface AdminLoginResponse {
  status: string
  message: string
  token: string
}

export const adminLoginApi = async (
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> => {
  const { data } = await api.post<AdminLoginResponse>('/admin/login', payload)
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
