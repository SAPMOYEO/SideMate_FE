import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchPayments } from '@/features/slices/paymentSlice'
import PaymentDetailDialog from './component/PaymentDetailDialog'
import PaymentCardSkeleton from './component/PaymentCardSkeleton'
import PaymentFilter from './component/PaymentFilter'
import PaymentCard from './component/PaymentCard'
import PaymentHistoryCta from './component/PaymentHistoryCta'

export type FilterType = 'all' | 'SUBSCRIPTION' | 'TOPUP'

const PAGE_SIZE = 3

export default function PaymentHistoryPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const payments = useAppSelector((state) => state.payment.payments)
  const paymentsLoading = useAppSelector(
    (state) => state.payment.paymentsLoading
  )
  const subscription = useAppSelector((state) => state.payment.subscription)

  const [filter, setFilter] = React.useState<FilterType>('all')
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE)
  const [selectedPaymentId, setSelectedPaymentId] = React.useState<
    string | null
  >(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  React.useEffect(() => {
    dispatch(fetchPayments())
  }, [dispatch])

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filter])

  const filteredPayments = payments.filter((payment) => {
    if (filter === 'all') return true
    return payment.type === filter
  })

  const visiblePayments = filteredPayments.slice(0, visibleCount)
  const canShowMore = visibleCount < filteredPayments.length

  const handleOpenDetail = (paymentId: string) => {
    setSelectedPaymentId(paymentId)
    setIsDetailOpen(true)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE)
  }

  const handleSubscriptionStart = () => {
    navigate('/payment')
  }

  const handleSubscriptionManagement = () => {
    navigate('/my')
  }

  return (
    <>
      <div className="w-full py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-zinc-900">결제 내역</h1>
            <p className="mt-3 text-base text-zinc-500">
              지금까지 진행된 모든 결제 및 서비스 이용 내역입니다.
            </p>
          </div>

          <PaymentFilter filter={filter} onChange={setFilter} />

          <div className="space-y-5">
            {paymentsLoading ? (
              <>
                <PaymentCardSkeleton />
                <PaymentCardSkeleton />
                <PaymentCardSkeleton />
              </>
            ) : visiblePayments.length === 0 ? (
              <div className="rounded-[24px] border border-zinc-200 bg-white px-6 py-8 text-center text-sm text-zinc-500 shadow-sm">
                표시할 결제 내역이 없습니다.
              </div>
            ) : (
              visiblePayments.map((payment) => (
                <PaymentCard
                  key={payment._id}
                  payment={payment}
                  onClickDetail={() => handleOpenDetail(payment._id)}
                />
              ))
            )}
          </div>

          {!paymentsLoading && canShowMore && (
            <div className="mt-10 flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleLoadMore}
                className="h-12 rounded-xl px-6 text-sm font-semibold"
              >
                <ChevronDown className="mr-2 h-4 w-4" />
                이전 내역 더보기
              </Button>
            </div>
          )}

          <div className="my-14 h-px w-full bg-zinc-200" />

          <PaymentHistoryCta
            subscription={subscription}
            onClickSubscriptionManagement={handleSubscriptionManagement}
            onClickSubscriptionStart={handleSubscriptionStart}
          />
        </div>
      </div>

      <PaymentDetailDialog
        paymentId={selectedPaymentId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  )
}
