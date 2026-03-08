export type UserRole = 'user' | 'admin'
export type UserTier = 'FREE' | 'PRO'

export interface UserProfile {
  gender?: string
  techStack?: string[]
  gitUrl?: string
}

export interface UserTypes {
  _id: string
  email: string
  password: string
  name: string
  phone: string
  role: UserRole
  techStacks: string[]
  profile?: UserProfile
  tier: UserTier
  marketingAgree: boolean
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export type UserResponse = Omit<UserTypes, 'password'>
