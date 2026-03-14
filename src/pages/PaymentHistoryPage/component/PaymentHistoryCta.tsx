import { CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Subscription } from '@/types/payment.type'

interface PaymentHistoryCtaProps {
  subscription: Subscription | null
  onClickSubscriptionManagement: () => void
  onClickSubscriptionStart: () => void
}

export default function PaymentHistoryCta({
  subscription,
  onClickSubscriptionManagement,
  onClickSubscriptionStart,
}: PaymentHistoryCtaProps) {
  return (
    <div className="rounded-[28px] bg-indigo-50 px-6 py-12 text-center sm:px-10">
      <h2 className="text-3xl font-bold text-zinc-900">
        추가 결제가 필요하신가요?
      </h2>

      <p className="mt-3 text-base text-zinc-500">
        원하시는 플랜을 선택하고 지금 바로 최고의 서비스를 경험해보세요.
      </p>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onClickSubscriptionManagement}
          className="h-12 rounded-xl px-8 text-sm font-semibold"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          구독 관리
        </Button>

        <Button
          type="button"
          onClick={onClickSubscriptionStart}
          className="h-12 rounded-xl bg-[#6366F1] px-8 text-sm font-semibold text-white hover:bg-[#5558e8]"
        >
          구독 시작하기
        </Button>
      </div>

      {subscription?.status === 'active' && (
        <p className="mt-4 text-sm text-zinc-500">
          현재
          <span className="font-semibold text-zinc-900">
            {subscription.plan === 'premium' ? 'Premium' : 'Basic'}
          </span>
          플랜을 이용 중입니다.
        </p>
      )}
    </div>
  )
}
