import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus } from '@/types/application'

const STATUS_CONFIG: Record<
  string,
  { label: string; dotClass: string; className: string }
> = {
  ACCEPTED: {
    label: '승인',
    dotClass: 'bg-emerald-500',
    className: 'text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  APPROVED: {
    label: '승인',
    dotClass: 'bg-emerald-500',
    className: 'text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  PENDING: {
    label: '대기',
    dotClass: 'bg-amber-500',
    className: 'text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  },
  REJECTED: {
    label: '거절',
    dotClass: 'bg-red-500',
    className: 'text-red-600 dark:bg-red-900/20 dark:text-red-400',
  },
}

interface Props {
  status: ApplicationStatus
}

const ApplicationStatusBadge = ({ status }: Props) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING

  return (
    <Badge
      variant="outline"
      className={`rounded-full border-0 font-bold ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </Badge>
  )
}

export default ApplicationStatusBadge
