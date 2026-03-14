import api from './api.instance'
import type {
  CreateFeedbackPayload,
  CreateFeedbackResponse,
  DraftProjectFeedbackResponse,
  ProjectFeedbackListResponse,
} from '@/types/feedback.type'

// 프로젝트 모집글 AI 피드백 요청
export const requestProjectFeedback = async (
  payload: CreateFeedbackPayload
): Promise<CreateFeedbackResponse> => {
  const response = await api.post<CreateFeedbackResponse>(
    '/feedback/project',
    payload
  )
  return response.data
}

// 생성 전 draft 피드백 최신 1개 조회
export const fetchLatestDraftProjectFeedback = async (
  tempProjectId: string
): Promise<DraftProjectFeedbackResponse> => {
  const response = await api.get<DraftProjectFeedbackResponse>(
    `/feedback/draft/${tempProjectId}`
  )
  return response.data
}

// 특정 프로젝트의 AI 피드백 목록 조회
export const fetchProjectFeedbacks = async (
  projectId: string
): Promise<ProjectFeedbackListResponse> => {
  const response = await api.get<ProjectFeedbackListResponse>(
    `/feedback/project/${projectId}`
  )
  return response.data
}
