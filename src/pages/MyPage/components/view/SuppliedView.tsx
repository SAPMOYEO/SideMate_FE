import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ApplicationStatusBadge from '../ApplicationStatusBadge'

const SuppliedView = () => {
  return (
    <ul className="w-full space-y-4">
      <li className="rounded-2xl bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-md">
                모바일 앱
              </Badge>
              <Badge variant="default" className="rounded-md">
                UI/UX 디자이너
              </Badge>
              <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                2024.01.15 지원
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              위치 기반 러닝 커뮤니티 앱
            </h3>
            <ApplicationStatusBadge status="APPROVED" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600"
            >
              지원 취소
            </Button>
            <Button variant="secondary" size="sm">
              상세
            </Button>
          </div>
        </div>
      </li>
    </ul>
  )
}

export default SuppliedView
