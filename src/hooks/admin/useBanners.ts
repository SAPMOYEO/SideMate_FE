import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  type BannerPayload,
} from '@/utils/api/admin'

/** 쿼리 키 베이스 — 하위 키 무효화 시 사용 */
const BANNER_BASE_KEY = ['banners'] as const

/**
 * 배너 목록 조회 (페이지네이션)
 * - queryKey에 page/limit 포함 → 페이지별 독립 캐시
 * - invalidateQueries(['banners']) 시 모든 페이지 캐시 무효화
 */
export const useBanners = ({
  page = 1,
  limit = 5,
}: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: [...BANNER_BASE_KEY, page, limit] as const,
    queryFn: () => fetchBanners({ page, limit }),
  })

/**
 * 배너 등록
 * - 성공 시 목록 캐시 무효화 → 자동 리페치
 */
export const useCreateBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BannerPayload) => createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_BASE_KEY })
    },
  })
}

/**
 * 배너 수정
 * - 성공 시 목록 캐시 무효화 → 자동 리페치
 */
export const useUpdateBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<BannerPayload>
    }) => updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_BASE_KEY })
    },
  })
}

/**
 * 배너 삭제
 * - 성공 시 목록 캐시 무효화 → 자동 리페치
 */
export const useDeleteBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_BASE_KEY })
    },
  })
}
