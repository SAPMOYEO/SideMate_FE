import ProjectCard from './ProjectCard'
import api from '@/utils/api/api.instance'
import { useQuery } from '@tanstack/react-query'
import { type Project } from '@/types/project'
import { PREVIEW_LIMIT } from '@/constants/home'
import { Link } from 'react-router-dom'

const RecommendProjectList = () => {
  const { data: projects } = useQuery({
    queryKey: ['project'],
    queryFn: async (): Promise<Project[]> => {
      const response = await api.get(
        `/project?limit=${PREVIEW_LIMIT}&sort=latest`
      )
      return response.data.data
    },
  })

  return (
    <div className="flex flex-col gap-10">
      {/* 프로젝트 리스트 */}
      <div className="grid grid-cols-4 gap-8">
        {projects?.map((project) => {
          return <ProjectCard project={project} key={project._id} />
        })}
      </div>
      <div className="flex justify-center">
        <Link
          to="/projects"
          className="bg-background hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 rounded-lg border p-3 text-sm font-medium whitespace-nowrap shadow-xs"
        >
          프로젝트 페이지로
        </Link>
      </div>
    </div>
  )
}

export default RecommendProjectList
