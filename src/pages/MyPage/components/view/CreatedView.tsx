import { useGetMyProject } from '@/hooks/project/useProject'
import type { Project } from '@/types/project'
import ProjectCard from './ProjectCard/ProjectCard'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
const CreatedView = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMyProject()
  const projects = (data?.pages.flatMap((page) => page.data) ?? []) as Project[]
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (projects.length === 0) {
    return (
      <div className="flex min-h-96 w-full items-center justify-center">
        <p className="text-sm text-slate-400">아직 만든 프로젝트가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <ul className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </ul>
      {hasNextPage && (
        <div ref={ref} className="space-y-4 pt-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      )}
    </div>
  )
}

export default CreatedView
