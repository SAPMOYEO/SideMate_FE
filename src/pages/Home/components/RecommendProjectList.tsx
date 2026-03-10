import ProjectCard from './ProjectCard'
import { type Project } from '@/types/project'
import { FolderX } from 'lucide-react'

interface Props {
  projects: Project[]
  isLoading: boolean
}

const RecommendProjectList = ({ projects, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 text-slate-400">
        <FolderX size={36} strokeWidth={1.5} />
        <p className="text-sm">해당 카테고리의 프로젝트가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard project={project} key={project._id} />
      ))}
    </div>
  )
}

export default RecommendProjectList
