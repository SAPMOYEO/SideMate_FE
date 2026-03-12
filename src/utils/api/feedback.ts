import api from './api.instance'
import type {
  CreateFeedbackPayload,
  CreateFeedbackResponse,
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
