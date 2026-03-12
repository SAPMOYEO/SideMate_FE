import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ApplicantDetailModal from '../../ApplicantDetailModal'
import {
  useApplications,
  useUpdateApplicationStatus,
} from '@/hooks/application/useApplication'
import { formatDate } from '@/utils/formatter'
import type { Project } from '@/types/project'
import type { ApplicationStatus } from '@/types/application'
import type { MappedApplicant } from './types'
import ProjectCardHeader from './ProjectCardHeader'
import AIFeedbackSection from './AIFeedbackSection'
import ApplicantSection from './ApplicantSection'

const ProjectCard = ({ project }: { project: Project }) => {
  const [showApplicants, setShowApplicants] = useState(false)
  const [showAIFeedback, setShowAIFeedback] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedApplicant, setSelectedApplicant] =
    useState<MappedApplicant | null>(null)

  const { data: applicantsData } = useApplications(project._id)
  const { mutate: updateStatus } = useUpdateApplicationStatus()

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
      status: app.status as ApplicationStatus,
    })
  )

  return (
    <li className="rounded-2xl bg-white p-6">
      <ProjectCardHeader
        project={project}
        showAIFeedback={showAIFeedback}
        showApplicants={showApplicants}
        applicantCount={applicantsData?.totalCount ?? 0}
        onDetailClick={() => setDetailOpen(true)}
        onToggleAIFeedback={() => setShowAIFeedback((prev) => !prev)}
        onToggleApplicants={() => setShowApplicants((prev) => !prev)}
      />

      <AIFeedbackSection show={showAIFeedback} />

      <ApplicantSection
        show={showApplicants}
        applicants={applicants}
        onDetail={setSelectedApplicant}
        onApprove={(id) => updateStatus({ id, status: 'APPROVED' })}
        onReject={(id) => updateStatus({ id, status: 'REJECTED' })}
      />

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

      <ApplicantDetailModal
        open={!!selectedApplicant}
        onOpenChange={(open) => !open && setSelectedApplicant(null)}
        applicant={selectedApplicant}
      />
    </li>
  )
}

export default ProjectCard
