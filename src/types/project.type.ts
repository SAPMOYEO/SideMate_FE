// ── 공통 서브타입 ────────────────────────────────────────
export interface RecruitRole {
  _id: string
  role: string
  cnt: number
}

// ── 베이스 (DB 문서 기준) ────────────────────────────────
export interface ProjectTypes {
  _id: string
  title: string
  category: string
  description: string
  goal: string
  startDate: string
  endDate: string
  requiredTechStack: string[]
  mandatoryTechStack: string[]
  recruitRoles: RecruitRole[]
  totalCnt: number
  deadline: string
  communicationMethod: string
  status: string
  author: string
  gitUrl?: string
  aiFeedbackIds: string[]
  hiddenYn: boolean
  createdAt: string
  updatedAt: string
}

// ── 파생 타입 ────────────────────────────────────────────

// API 응답용 — DB 내부 관리 필드 제거
export type ProjectResponse = ProjectTypes

// 등록 payload — 서버/DB가 자동 생성하는 필드 제거
export type CreateProjectPayload = Omit<
  ProjectTypes,
  '_id' | 'author' | 'hiddenYn' | 'aiFeedbackIds' | 'createdAt' | 'updatedAt'
>

// 수정 payload — 등록과 동일하되 전부 optional
export type UpdateProjectPayload = Partial<CreateProjectPayload>
