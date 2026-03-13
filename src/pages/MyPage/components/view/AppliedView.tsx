import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ApplicationStatusBadge from '../ApplicationStatusBadge'
import { useMyApplication } from '@/hooks/application/useApplication'
import { formatDate } from '@/utils/formatter'
import { useNavigate } from 'react-router-dom'
import { useDeleteApplication } from '@/hooks/application/useApplication'
import { toast } from 'sonner'
const AppliedView = () => {
  const { data } = useMyApplication()
  const navigate = useNavigate()
  const { mutateAsync: deleteApplication } = useDeleteApplication()
  const handleCancelApplication = async (id: string) => {
    if (!id) {
      toast.error('지원 정보를 다시 불러온 후 시도해주세요.')
      return
    }

    if (!window.confirm('지원을 취소하시겠습니까?')) return

    try {
      await deleteApplication(id)

      toast.success('지원이 취소되었습니다.')
    } catch (error) {
      console.error(error)
      toast.error('지원 취소 중 오류가 발생했습니다.')
    }
  }
  return (
    <ul className="w-full space-y-4">
      {data?.data?.map((item) => {
        console.log(item, 'item')
        return (
          <li
            className="cursor-pointer rounded-2xl bg-white p-6"
            key={item._id}
            onClick={() => {
              navigate(`/projects/${item.project._id}`)
            }}
          >
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
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancelApplication(item._id)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    지원 취소
                  </Button>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default AppliedView
