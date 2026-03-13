// AI 피드백 관련 타입

// 피드백 요청 타입
export type FeedbackType = 'project-create-draft' | 'project-detail'

// 모집 역할 payload 타입
export interface RecruitRoleFeedbackPayload {
  role: string
  cnt: number
}

// AI 피드백 요청 시 보낼 프로젝트 스냅샷
export interface FeedbackInputSnapshot {
  title: string
  category: string
  description: string
  goal: string
  startDate: string
  endDate: string
  requiredTechStack: string[]
  recruitRoles: RecruitRoleFeedbackPayload[]
  totalCnt: number
  deadline: string
  communicationMethod: string
  gitUrl?: string
}

// AI 피드백 생성 요청 payload
export interface CreateFeedbackPayload {
  projectId?: string | null
  requestId: string
  tempProjectId: string
  type: FeedbackType
  inputSnapshot: FeedbackInputSnapshot
}

// AI 피드백 본문 데이터
export interface FeedbackItem {
  overallComment: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

// quota 요약 정보
export interface FeedbackSummary {
  freeRemaining: number
  topUpRemaining: number
  subExtraRemaining: number
  totalRemaining: number
  totalUsed: number
  subExtraResetAt: string | null
}

// AI 피드백 생성 응답
export interface CreateFeedbackResponse {
  status: 'success'
  feedbackId: string
  feedback: FeedbackItem
  quota: unknown
  summary: FeedbackSummary
}

// 프로젝트에 연결된 AI 피드백 1개 데이터
export interface ProjectFeedback {
  _id: string
  type: FeedbackType
  overallComment: string
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  fullResponse: string[]
  inputSnapshot: FeedbackInputSnapshot
  createdAt: string
  updatedAt: string
}

// 생성 전 draft 피드백 최신 1개 조회 응답
export interface DraftProjectFeedbackResponse {
  status: 'success'
  data: ProjectFeedback | null
}

// 프로젝트 AI 피드백 목록 조회 응답
export interface ProjectFeedbackListResponse {
  status: 'success'
  data: ProjectFeedback[]
}

// feedback slice 상태
export interface FeedbackState {
  feedbackId: string | null
  feedback: FeedbackItem | null
  summary: FeedbackSummary | null

  submitLoading: boolean
  submitError: string | null
}
