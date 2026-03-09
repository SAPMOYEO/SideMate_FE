import ProjectCard from './ProjectCard'
import { Button } from '@/components/ui/button'
import api from '@/utils/api/api.instance'
import { useQuery } from '@tanstack/react-query'

const RecommendProjectList = () => {
  const { data } = useQuery({
    queryKey: ['project'],
    queryFn: async () => {
      const response = await api.get('/project')
      return response
    },
  })
  console.log(data)
  return (
    <div className="flex flex-col gap-10">
      {/* 프로젝트 리스트 */}
      <div className="grid grid-cols-4 gap-8">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
      <div className="flex justify-center">
        <Button variant={'outline'}>프로젝트 더 보기</Button>
      </div>
    </div>
  )
}

export default RecommendProjectList
