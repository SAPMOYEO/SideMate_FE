import type { User } from '@/features/slices/userSlice'

export interface ProjectRes {
  data: Project[]
  totalCount: number
  totalPages: number
}

export interface ProjectDetailRes {
  status: string
  data: Project
}

export interface Project {
  _id: string
  title: string
  category: string
  description: string
  goal: string

  startDate: string
  endDate: string

  requiredTechStack: string[]

  recruitRoles: RecruitRole[]

  totalCnt: number

  deadline: string

  communicationMethod: string

  status: string

  author: ProjectAuthor

  gitUrl?: string

  aiFeedbackIds?: string[]

  hiddenYn: boolean

  createdAt: string
  updatedAt: string
}

export type ProjectAuthor = Pick<User, '_id' | 'name' | 'email'>

export interface RecruitRole {
  role: string
  cnt: number
}

export interface ProjectFilter {
  title?: string

  category?: string[]

  requiredTechStack?: string[]

  status?: string

  startDate?: string
  endDate?: string

  deadlineStartDate?: string
  deadlineEndDate?: string
}

export interface ProjectFilterState {
  title: string

  category: string[]

  requiredTechStack: string[]

  status: string

  startDate: string
  endDate: string

  deadlineStartDate: string
  deadlineEndDate: string
}

export const initialProjectFilter: ProjectFilterState = {
  title: '',
  category: [],
  requiredTechStack: [],
  status: '',
  startDate: '',
  endDate: '',
  deadlineStartDate: '',
  deadlineEndDate: '',
}

export interface ProjectSearchParams extends ProjectFilter {
  page?: number
  limit?: number
  sort?: 'latest' | 'oldest'
}

export interface CreateProjectRole {
  role: string
  cnt: number
}

export interface CreateProjectPayload {
  title: string
  category: string
  description: string
  goal: string
  startDate: string
  endDate: string
  requiredTechStack: string[]
  mandatoryTechStack: string[]
  recruitRoles: CreateProjectRole[]
  totalCnt: number
  deadline: string
  communicationMethod: string
  status: string
  gitUrl?: string
  aiFeedbackIds?: string[]
}

export interface CreateProjectRes {
  status: string
  project: Project
}

export interface DeleteProjectRes {
  status: string
}
