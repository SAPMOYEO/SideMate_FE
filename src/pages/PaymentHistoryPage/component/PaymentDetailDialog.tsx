import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getPaymentDetail } from '@/utils/api/payment'
import type { PaymentItem } from '@/types/payment.type'
import {
  formatPaymentMethodLabel,
  formatPaymentPlanLabel,
  getPaymentStatusLabel,
} from '@/utils/paymentHistoryUtil'
import { paymentFormatDateTime } from '@/utils/paymentForm'

interface PaymentDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentId: string | null
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 text-sm">
      <div className="shrink-0 font-medium text-zinc-500">{label}</div>
      <div className="text-right text-zinc-900">{value}</div>
    </div>
  )
}

export default function PaymentDetailDialog({
  open,
  onOpenChange,
  paymentId,
}: PaymentDetailDialogProps) {
  const [payment, setPayment] = React.useState<PaymentItem | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchDetail = async () => {
      if (!open || !paymentId) return

      try {
        setLoading(true)
        setError(null)

        const data = await getPaymentDetail(paymentId)
        setPayment(data.payment)
      } catch (error) {
        console.error(error)
        setError('결제 상세 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [open, paymentId])

  React.useEffect(() => {
    if (!open) {
      setPayment(null)
      setError(null)
      setLoading(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-2xl p-0">
        <DialogHeader className="border-b border-zinc-100 px-6 py-5">
          <DialogTitle className="text-left text-xl font-bold text-zinc-900">
            결제 상세 내역
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          {loading ? (
            <div className="py-10 text-center text-sm text-zinc-500">
              결제 상세 정보를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-red-500">
              {error}
            </div>
          ) : !payment ? (
            <div className="py-10 text-center text-sm text-zinc-500">
              결제 정보가 없습니다.
            </div>
          ) : (
            <>
              <div className="mb-5 rounded-2xl bg-zinc-50 px-5 py-4">
                <div className="text-xs font-medium text-zinc-500">
                  결제 항목
                </div>
                <div className="mt-2 text-lg font-bold text-zinc-900">
                  {formatPaymentPlanLabel(payment)}
                </div>
              </div>

              <div>
                <DetailRow label="결제 ID" value={payment._id} />
                {/* <DetailRow
                  label="중복 방지 키"
                  value={payment.idempotencyKey}
                /> */}
                <DetailRow
                  label="결제 유형"
                  value={
                    payment.type === 'SUBSCRIPTION' ? '구독 결제' : '1회성 결제'
                  }
                />
                <DetailRow
                  label="결제 수단"
                  value={formatPaymentMethodLabel(payment)}
                />

                {payment.type === 'SUBSCRIPTION' && (
                  <DetailRow
                    label="구독 플랜"
                    value={
                      payment.type === 'SUBSCRIPTION'
                        ? payment.plan === 'premium'
                          ? 'Premium'
                          : 'Basic'
                        : '-'
                    }
                  />
                )}

                {payment.method === 'CARD' && (
                  <DetailRow
                    label="카드 끝자리"
                    value={payment.cardLastFour || '-'}
                  />
                )}

                {payment.method === 'CASH' && (
                  <>
                    <DetailRow label="은행명" value={payment.bankName || '-'} />
                    <DetailRow
                      label="계좌번호"
                      value={payment.accountNumberMasked || '-'}
                    />
                  </>
                )}

                <DetailRow
                  label="수량"
                  value={
                    payment.type === 'TOPUP' ? `${payment.quantity}회` : '-'
                  }
                />
                <DetailRow
                  label="결제 금액"
                  value={`${payment.payAmount.toLocaleString()}원`}
                />
                <DetailRow
                  label="결제 상태"
                  value={getPaymentStatusLabel(payment.status)}
                />
                <DetailRow
                  label="결제 일시"
                  value={paymentFormatDateTime(payment.createdAt)}
                />
                <DetailRow
                  label="최근 수정일"
                  value={paymentFormatDateTime(payment.updatedAt)}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
