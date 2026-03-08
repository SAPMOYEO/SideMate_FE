// Ai 사용량 관련 타입

export interface AiQuota {
  _id: string
  userId: string
  freeRemaining: number
  freeCycleAnchorAt: string | null
  freeResetAt: string | null
  subExtraRemaining: number
  subExtraResetAt: string | null
  subGrantPerPeriod: number
  subCarryCap: number
  topUpRemaining: number
  totalUsed: number
  holds: {
    topUp: number
    subExtra: number
    free: number
  }
  createdAt: string
  updatedAt: string
}

export interface AiQuotaSummary {
  freeRemaining: number
  topUpRemaining: number
  subExtraRemaining: number
  totalRemaining: number
  totalUsed: number
  subExtraResetAt: string | null
}

export interface AiQuotaState {
  quota: AiQuota | null
  summary: AiQuotaSummary | null
  loading: boolean
  error: string | null
}
