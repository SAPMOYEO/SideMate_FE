import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ApplicationStatusBadge from './ApplicationStatusBadge'
import type { ApplicantDetail } from '@/types/applicant'
import { UserCircle } from 'lucide-react'

interface Props {
  applicant: ApplicantDetail
  onApprove?: () => void
  onReject?: () => void
  onDetail?: () => void
}

const ApplicantItem = ({ applicant, onDetail }: Props) => {
  return (
    <li
      className="flex cursor-pointer flex-col gap-2 p-4 transition-colors hover:bg-slate-50"
      onClick={onDetail}
    >
      <div className="flex w-full items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          {applicant.privacySettings?.isImagePublic &&
          applicant.profileImage ? (
            <AvatarImage
              src={applicant.profileImage}
              alt={applicant.name}
              className="object-cover"
            />
          ) : null}

          <AvatarFallback className="flex items-center justify-center bg-zinc-100 dark:bg-slate-800">
            <UserCircle
              className="h-[90%] w-[90%] text-zinc-300 dark:text-slate-700"
              strokeWidth={1}
            />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-bold text-slate-900">
              {applicant.name}
            </p>
          </div>
        </div>
        <div className="mt-1">
          <ApplicationStatusBadge status={applicant.status} />
        </div>
      </div>
    </li>
  )
}

export default ApplicantItem
