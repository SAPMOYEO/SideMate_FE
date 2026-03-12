import type { ApplicationStatus } from '@/types/application'

export interface MappedApplicant {
  _id: string
  name: string
  time: string
  role: string
  stack: string
  motivation: string
  status: ApplicationStatus
}
