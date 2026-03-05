import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ── Schema ────────────────────────────────────────────────────────
export const bannerSchema = z.object({
  imageUrl: z
    .string()
    .min(1, '이미지를 업로드해주세요')
    .url('올바른 URL 형식이 아닙니다'),
  order: z.number().min(1, '1 이상이어야 합니다'),
  isActive: z.boolean(),
})

export type BannerFormValues = z.infer<typeof bannerSchema>

interface Banner {
  _id: string
  imageUrl: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

interface UseBannerFormOptions {
  /** 수정 모드일 때 기존 배너 데이터 */
  banner?: Banner | null
  /** 모달 open 상태 — 열릴 때마다 폼 초기화 트리거 */
  open: boolean
  /** 제출 성공 콜백 */
  onSuccess: () => void
}

/**
 * 배너 등록/수정 폼 상태 및 제출 로직
 */
const useBannerForm = ({ banner, open, onSuccess }: UseBannerFormOptions) => {
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: { imageUrl: '', order: 1, isActive: true },
  })

  // reset을 구조분해 → RHF의 reset은 안정적인 참조라 deps에 넣어도 무한루프 없음
  const { reset } = form

  // 모달이 열릴 때마다 banner 데이터로 폼 초기화
  useEffect(() => {
    reset({
      imageUrl: banner?.imageUrl ?? '',
      order: banner?.order ?? 1,
      isActive: banner?.isActive ?? true,
    })
  }, [banner, open, reset])

  /** TODO: 배너 등록/수정 API 연동 */
  const onSubmit = (data: BannerFormValues) => {
    console.log('submit', data)
    onSuccess()
  }

  return { form, onSubmit }
}

export default useBannerForm
