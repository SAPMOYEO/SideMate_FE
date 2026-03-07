import * as React from 'react'
import { CreditCard, Landmark } from 'lucide-react'

import type { CarouselApi } from '@/components/ui/carousel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import PlanCard from './PlanCard'
import PolicyDialog from './PolicyDialog'
import { plans, type Plan } from '../plans'

type PaymentMethod = 'card' | 'cash'

export default function PlanCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [, setCurrent] = React.useState(1)
  const [selectedPlanKey, setSelectedPlanKey] = React.useState<Plan['key']>(
    plans[1]?.key ?? plans[0].key
  )
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>('card')
  const [topUpCount, setTopUpCount] = React.useState(1)
  const [isPolicyOpen, setIsPolicyOpen] = React.useState(false)
  const [policyPlan, setPolicyPlan] = React.useState<Plan | null>(null)
  const [isAgreed, setIsAgreed] = React.useState(false)

  React.useEffect(() => {
    if (!api) return

    const updateCurrent = () => {
      const index = api.selectedScrollSnap() % plans.length
      setCurrent(index)

      const activePlan = plans[index]
      if (activePlan) {
        setSelectedPlanKey(activePlan.key)
        setIsAgreed(false)
      }
    }

    api.scrollTo(1, true)
    updateCurrent()

    api.on('select', updateCurrent)

    return () => {
      api.off('select', updateCurrent)
    }
  }, [api])

  const selectedPlan =
    plans.find((plan) => plan.key === selectedPlanKey) ?? plans[0]

  const isTopUpPlan = selectedPlan.key === 'topUp'

  const totalPrice = isTopUpPlan
    ? selectedPlan.price * topUpCount
    : selectedPlan.price

  const handleDecrease = () => {
    setTopUpCount((prev) => Math.max(1, prev - 1))
  }

  const handleIncrease = () => {
    setTopUpCount((prev) => Math.min(10, prev + 1))
  }

  const handleOpenPolicy = (plan: Plan) => {
    setPolicyPlan(plan)
    setIsPolicyOpen(true)
  }

  return (
    <section className="w-full bg-white py-12 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-12 lg:mb-14">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#6366F1] sm:text-4xl md:text-5xl lg:text-6xl">
            플랜 구독하기
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500 sm:text-base">
            필요한 만큼 선택하고, 더 편하게 AI 기능을 사용해보세요.
          </p>
        </div>

        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'center',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {plans.map((plan, index) => {
                const isActive = plan.key === selectedPlanKey

                return (
                  <CarouselItem
                    key={plan.key}
                    className="basis-full pl-3 md:basis-1/2 md:pl-4 lg:basis-1/3"
                  >
                    <div
                      className={[
                        'h-full transition-all duration-300',
                        isActive
                          ? 'scale-100 opacity-100'
                          : 'scale-[0.97] opacity-60',
                      ].join(' ')}
                    >
                      <PlanCard
                        plan={plan}
                        active={isActive}
                        onSelect={() => {
                          setSelectedPlanKey(plan.key)
                          setIsAgreed(false)
                          setCurrent(index)
                          api?.scrollTo(index)
                        }}
                        onOpenPolicy={() => handleOpenPolicy(plan)}
                      />
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            <CarouselPrevious className="top-1/2 left-2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-zinc-200 bg-white text-zinc-900 md:flex" />
            <CarouselNext className="top-1/2 right-2 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 cursor-pointer border-zinc-200 bg-white text-zinc-900 md:flex" />
          </Carousel>
        </div>

        <div className="mt-10 rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 md:mt-14 md:rounded-[28px] md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
              결제 상세 정보
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={[
                'cursor-pointer rounded-2xl border p-4 text-left transition sm:p-5',
                paymentMethod === 'card'
                  ? 'border-[#6366F1] bg-indigo-50/40'
                  : 'border-zinc-200 bg-white hover:border-[#6366F1]',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-[#6366F1]" />
                <div>
                  <div className="text-sm font-semibold text-zinc-900 sm:text-base">
                    카드 결제
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    일반 결제 및 할부 가능
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={[
                'cursor-pointer rounded-2xl border p-4 text-left transition sm:p-5',
                paymentMethod === 'cash'
                  ? 'border-[#6366F1] bg-indigo-50/40'
                  : 'border-zinc-200 bg-white hover:border-[#6366F1]',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-[#6366F1]" />
                <div>
                  <div className="text-sm font-semibold text-zinc-900 sm:text-base">
                    현금 결제
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    계좌이체
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-6">
            <p className="text-xs leading-5 text-zinc-500 sm:text-sm">
              선택한 플랜 기준으로 결제 금액이 표시됩니다.
            </p>

            {isTopUpPlan && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-zinc-700">
                    추가 횟수 선택
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    1회당 9,900원 / 1회~10회 선택 가능
                  </div>
                </div>

                <div className="inline-flex w-fit items-center rounded-xl border border-zinc-200 bg-white">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={topUpCount === 1}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    -
                  </button>

                  <div className="flex h-11 min-w-[56px] items-center justify-center border-x border-zinc-200 text-sm font-semibold text-zinc-900">
                    {topUpCount}
                  </div>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={topUpCount === 10}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm text-zinc-500">
                {isTopUpPlan
                  ? `추가 AI 사용 ${topUpCount}회 선택`
                  : `${selectedPlan.label} 플랜 선택`}
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:justify-end">
                <div>
                  <div className="text-xs text-zinc-500">총 결제 금액</div>
                  <div className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                    ₩{totalPrice.toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!isAgreed}
                  className={[
                    'inline-flex h-12 w-full items-center justify-center rounded-xl px-6 text-sm font-semibold transition sm:w-auto',
                    isAgreed
                      ? 'cursor-pointer bg-[#6366F1] text-white hover:bg-[#5558e8]'
                      : 'cursor-not-allowed bg-zinc-200 text-zinc-400',
                  ].join(' ')}
                >
                  지금 결제하기
                </button>
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#6366F1]"
              />
              <span className="text-sm leading-6 text-zinc-700">
                플랜별 이용 정책, AI 사용 횟수 차감 방식, 결제 및 해지 조건을
                확인하고 동의합니다.
              </span>
            </label>
          </div>
        </div>
      </div>

      <PolicyDialog
        open={isPolicyOpen}
        onOpenChange={setIsPolicyOpen}
        plan={policyPlan}
      />
    </section>
  )
}
