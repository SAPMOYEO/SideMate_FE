import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImageIcon, Hash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

// ── Types ────────────────────────────────────────────────────────
interface Banner {
  _id: string
  imageUrl: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: Banner | null
}

// ── Schema ───────────────────────────────────────────────────────
const schema = z.object({
  imageUrl: z
    .string()
    .min(1, '이미지 URL을 입력해주세요')
    .url('올바른 URL 형식이 아닙니다'),
  order: z.number().min(1, '1 이상이어야 합니다'),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

// ── Helpers ──────────────────────────────────────────────────────
const Label = ({
  children,
  required,
}: {
  children: ReactNode
  required?: boolean
}) => (
  <label className="mb-1.5 block text-sm font-medium">
    {children}
    {required && <span className="text-destructive ml-0.5">*</span>}
  </label>
)

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-destructive mt-1 text-xs">{message}</p> : null

const formatDate = (date: Date) =>
  date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

// ── Component ────────────────────────────────────────────────────
const AdminBannerFormModal = ({ open, onOpenChange, banner = null }: Props) => {
  const isEdit = banner !== null
  const [imageLoadError, setImageLoadError] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { imageUrl: '', order: 1, isActive: true },
  })

  // 폼 값 초기화
  useEffect(() => {
    reset({
      imageUrl: banner?.imageUrl ?? '',
      order: banner?.order ?? 1,
      isActive: banner?.isActive ?? true,
    })
  }, [banner, open, reset])

  // 이미지 에러 상태 초기화 (별도 effect로 분리)
  useEffect(() => {
    setImageLoadError(false)
  }, [open])

  const watchedImageUrl = watch('imageUrl')
  const showPreview = watchedImageUrl.trim().length > 0 && !imageLoadError

  const onSubmit = (data: FormValues) => {
    console.log('submit', data) // TODO: API 연동
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className="flex w-[45vw] max-w-[45vw] flex-col gap-0 p-0"
        showCloseButton={false}
      >
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="text-xl">
            {isEdit ? '배너 수정' : '배너 등록'}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {isEdit
              ? '배너 정보를 수정합니다.'
              : '이미지 URL, 순서, 활성 여부를 설정하세요.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* 이미지 URL + 미리보기 */}
            <div>
              <Label required>배너 이미지 URL</Label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="https://example.com/banner.png"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      field.onChange(e)
                      setImageLoadError(false)
                    }}
                  />
                )}
              />
              <FieldError message={errors.imageUrl?.message} />

              {/* 미리보기 */}
              <div className="bg-muted mt-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border">
                {showPreview ? (
                  <img
                    src={watchedImageUrl}
                    alt="배너 미리보기"
                    className="h-full w-full object-contain"
                    onError={() => setImageLoadError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <ImageIcon
                      size={28}
                      className="text-muted-foreground opacity-40"
                    />
                    <span className="text-muted-foreground text-xs">
                      {imageLoadError
                        ? '이미지를 불러올 수 없습니다'
                        : '미리보기'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 노출 순서 */}
              <div>
                <Label required>노출 순서</Label>
                <div className="relative">
                  <Hash
                    size={15}
                    className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                  />
                  <Input
                    type="number"
                    min={1}
                    className="pl-8"
                    {...register('order', { valueAsNumber: true })}
                  />
                </div>
                <FieldError message={errors.order?.message} />
                <p className="text-muted-foreground mt-1 text-xs">
                  숫자가 낮을수록 먼저 표시됩니다
                </p>
              </div>

              {/* 활성 여부 */}
              <div>
                <Label>활성 여부</Label>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <div className="border-input mt-0.5 flex h-10 items-center gap-3 rounded-md border px-3">
                      <Switch
                        id="banner-active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="banner-active"
                        className={`cursor-pointer text-sm font-medium ${
                          field.value
                            ? 'text-green-600'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {field.value ? '활성' : '비활성'}
                      </label>
                    </div>
                  )}
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  비활성 시 메인 페이지에 노출되지 않습니다
                </p>
              </div>
            </div>

            {/* 수정 모드: 메타 정보 */}
            {isEdit && banner && (
              <div className="bg-muted/40 flex justify-between rounded-xl px-4 py-3 text-xs">
                <span className="text-muted-foreground">
                  등록일: {formatDate(banner.createdAt)}
                </span>
                <span className="text-muted-foreground">
                  최종 수정: {formatDate(banner.updatedAt)}
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" size="sm">
              {isEdit ? '수정 완료' : '배너 등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AdminBannerFormModal
