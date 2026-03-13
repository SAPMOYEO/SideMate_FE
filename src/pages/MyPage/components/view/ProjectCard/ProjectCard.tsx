import { useState } from 'react'
import ApplicantDetailModal from '../../ApplicantDetailModal'
import {
  useApplications,
  useUpdateApplicationStatus,
} from '@/hooks/application/useApplication'
import type { Project } from '@/types/project'
import type { ApplicantDetail } from '@/types/applicant'
import { mapApplicationToApplicantDetail } from '@/types/applicant'
import ProjectCardHeader from './ProjectCardHeader'
import AIFeedbackSection from './AIFeedbackSection'
import ApplicantSection from './ApplicantSection'

const ProjectCard = ({ project }: { project: Project }) => {
  const [showApplicants, setShowApplicants] = useState(false)
  const [showAIFeedback, setShowAIFeedback] = useState(false)
  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicantDetail | null>(null)

  const { data: applicantsData } = useApplications(project._id)
  const { mutate: updateStatus } = useUpdateApplicationStatus()

  const applicants: ApplicantDetail[] = (applicantsData?.data ?? []).map(
    mapApplicationToApplicantDetail
  )

  return (
    <li className="rounded-2xl bg-white p-6">
      <ProjectCardHeader
        project={project}
        showAIFeedback={showAIFeedback}
        showApplicants={showApplicants}
        applicantCount={applicantsData?.totalCount ?? 0}
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

      <ApplicantDetailModal
        open={!!selectedApplicant}
        onOpenChange={(open) => !open && setSelectedApplicant(null)}
        applicant={selectedApplicant}
      />
    </li>
  )
}

export default ProjectCard
