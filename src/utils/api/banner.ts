import api from '.'

export interface Banner {
  _id: string
  imageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BannerPayload {
  imageUrl: string
  isActive: boolean
}

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
  return data
}

/** 배너 수정 */
export const updateBanner = async (
  id: string,
  payload: Partial<BannerPayload>
): Promise<Banner> => {
  const { data } = await api.patch(`/admin/banners/${id}`, payload)
  return data
}

/** 배너 삭제 */
export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`/admin/banners/${id}`)
}
