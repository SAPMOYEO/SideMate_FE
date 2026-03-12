import { useMyApplication } from '@/hooks/application/useApplication'
import { Rocket, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import ApplicationStatusBadge from './ApplicationStatusBadge'
import { formatDate } from '@/utils/formatter'

const PreviewAppliedProjectSection = () => {
  const { data } = useMyApplication()
  const applications = data?.data ?? []
  const totalCount = data?.totalCount ?? 0

  const sectionTitleClasses =
    'text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2'
  const sectionWrapperClasses =
    'flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-100 pb-4 mb-6'

  return (
    <section>
      <div className={sectionWrapperClasses}>
        <h2 className={sectionTitleClasses}>
          <Rocket className="text-primary" size={28} strokeWidth={2.5} />
          지원한 프로젝트
        </h2>
        <div className="flex items-center gap-2">
          <Link
            to="/my/project?tab=supplied"
            className="text-sm text-slate-400"
          >
            상세보기
          </Link>
          <span className="cursor-pointer rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">
            총 {totalCount}건
          </span>
        </div>
      </div>

      {applications.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          아직 지원한 프로젝트가 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {applications.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex-1">
                <h3 className="cursor-pointer text-lg font-bold text-slate-900 dark:text-white">
                  {item.role}
                </h3>
                <p className="text-sm text-slate-500">
                  프로젝트: {item.project.title ?? '-'}
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} />
                  {formatDate(new Date(item.createdAt))} 지원
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <ApplicationStatusBadge status={item.status} />
                {item.status !== 'REJECTED' && (
                  <button className="cursor-pointer text-xs font-medium text-slate-400 underline underline-offset-4 transition-colors hover:text-red-500">
                    지원 취소
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default PreviewAppliedProjectSection
