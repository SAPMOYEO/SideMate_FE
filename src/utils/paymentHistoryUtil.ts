import type { PaymentItem } from '@/types/payment.type'

export function formatPaymentHistoryDate(date: string) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function formatPaymentPlanLabel(payment: PaymentItem) {
  if (payment.type === 'SUBSCRIPTION') {
    if (payment.plan === 'premium') return '구독 - Premium'
    if (payment.plan === 'basic') return '구독 - Basic'
    return '구독 결제'
  }

  return '1회성 결제 (크레딧 충전)'
}

export function formatPaymentMethodLabel(payment: PaymentItem) {
  if (payment.method === 'CARD') {
    return payment.cardLastFour
      ? `카드 (**** ${payment.cardLastFour})`
      : '카드 결제'
  }

  if (payment.bankName && payment.accountNumberMasked) {
    return `현금 (${payment.bankName} ${payment.accountNumberMasked})`
  }

  if (payment.bankName) {
    return `현금 (${payment.bankName})`
  }

  return '현금 결제'
}

export function getPaymentStatusLabel(status: PaymentItem['status']) {
  if (status === 'PAID') return '결제 완료'
  return '결제 취소'
}

export function getPaymentStatusClassName(status: PaymentItem['status']) {
  if (status === 'PAID') {
    return 'bg-emerald-100 text-emerald-600'
  }

  return 'bg-zinc-200 text-zinc-600'
}

export function getPaymentOrderCode(paymentId: string) {
  return `#${paymentId.slice(-6).toUpperCase()}`
}
