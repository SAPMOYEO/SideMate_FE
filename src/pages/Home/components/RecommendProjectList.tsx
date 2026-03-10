import ProjectCard from './ProjectCard'
import { Button } from '@/components/ui/button'
import api from '@/utils/api/api.instance'
import { useQuery } from '@tanstack/react-query'
import { type Project } from '@/types/project'
import { PREVIEW_LIMIT } from '@/constants/home'

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
        <Button variant={'outline'}>프로젝트 페이지로</Button>
      </div>
    </div>
  )
}

export default RecommendProjectList
