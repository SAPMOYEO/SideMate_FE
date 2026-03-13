import { useMemo, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import type { Project, RecruitRole } from '@/types/project'
import type { Application } from '@/types/application'
import ApplicantItem from '../../MyPage/components/ApplicantItem'
import ApplicantDetailModal from '../../MyPage/components/ApplicantDetailModal'
import { CheckCircle2, CircleAlert } from 'lucide-react'

export interface ApplicantUser {
  _id: string
  name?: string
  profile?: {
    profileImage?: string
    bio?: string
    techStack?: string[]
    gitUrl?: string
  }
  privacySettings?: {
    isImagePublic: boolean
    isGithubPublic: boolean
    isBioPublic: boolean
  }
}
export interface ExtendedApplicant {
  name: string
  time: string
  role: string
  stack: string
  status: string
  profileImage?: string
  bio?: string
  gitUrl?: string
  motivation?: string
  privacySettings?: {
    isImagePublic: boolean
    isGithubPublic: boolean
    isBioPublic: boolean
  }
}

interface Props {
  project: Project
  applications: Application[]
  onAccept: (app: Application) => void | Promise<void>
  onReject: (app: Application) => void | Promise<void>
}

const ProjectApplicantManager = ({
  project,
  applications,
  onAccept,
  onReject,
}: Props) => {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const applicantsByRole = useMemo(() => {
    const map: Record<string, Application[]> = {}
    applications.forEach((app) => {
      const role = app.role || '기타'
      if (!map[role]) map[role] = []
      map[role].push(app)
    })
    return map
  }, [applications])

  const handleViewDetail = (app: Application) => {
    setSelectedApp(app)
    setIsModalOpen(true)
  }

  const mapToApplicantData = (app: Application): ExtendedApplicant => {
    const isObject = (val: unknown): val is Record<string, unknown> => {
      return typeof val === 'object' && val !== null
    }

    const user = isObject(app.applicant)
      ? (app.applicant as ApplicantUser)
      : null

    const profile = user?.profile || {}

    const techStack = Array.isArray(profile.techStack) ? profile.techStack : []
    const rawApp = app as unknown as Record<string, unknown>
    const motivation =
      (rawApp.message as string) || (rawApp.motivation as string) || ''

    return {
      name: user?.name || '지원자',
      time: '방금 전',
      role: app.role || '',
      stack: techStack.length > 0 ? techStack.join(', ') : '미등록',
      status: app.status,
      profileImage: profile.profileImage,
      bio: profile.bio,
      gitUrl: profile.gitUrl,
      motivation: motivation,
      privacySettings: user?.privacySettings,
    }
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          모집 역할 및 지원자
        </h3>
        <Badge
          variant="secondary"
          className="border-none bg-indigo-50 text-indigo-600"
        >
          총 {applications.length}명 지원
        </Badge>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {project.recruitRoles.map((role: RecruitRole) => {
          const roleApplicants = applicantsByRole[role.role] || []
          const acceptedCount = roleApplicants.filter(
            (app) => app.status === 'APPROVED' || app.status === 'ACCEPTED'
          ).length

          const pendingCount = roleApplicants.filter(
            (app) => app.status === 'PENDING'
          ).length
          const rejectedCount = roleApplicants.filter(
            (app) => app.status === 'REJECTED'
          ).length
          const isRoleFilled = acceptedCount >= role.cnt
          return (
            <AccordionItem
              key={role.role}
              value={role.role}
              className="border-none"
            >
              <AccordionTrigger className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-200 px-4 py-3 transition-all hover:bg-gray-300 hover:no-underline dark:bg-slate-700 dark:hover:bg-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                    {role.role}
                  </span>
                  {isRoleFilled && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  )}
                  {!isRoleFilled && pendingCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <span
                  className={`ml-auto text-xs font-bold ${isRoleFilled ? 'text-emerald-600' : 'text-indigo-600'}`}
                >
                  {acceptedCount} / {role.cnt}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-0 pt-2">
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-inner">
                  {roleApplicants.length > 0 ? (
                    <>
                      <div className="flex justify-between px-8 py-2 text-xs text-zinc-500">
                        <span>승인 {acceptedCount}</span>
                        <span>대기 {pendingCount}</span>
                        <span>거절 {rejectedCount}</span>
                      </div>
                      <ul className="divide-y divide-gray-50">
                        {roleApplicants.map((app) => (
                          <div
                            key={app._id}
                            onClick={(e) => e.stopPropagation()}
                            className="[&_li]:gap-3 [&_li]:p-4 [&_p]:truncate"
                          >
                            <ApplicantItem
                              applicant={mapToApplicantData(app)}
                              onDetail={() => handleViewDetail(app)}
                              onApprove={() => onAccept(app)}
                              onReject={() => onReject(app)}
                            />
                          </div>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-1 py-5 text-center text-[13px] text-zinc-700">
                      <CircleAlert size={14} />
                      아직 지원자가 없습니다.
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {(() => {
        const roleInfo = selectedApp
          ? project.recruitRoles.find((r) => r.role === selectedApp.role)
          : null
        const roleApplicants = selectedApp
          ? applicantsByRole[selectedApp.role] || []
          : []
        const acceptedCount = roleApplicants.filter(
          (app) => app.status === 'APPROVED' || app.status === 'ACCEPTED'
        ).length
        const isRoleFilled = roleInfo ? acceptedCount >= roleInfo.cnt : false
        return (
          <ApplicantDetailModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            applicant={selectedApp ? mapToApplicantData(selectedApp) : null}
            isRoleFilled={isRoleFilled}
            onApprove={() => {
              if (!selectedApp) return
              Promise.resolve(onAccept(selectedApp)).then(() => {
                setSelectedApp(null)
                setIsModalOpen(false)
              })
            }}
            onReject={() => {
              if (!selectedApp) return
              Promise.resolve(onReject(selectedApp)).then(() => {
                setSelectedApp(null)
                setIsModalOpen(false)
              })
            }}
          />
        )
      })()}
    </div>
  )
}

export default ProjectApplicantManager
