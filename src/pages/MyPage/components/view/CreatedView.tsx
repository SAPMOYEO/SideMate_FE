import { useGetMyProject } from '@/hooks/project/useProject'
import type { Project } from '@/types/project'
import ProjectCard from './ProjectCard/ProjectCard'

const CreatedView = () => {
  const { data } = useGetMyProject()
  const projects = (data?.data ?? []) as Project[]

  if (projects.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-slate-400">아직 만든 프로젝트가 없습니다.</p>
      </div>
    )
  }

  return (
    <ul className="w-full space-y-4">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </ul>
  )
}

export default CreatedView
