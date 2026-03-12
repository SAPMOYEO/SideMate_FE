import { Plus, LineChart, FolderCog } from 'lucide-react'
import { sectionTitleClasses, sectionWrapperClasses } from '@/constants/style'
import { Link } from 'react-router-dom'
import { useGetMyProject } from '@/hooks/project/useProject'
import type { Project } from '@/types/project'
const PreviewCreatedProjectSection = () => {
  const { data } = useGetMyProject()
  const projects = (data?.pages[0].data ?? []) as Project[]

  return (
    <section>
      <div className={sectionWrapperClasses}>
        <h2 className={sectionTitleClasses}>
          <FolderCog className="text-primary" size={28} strokeWidth={2.5} />
          생성 프로젝트 & AI 분석
        </h2>
        <div className="flex items-center gap-4">
          <Link to="/my/project?tab=create" className="text-sm text-slate-400">
            상세보기
          </Link>
          <Link
            to="/projects/create"
            className="bg-primary flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap text-white shadow-md shadow-indigo-100 transition-all hover:bg-indigo-600"
          >
            <Plus size={12} strokeWidth={3} />새 프로젝트
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          아직 만든 프로젝트가 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="border-b border-slate-100 p-6 dark:border-slate-800">
                <h3 className="cursor-pointer text-xl font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {project.description}
                </p>
              </div>
              <div className="dark:bg-primary/5 flex flex-col items-center justify-between gap-4 bg-indigo-50/50 p-6 md:flex-row">
                <div className="flex items-center gap-3">
                  <div className="dark:bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    <LineChart size={20} />
                  </div>
                  <div>
                    <p className="text-primary text-xs font-bold tracking-wide uppercase">
                      AI 피드백 요약
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {project.aiFeedbackIds && project.aiFeedbackIds.length > 0
                        ? `피드백 ${project.aiFeedbackIds.length}건`
                        : '피드백 없음'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Link
                    to={`/my/project?tab=create`}
                    className="text-primary cursor-pointer rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-bold transition-colors hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800"
                  >
                    상세 분석 보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default PreviewCreatedProjectSection
