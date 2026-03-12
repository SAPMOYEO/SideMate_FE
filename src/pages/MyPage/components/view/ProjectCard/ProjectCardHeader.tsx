import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart2, ChevronDown, ChevronUp, Users } from 'lucide-react'
import type { Project } from '@/types/project'

interface Props {
  project: Project
  showAIFeedback: boolean
  showApplicants: boolean
  applicantCount: number
  onDetailClick: () => void
  onToggleAIFeedback: () => void
  onToggleApplicants: () => void
}

const getDaysLeft = (deadline: string) => {
  const days = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  if (days < 0) return '마감'
  if (days === 0) return 'D-Day'
  return `D-${days}`
}

const ProjectCardHeader = ({
  project,
  showAIFeedback,
  showApplicants,
  applicantCount,
  onDetailClick,
  onToggleAIFeedback,
  onToggleApplicants,
}: Props) => {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="rounded-md">
            {project.status}
          </Badge>
          {project.deadline && (
            <>
              <span className="text-xs font-medium text-slate-500">
                모집 마감 {getDaysLeft(project.deadline)}
              </span>
              <span className="text-slate-300">•</span>
            </>
          )}
          <span className="text-xs font-medium text-slate-500">
            {project.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onDetailClick}>
          상세
        </Button>
        <Button variant="secondary" size="sm" onClick={onToggleAIFeedback}>
          <BarChart2 className="mr-1 size-4" />
          AI 피드백
          {showAIFeedback ? (
            <ChevronUp className="ml-1 size-3" />
          ) : (
            <ChevronDown className="ml-1 size-3" />
          )}
        </Button>
        <Button size="sm" onClick={onToggleApplicants}>
          <Users className="mr-1 size-4" />
          지원자 ({applicantCount})
          {showApplicants ? (
            <ChevronUp className="ml-1 size-3" />
          ) : (
            <ChevronDown className="ml-1 size-3" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default ProjectCardHeader
