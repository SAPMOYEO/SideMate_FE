import type { Project } from '@/types/project'
import { Link } from 'react-router-dom'
import CategoryBadge from '@/components/shared/CategoryBadge'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
const ProjectCard = ({ project }: { project: Project }) => {
  console.log('Project Card : ', project)

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="absolute top-4 right-4">
        <span className="text-primary rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm">
          New
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2">
          <CategoryBadge category={project.category} />
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(project.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
        <h3 className="group-hover:text-primary mb-2 text-lg font-bold text-slate-900 transition-colors dark:text-white">
          {project.title}
        </h3>
        <p className="mb-6 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {project.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <ul className="flex gap-2">
            {project.requiredTechStack.map((stack) => {
              return (
                <li>
                  <Badge>{stack}</Badge>
                </li>
              )
            })}
          </ul>
          <Link to={`/projects/${project._id}`}>
            <button className="text-primary flex items-center gap-1 text-sm font-bold">
              상세보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
