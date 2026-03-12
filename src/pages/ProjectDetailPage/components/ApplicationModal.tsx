import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateApplication } from '@/hooks/application/useApplication'
import type { Application } from '@/types/application'

interface ApplicationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectTitle: string
  roles: string[]
  alreadyApplied: boolean
  onApplied: (application?: Application) => void
}

const ApplicationModal = ({
  open,
  onOpenChange,
  projectId,
  projectTitle,
  roles,
  alreadyApplied,
  onApplied,
}: ApplicationModalProps) => {
  const { mutateAsync: createApplication, isPending } = useCreateApplication()
  const [role, setRole] = useState('')
  const [motivation, setMotivation] = useState('')

  const roleOptions = useMemo(
    () => Array.from(new Set(roles.map((item) => item.trim()).filter(Boolean))),
    [roles]
  )

  const resetForm = () => {
    setRole('')
    setMotivation('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (alreadyApplied) {
      toast.info('이미 지원한 프로젝트입니다.')
      handleOpenChange(false)
      return
    }

    if (!role) {
      toast.error('지원 역할을 선택해주세요.')
      return
    }

    if (!motivation.trim()) {
      toast.error('지원 동기를 입력해주세요.')
      return
    }

    try {
      const createdApplication = await createApplication({
        project: projectId,
        role,
        motivation: motivation.trim(),
      })

      onApplied(createdApplication)
      toast.success('지원이 완료되었습니다.')
      handleOpenChange(false)
    } catch (error) {
      console.error(error)
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
          ? error.response.data.message
          : ''

      if (
        message.includes('중복') ||
        message.toLowerCase().includes('duplicate') ||
        message.toLowerCase().includes('already')
      ) {
        onApplied()
        toast.info('이미 지원한 프로젝트입니다.')
        handleOpenChange(false)
        return
      }

      toast.error('지원 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal>
      <DialogContent
        className="w-[min(92vw,640px)] max-w-[640px] gap-0 rounded-3xl border-0 bg-white p-0 shadow-2xl"
        showCloseButton={false}
      >
        <DialogHeader className="border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-extrabold text-slate-900">
                프로젝트 지원하기
              </DialogTitle>
              <p className="text-left text-sm text-slate-500">{projectTitle}</p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              지원 역할 <span className="text-rose-500">*</span>
            </p>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-11 w-full border-slate-200 bg-slate-50">
                <SelectValue placeholder="모집 역할을 선택해주세요" />
              </SelectTrigger>
              <SelectContent align="start">
                {roleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              지원 동기 <span className="text-rose-500">*</span>
            </p>
            <Textarea
              value={motivation}
              onChange={(event) => setMotivation(event.target.value)}
              rows={5}
              className="resize-none border-slate-200 bg-slate-50"
              placeholder="프로젝트에 기여하고 싶은 이유와 목표를 적어주세요."
            />
          </div>

          <div className="text-xs text-slate-500">
            ※ 모집 포지션을 변경하고 싶으면 지원 취소 후 다시 지원해주세요.
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              className="h-11 rounded-xl"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isPending || roleOptions.length === 0 || alreadyApplied}
              className="h-11 rounded-xl"
            >
              {alreadyApplied
                ? '이미 지원 완료'
                : isPending
                  ? '지원 중...'
                  : '지원 완료'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationModal
