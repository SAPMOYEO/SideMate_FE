import type {
  Application,
  ApplicationListQuery,
  ApplicationListRes,
  CreateApplicationPayload,
  CreateApplicationRes,
  DeleteApplicationRes,
  NormalizedApplicationListRes,
} from '@/types/application'
import api from './api.instance'

/** 프로젝트 지원 */
export const createApplication = async (
  payload: CreateApplicationPayload
): Promise<Application> => {
  const { data } = await api.post<CreateApplicationRes>('/application', payload)
  const application = data.application ?? data.data ?? data.project

  if (application) {
    return application
  }

  if (data.status === 'success') {
    const now = new Date().toISOString()
    return {
      _id: '',
      project: payload.project,
      applicant: '',
      role: payload.role,
      motivation: payload.motivation,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    }
  }

  throw new Error(data.message ?? '지원 결과를 확인할 수 없습니다.')
}

const isApplication = (value: unknown): value is Application => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>

  return (
    typeof candidate._id === 'string' &&
    typeof candidate.role === 'string' &&
    typeof candidate.motivation === 'string' &&
    typeof candidate.status === 'string'
  )
}

/** 지원 목록 조회 */
export const fetchApplicationsByProjectId = async (
  projectId: string,
  query: ApplicationListQuery = {}
): Promise<NormalizedApplicationListRes> => {
  try {
    const { data } = await api.get<ApplicationListRes>(
      `/application/${projectId}`,
      { params: query }
    )

    const rawList = (data.data ?? data.applications ?? []).filter(isApplication)

    return {
      data: rawList,
      totalCount: data.totalCount ?? rawList.length,
      totalPages: data.totalPages ?? 1,
    }
  } catch (error) {
    console.error('지원 목록 조회 실패:', error)
    return {
      data: [],
      totalCount: 0,
      totalPages: 1,
    }
  }
}

/** 지원 취소 */
export const deleteApplication = async (
  applicationId: string
): Promise<DeleteApplicationRes> => {
  const { data } = await api.delete<DeleteApplicationRes>(
    `/application/${applicationId}`
  )
  return data
}
