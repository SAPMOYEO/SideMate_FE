import api from './api.instance'

export type PaymentApiMethod = 'CARD' | 'CASH'
export type PaymentApiType = 'TOPUP' | 'SUBSCRIPTION'

export interface CreatePaymentPayload {
  idempotencyKey: string
  method: PaymentApiMethod
  type: PaymentApiType
  quantity?: number
  plan?: 'basic' | 'premium'
}

/** 구독 플랜 변경 */
export interface ChangeSubscriptionPlanPayload {
  idempotencyKey: string
  method: PaymentApiMethod
  plan: 'basic' | 'premium'
}

/** 결제 목록 + 현재 구독 상태 조회 */
export const getPayments = async () => {
  const response = await api.get('/payment')
  return response.data
}

/** TOPUP 결제 / 신규 구독 결제 */
export const postPayment = async (payload: CreatePaymentPayload) => {
  const response = await api.post('/payment', payload)
  return response.data
}

/** 구독 플랜 변경 */
export const patchSubscriptionPlan = async (
  payload: ChangeSubscriptionPlanPayload
) => {
  const response = await api.patch('/payment/subscription', payload)
  return response.data
}

/** 구독 해지 */
export const deleteSubscription = async () => {
  const response = await api.delete('/payment/subscription')
  return response.data
}
