import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Applicant {
  name: string
  time: string
  role: string
  stack: string
  motivation?: string
  profileImage?: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicant: Applicant | null
  onApprove?: () => void
  onReject?: () => void
}

const ApplicantDetailModal = ({
  open,
  onOpenChange,
  applicant,
  onApprove,
  onReject,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지원자 상세</DialogTitle>
        </DialogHeader>

        {applicant && (
          <div className="space-y-6">
            {/* 지원자 기본 정보 */}
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage
                  src={applicant.profileImage ?? ''}
                  alt={applicant.name}
                />
                <AvatarFallback>{applicant.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {applicant.name}
                </p>
                <p className="text-sm text-slate-500">{applicant.role}</p>
              </div>
            </div>

            {/* 기술 스택 */}
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                기술 스택
              </p>
              <div className="flex flex-wrap gap-2">
                {applicant.stack.split(', ').map((s) => (
                  <Badge key={s} variant="secondary" className="rounded-md">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 지원 동기 */}
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                지원 동기
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {applicant.motivation ?? '지원 동기가 없습니다.'}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={onReject}>
            거절
          </Button>
          <Button onClick={onApprove}>승인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicantDetailModal
