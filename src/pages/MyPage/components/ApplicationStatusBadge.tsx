import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus } from '@/types/application'

const STATUS_CONFIG: Record<
  string,
  { label: string; dotClass: string; className: string }
> = {
  APPROVED: {
    label: '승인됨',
    dotClass: 'bg-emerald-500',
    className:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  PENDING: {
    label: '대기중',
    dotClass: 'bg-amber-500 animate-pulse',
    className:
      'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  },
  REJECTED: {
    label: '거절됨',
    dotClass: 'bg-red-500',
    className: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
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
