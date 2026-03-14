import { CheckCircle2, XCircle } from 'lucide-react'
import type { PaymentItem } from '@/types/payment.type'
import {
  formatPaymentHistoryDate,
  formatPaymentMethodLabel,
  formatPaymentPlanLabel,
  getPaymentOrderCode,
  getPaymentStatusClassName,
  getPaymentStatusLabel,
} from '@/utils/paymentHistoryUtil'

interface PaymentCardProps {
  payment: PaymentItem
  onClickDetail: () => void
}

function getStatusIcon(status: PaymentItem['status']) {
  if (status === 'PAID') {
    return <CheckCircle2 className="h-4 w-4" />
  }

  return <XCircle className="h-4 w-4" />
}

export default function PaymentCard({
  payment,
  onClickDetail,
}: PaymentCardProps) {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white px-6 py-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={onClickDetail}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-400">
            {payment.type === 'SUBSCRIPTION' &&
              payment.plan === 'premium' &&
              payment.status === 'PAID' && (
                <span className="rounded-md bg-indigo-50 px-2 py-1 text-[#6366F1]">
                  NEW
                </span>
              )}
            <span>{getPaymentOrderCode(payment._id)}</span>
          </div>

          <h3 className="text-2xl font-bold text-zinc-900">
            {formatPaymentPlanLabel(payment)}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
            <span>
              {payment.type === 'TOPUP' ? (
                <>
                  9,900원 × {payment.quantity}회
                  <span className="font-semibold text-[#6366F1]">
                    합계 {payment.payAmount.toLocaleString()}원
                  </span>
                </>
              ) : (
                `${payment.payAmount.toLocaleString()}원`
              )}
            </span>

            <span>|</span>
            <span>{formatPaymentMethodLabel(payment)}</span>
            <span>|</span>
            <span>{formatPaymentHistoryDate(payment.createdAt)}</span>
          </div>
        </button>

        <div
          className={[
            'inline-flex w-fit shrink-0 items-center justify-center gap-1.5 self-end rounded-full px-4 py-2 text-sm font-semibold md:self-auto',
            getPaymentStatusClassName(payment.status),
          ].join(' ')}
        >
          {getStatusIcon(payment.status)}
          <span>{getPaymentStatusLabel(payment.status)}</span>
        </div>
      </div>
    </div>
  )
}
