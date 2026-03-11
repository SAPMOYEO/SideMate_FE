import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BarChart2, ChevronDown, ChevronUp, Users } from 'lucide-react'
import ApplicantItem from '../ApplicantItem'
import ApplicantDetailModal from '../ApplicantDetailModal'
import { useGetMyProject } from '@/hooks/project/useProject'
import { useApplications } from '@/hooks/application/useApplication'
import { formatDate } from '@/utils/formatter'
import type { Project } from '@/types/project'

interface MappedApplicant {
  _id: string
  name: string
  time: string
  role: string
  stack: string
  motivation: string
}

const getDaysLeft = (deadline: string) => {
  const days = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  if (days < 0) return '마감'
  if (days === 0) return 'D-Day'
  return `D-${days}`
}

// ── 프로젝트 카드 (토글·모달 state를 카드별로 독립 관리) ─────────────────
const ProjectCard = ({ project }: { project: Project }) => {
  const [showApplicants, setShowApplicants] = useState(false)
  const [showAIFeedback, setShowAIFeedback] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] =
    useState<MappedApplicant | null>(null)

  // 토글이 열릴 때만 fetch
  const { data: applicantsData } = useApplications(
    project._id,
    {},
    showApplicants
  )

  const applicants: MappedApplicant[] = (applicantsData?.data ?? []).map(
    (app) => ({
      _id: app._id,
      name:
        app.applicant && typeof app.applicant === 'object'
          ? ((app.applicant as { name?: string }).name ?? '알 수 없음')
          : '알 수 없음',
      time: formatDate(new Date(app.createdAt)),
      role: app.role,
      stack: '',
      motivation: app.motivation,
    })
  )

  return (
    <li className="rounded-2xl bg-white p-6">
      {/* 프로젝트 헤더 */}
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDetailOpen(true)}
          >
            상세
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAIFeedback((prev) => !prev)}
          >
            <BarChart2 className="mr-1 size-4" />
            AI 피드백
            {showAIFeedback ? (
              <ChevronUp className="ml-1 size-3" />
            ) : (
              <ChevronDown className="ml-1 size-3" />
            )}
          </Button>
          <Button size="sm" onClick={() => setShowApplicants((prev) => !prev)}>
            <Users className="mr-1 size-4" />
            지원자 ({applicantsData?.totalCount ?? 0})
            {showApplicants ? (
              <ChevronUp className="ml-1 size-3" />
            ) : (
              <ChevronDown className="ml-1 size-3" />
            )}
          </Button>
        </div>
      </div>

      {/* AI 피드백 토글 */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showAIFeedback ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              AI 피드백
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              AI 피드백 내용이 여기에 표시됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 지원자 현황 토글 */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          showApplicants ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50/50 px-6 py-4 dark:bg-slate-800/30">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                지원 현황{' '}
                <span className="text-primary ml-1">{applicants.length}명</span>
              </h4>
            </div>
            {applicants.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-slate-400">
                아직 지원자가 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {applicants.map((applicant) => (
                  <ApplicantItem
                    key={applicant._id}
                    applicant={applicant}
                    onDetail={() => setSelectedApplicant(applicant)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 프로젝트 상세 모달 */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{project.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-slate-500">
            {project.description}
          </p>
        </DialogContent>
      </Dialog>

      {/* 지원자 상세 모달 */}
      <ApplicantDetailModal
        open={!!selectedApplicant}
        onOpenChange={(open) => !open && setSelectedApplicant(null)}
        applicant={selectedApplicant}
      />
    </li>
  )
}

// ── CreatedView ────────────────────────────────────────────────────────────
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
