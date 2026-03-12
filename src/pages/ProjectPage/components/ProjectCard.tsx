import { useState } from 'react'
import type { Project } from '@/types/project'
import { formatDate } from '@/utils/formatter'
import { Link } from 'react-router-dom'
import RoleProgress from './RoleProgress'

interface Props {
  project: Pick<
    Project,
    | '_id'
    | 'title'
    | 'description'
    | 'category'
    | 'requiredTechStack'
    | 'recruitRoles'
    | 'totalCnt'
    | 'createdAt'
  >
}

const ProjectCard = ({ project }: Props) => {
  const [showAllTechStack, setShowAllTechStack] = useState(false)
  const visibleRecruitRoles = project.recruitRoles.slice(0, 3)
  const fallbackTotal = project.recruitRoles.reduce(
    (sum, role) => sum + role.cnt,
    0
  )
  const total = project.totalCnt > 0 ? project.totalCnt : fallbackTotal || 1
  const isTechStackExpandable = project.requiredTechStack.length > 8
  const visibleTechStack =
    isTechStackExpandable && !showAllTechStack
      ? project.requiredTechStack.slice(0, 8)
      : project.requiredTechStack

  return (
    <div className="flex flex-col justify-between gap-6 rounded-xl border bg-white p-6 transition duration-200 hover:shadow-lg lg:flex-row lg:items-center">
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-3 text-xs">
          <span className="rounded-md bg-indigo-50 px-2 py-1 font-medium text-indigo-600">
            {project.category}
          </span>

          <span className="text-gray-400">
            {formatDate(new Date(project.createdAt))}
          </span>
        </div>

        <h2 className="mb-2 text-lg font-semibold">{project.title}</h2>

        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {visibleTechStack.map((tag) => (
            <span
              key={tag}
              className="rounded-md border bg-gray-100 px-3 py-1 text-xs"
            >
              {tag}
            </span>
          ))}

          {isTechStackExpandable && (
            <button
              type="button"
              onClick={() => setShowAllTechStack((prev) => !prev)}
              className="rounded-md border bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              aria-label={
                showAllTechStack ? '기술스택 접기' : '기술스택 더보기'
              }
            >
              {showAllTechStack ? '-' : '+'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:w-[240px]">
        <div className="space-y-3">
          {visibleRecruitRoles.map((role) => (
            <RoleProgress
              key={role.role}
              role={{
                name: role.role,
                current: role.cnt,
                total,
              }}
            />
          ))}
        </div>

        <Link
          to={`/projects/${project._id}`}
          className="bg-primary rounded-lg py-2 text-center text-white transition hover:bg-indigo-600"
        >
          상세 보기
        </Link>
      </div>
    </div>
  )
}

export default ProjectCard
