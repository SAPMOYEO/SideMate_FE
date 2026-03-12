export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | string

export interface Application {
  _id: string
  project: string | { _id: string; title?: string }
  applicant: string | { _id: string; name?: string; email?: string }
  role: string
  motivation: string
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
}

export interface CreateApplicationPayload {
  project: string
  role: string
  motivation: string
}

export interface ApplicationListQuery {
  page?: number
  limit?: number
  sort?: 'latest' | 'oldest' | string
}

export interface ApplicationListRes {
  status?: string
  data?: Application[]
  applications?: Application[]
  totalCount?: number
  totalPages?: number
  message?: string
}

export interface NormalizedApplicationListRes {
  data: Application[]
  totalCount: number
  totalPages: number
}

export interface DeleteApplicationRes {
  status: string
  message?: string
}

export interface CreateApplicationRes {
  status: string
  application?: Application
  data?: Application
  project?: Application
  message?: string
}

export type PopulatedApplication = Omit<Application, 'project'> & {
  project: {
    _id: string
    title?: string
    status?: string
    deadline?: string
  }
}

export interface MyApplicationsRes {
  status: string
  data: PopulatedApplication[]
  totalCount: number
  totalPages: number
}
