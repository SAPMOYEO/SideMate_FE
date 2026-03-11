import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ApplicationStatusBadge from '../ApplicationStatusBadge'
import { useMyApplication } from '@/hooks/application/useApplication'
import { formatDate } from '@/utils/formatter'

const AppliedView = () => {
  const { data } = useMyApplication()

  return (
    <ul className="w-full space-y-4">
      {data?.data?.map((item) => {
        return (
          <li className="rounded-2xl bg-white p-6" key={item._id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="rounded-md">
                    {item.role}
                  </Badge>
                  <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                    {formatDate(new Date(item.createdAt))}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {item.project.title}
                </h3>
                <ApplicationStatusBadge status={item.status} />
              </div>
              <div className="flex items-center gap-2">
                {item.status !== 'REJECTED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    지원 취소
                  </Button>
                )}
                <Button variant="secondary" size="sm">
                  상세
                </Button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default AppliedView
