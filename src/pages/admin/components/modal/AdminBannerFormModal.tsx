import { Controller } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { formatDate } from '@/utils/formatter'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label, FieldError } from '@/components/shared/FormField'
import BannerImageUploader from '@/pages/admin/components/BannerImageUploader'
import useBannerForm from '@/hooks/admin/useBannerForm'
import type { Banner } from '@/utils/api/admin'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: Banner | null
}

// ── Component ────────────────────────────────────────────────────
const AdminBannerFormModal = ({ open, onOpenChange, banner = null }: Props) => {
  const isEdit = banner !== null
  const { form, onSubmit, isPending } = useBannerForm({
    banner,
    open,
    onSuccess: () => onOpenChange(false),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              : '이미지를 업로드하고 순서, 활성 여부를 설정하세요.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* 배너 이미지 업로드 */}
            <div>
              <Label required>배너 이미지</Label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <BannerImageUploader
                    value={field.value}
                    onChange={(url) =>
                      setValue('imageUrl', url, { shouldValidate: true })
                    }
                  />
                )}
              />
              <FieldError message={errors.imageUrl?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  등록일: {formatDate(new Date(banner.createdAt))}
                </span>
                <span className="text-muted-foreground">
                  최종 수정: {formatDate(new Date(banner.updatedAt))}
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
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 size={14} className="mr-1.5 animate-spin" />
                  저장 중...
                </>
              ) : isEdit ? (
                '수정 완료'
              ) : (
                '배너 등록'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AdminBannerFormModal
