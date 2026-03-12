// 결제 관련 타입

import type { AiQuota } from './aiQuota.type'

// 결제 플랜
export type Plan = {
  key: 'free' | 'basic' | 'premium' | 'topUp'
  label: string
  price: number
  tokens?: number
  desc: string
  features: string[]
  popular?: boolean
  oneTime?: boolean
}

// 카드 결제 정보
export interface CardValue {
  number: string
  name: string
  expiry: string
  cvc: string
  focus: 'number' | 'name' | 'expiry' | 'cvc' | ''
}

// 각 플랜 정책
export type PolicySection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
  example?: string[]
}

// 결과 응답타입
export interface PaymentResponse {
  status: 'success'
  payment: PaymentItem
  quota: AiQuota
  subscription?: Subscription | null
  user?: unknown
  message?: string
}

export interface CancelSubscriptionResponse {
  status: 'success'
  subscription: Subscription | null
  quota: AiQuota | null
  user?: unknown
  message?: string
}

// paymentSlice.ts
export type PaymentMethod = 'card' | 'cash'
export type PaymentPlanKey = 'free' | 'basic' | 'premium' | 'topUp'
export type PaymentApiMethod = 'CARD' | 'CASH'
export type PaymentApiType = 'TOPUP' | 'SUBSCRIPTION'

export interface PaymentItem {
  _id: string
  userId: string
  idempotencyKey: string
  method: PaymentApiMethod
  type: PaymentApiType
  plan?: 'basic' | 'premium'
  quantity: number
  payAmount: number
  status: 'PAID' | 'CANCELED'
  cardLastFour?: string
  bankName?: string
  accountNumberMasked?: string
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  _id: string
  userId: string
  plan: 'basic' | 'premium'
  status: 'active' | 'canceled'
  canceledAt: string | null
  currentPeriodStart: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
}

export interface CheckoutDraft {
  planKey: PaymentPlanKey
  paymentMethod: PaymentMethod
  topUpCount: number
  totalPrice: number
  agreed: boolean
  isTopUp: boolean
}

export interface GetPaymentDetailResponse {
  status: 'success'
  payment: PaymentItem
}

export interface PaymentSuccessData {
  addedCount: number
  totalAvailableCount: number
  amountPaid: number
  orderId: string
  paidAt: string
  paymentMethodLabel: string
  planLabel: string
  bankName?: string
  accountNumber?: string
}

export interface PaymentState {
  payments: PaymentItem[]
  subscription: Subscription | null
  checkoutDraft: CheckoutDraft | null
  paymentSuccess: PaymentSuccessData | null

  paymentsLoading: boolean
  paymentsError: string | null

  cancelLoading: boolean
  cancelError: string | null

  submitLoading: boolean
  submitError: string | null
}
