import type { ApplicationStatus, PopulatedApplicantUser } from './application'

/** ApplicantDetailModal / ApplicantItem 등에서 공통으로 사용하는 지원자 상세 타입 */
export interface ApplicantDetail {
  _id: string
  name: string
  time: string
  role: string
  stack: string
  status: ApplicationStatus
  motivation?: string
  profileImage?: string
  bio?: string
  gitUrl?: string
  privacySettings?: {
    isImagePublic: boolean
    isGithubPublic: boolean
    isBioPublic: boolean
  }
}

/** Application → ApplicantDetail 변환 유틸 */
export const mapApplicationToApplicantDetail = (app: {
  _id: string
  applicant: string | PopulatedApplicantUser
  role: string
  motivation?: string
  status: ApplicationStatus
  createdAt: string
}): ApplicantDetail => {
  const isPopulated = (val: unknown): val is PopulatedApplicantUser =>
    typeof val === 'object' && val !== null && '_id' in val

  const user = isPopulated(app.applicant) ? app.applicant : null
  const profile = user?.profile ?? {}
  const techStack = Array.isArray(profile.techStack) ? profile.techStack : []

  return {
    _id: app._id,
    name: user?.name ?? '알 수 없음',
    time: app.createdAt,
    role: app.role ?? '',
    stack: techStack.length > 0 ? techStack.join(', ') : '',
    status: app.status,
    motivation: app.motivation ?? '',
    profileImage: profile.profileImage,
    bio: profile.bio,
    gitUrl: profile.gitUrl,
    privacySettings: user?.privacySettings,
  }
}
