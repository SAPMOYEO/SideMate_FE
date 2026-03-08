import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TechStackSelector } from './TechStackSelector'
import { clearUser } from '@/features/slices/userSlice'
import { toast } from 'sonner'
import { updateMyProfile } from '@/features/slices/userSlice'

export const OnboardingModal = () => {
  const user = useAppSelector((state) => state.user.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [selectedStacks, setSelectedStacks] = useState<string[]>([])

  const handleAddStack = (stack: string) => {
    if (!selectedStacks.includes(stack)) {
      setSelectedStacks((prev) => [...prev, stack])
    }
  }

  const handleRemoveStack = (stack: string) => {
    setSelectedStacks((prev) => prev.filter((s) => s !== stack))
  }

  const handleDismissToday = () => {
    const today = new Date().toDateString()
    localStorage.setItem('onboarding_dismissed_date', today)
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (user) {
      const dismissedDate = localStorage.getItem('onboarding_dismissed_date')
      const today = new Date().toDateString()

      if (dismissedDate === today) return

      const hasNoStack =
        !user.profile?.techStack || user.profile.techStack.length === 0
      if (hasNoStack) {
        const timer = setTimeout(() => setOpen(true), 0)
        return () => clearTimeout(timer)
      }
    }
  }, [user])

  const handleSave = async () => {
    if (selectedStacks.length === 0) {
      toast.error('시작하시려면 최소 한 개의 기술 스택을 선택해주세요.')
      return
    }
    try {
      const resultAction = await dispatch(
        updateMyProfile({
          profile: { techStack: selectedStacks },
        })
      )

      if (updateMyProfile.fulfilled.match(resultAction)) {
        setOpen(false)
        toast.success('프로필 설정이 서버에 저장되었습니다.')
      } else {
        const errorMessage = resultAction.payload as string

        if (
          errorMessage === '토큰이 없습니다.' ||
          errorMessage === '유효하지 않은 토큰입니다.'
        ) {
          dispatch(clearUser())
          setOpen(false)
          toast.error('세션이 만료되었습니다. 다시 로그인해주세요.')
          navigate('/login')
          return
        }

        toast.error('저장 실패: ' + errorMessage)
      }
    } catch {
      toast.error('설정 저장 중 오류가 발생했습니다.')
    }
  }

  const userName = user?.name ? `${user.name}님,` : ''

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[500px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl leading-tight font-bold sm:text-2xl">
            <span className="block sm:inline-block">{userName}</span>
            <span className="mt-1 block sm:mt-0">
              반갑습니다. 한 단계만 더 진행할까요?
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            SideMate에서 팀원을 찾기 위해 선호하는 기술 스택을 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <TechStackSelector
            selectedStacks={selectedStacks}
            onAdd={handleAddStack}
            onRemove={handleRemoveStack}
            maxCount={8}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={handleDismissToday}>
            오늘 하루 보지 않기
          </Button>
          <Button onClick={handleSave} className="bg-zinc-900 font-bold">
            시작하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
