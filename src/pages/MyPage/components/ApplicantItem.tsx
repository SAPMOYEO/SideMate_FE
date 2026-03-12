import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ApplicationStatusBadge from './ApplicationStatusBadge'
import type { ApplicationStatus } from '@/types/application'

interface Applicant {
  name: string
  time: string
  role: string
  stack: string
  status: ApplicationStatus
  profileImage?: string
}

interface Props {
  applicant: Applicant
  onApprove?: () => void
  onReject?: () => void
  onDetail?: () => void
}

const ApplicantItem = ({ applicant, onApprove, onReject, onDetail }: Props) => {
  return (
    <li className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <AvatarImage
            src={applicant.profileImage ?? ''}
            alt={applicant.name}
          />
          <AvatarFallback>{applicant.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-900 dark:text-white">
              {applicant.name}
            </p>
            <Badge variant="secondary" className="rounded-full text-[10px]">
              {applicant.time}
            </Badge>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {applicant.role} • {applicant.stack}
          </p>
        </div>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          onClick={onDetail}
        >
          상세
        </Button>
        {applicant.status === 'PENDING' ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={onReject}
            >
              거절
            </Button>
            <Button
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={onApprove}
            >
              승인
            </Button>
          </>
        ) : (
          <ApplicationStatusBadge status={applicant.status} />
        )}
      </div>
    </li>
  )
}

export default ApplicantItem
