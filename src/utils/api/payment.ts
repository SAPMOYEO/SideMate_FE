import api from './api.instance'
import type {
  PaymentResponse,
  CancelSubscriptionResponse,
  Subscription,
  PaymentItem,
  GetPaymentDetailResponse,
} from '@/types/payment.type'

export type PaymentApiMethod = 'CARD' | 'CASH'
export type PaymentApiType = 'TOPUP' | 'SUBSCRIPTION'

export interface CreatePaymentPayload {
  idempotencyKey: string
  method: PaymentApiMethod
  type: PaymentApiType
  quantity?: number
  plan?: 'basic' | 'premium'
  cardLastFour?: string
  bankName?: string
  accountNumberMasked?: string
}

/** 구독 플랜 변경 */
export interface ChangeSubscriptionPlanPayload {
  idempotencyKey: string
  method: PaymentApiMethod
  plan: 'basic' | 'premium'
  cardLastFour?: string
  bankName?: string
  accountNumberMasked?: string
}

export interface GetPaymentsResponse {
  status: 'success'
  payments: PaymentItem[]
  subscription: Subscription | null
}

/** 결제 목록 + 현재 구독 상태 조회 */
export const getPayments = async (): Promise<GetPaymentsResponse> => {
  const response = await api.get<GetPaymentsResponse>('/payment')
  return response.data
}

/** 결제 상세 조회 */
export const getPaymentDetail = async (
  id: string
): Promise<GetPaymentDetailResponse> => {
  const response = await api.get<GetPaymentDetailResponse>(`/payment/${id}`)
  return response.data
}

/** TOPUP 결제 / 신규 구독 결제 */
export const postPayment = async (
  payload: CreatePaymentPayload
): Promise<PaymentResponse> => {
  const response = await api.post<PaymentResponse>('/payment', payload)
  return response.data
}

/** 구독 플랜 변경 */
export const patchSubscriptionPlan = async (
  payload: ChangeSubscriptionPlanPayload
): Promise<PaymentResponse> => {
  const response = await api.patch<PaymentResponse>(
    '/payment/subscription',
    payload
  )
  return response.data
}

/** 구독 해지 */
export const deleteSubscription =
  async (): Promise<CancelSubscriptionResponse> => {
    const response = await api.delete<CancelSubscriptionResponse>(
      '/payment/subscription'
    )
    return response.data
  }
