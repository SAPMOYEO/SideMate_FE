import * as React from 'react'
import { CreditCard, Landmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/features/store'

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
import CardPaymentForm, { type CardValue } from './CardPaymentForm'
import CashPaymentForm from './CashPaymentForm'
import { plans, type Plan } from '../plans'

import {
  createPayment,
  changeSubscriptionPlan,
  setPaymentSuccess,
  type PaymentMethod,
} from '@/features/slices/paymentSlice'
import { createRandomAccountNumber } from '@/utils/randomAccountNumber'

function createOrderId() {
  return `TXN-${Date.now()}`
}

function createIdempotencyKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function formatPaymentMethodLabel(method: PaymentMethod, cardNumber?: string) {
  if (method === 'card') {
    const lastFour = cardNumber?.slice(-4) || '0000'
    return `카드 결제 · ${lastFour}`
  }

  return '현금 결제'
}

export default function PlanCarousel() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const subscription = useSelector(
    (state: RootState) => state.payment.subscription
  )
  const paymentLoading = useSelector(
    (state: RootState) => state.payment.submitLoading
  )

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

  const [cardValue, setCardValue] = React.useState<CardValue>({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: '',
  })

  const [bankName, setBankName] = React.useState('')

  React.useEffect(() => {
    if (!api) return

    const updateCurrent = () => {
      const index = api.selectedScrollSnap() % plans.length
      setCurrent(index)

      const activePlan = plans[index]
      if (activePlan) {
        setSelectedPlanKey(activePlan.key)
        setIsAgreed(false)
        setCardValue({
          number: '',
          name: '',
          expiry: '',
          cvc: '',
          focus: '',
        })
        setBankName('')
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
  const isFreePlan = selectedPlan.key === 'free'
  const isSubscriptionPlan =
    selectedPlan.key === 'basic' || selectedPlan.key === 'premium'

  const subscriptionPlan =
    selectedPlan.key === 'basic' || selectedPlan.key === 'premium'
      ? selectedPlan.key
      : null

  const totalPrice = isTopUpPlan
    ? selectedPlan.price * topUpCount
    : selectedPlan.price

  const canShowPaymentForm = isAgreed && !isFreePlan

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

  const getAddedCount = () => {
    if (selectedPlan.key === 'topUp') return topUpCount
    if (selectedPlan.key === 'basic') return 2
    if (selectedPlan.key === 'premium') return 5
    return 0
  }

  const getEstimatedTotalAvailableCount = () => {
    if (selectedPlan.key === 'topUp') return topUpCount
    if (selectedPlan.key === 'basic') return 5
    if (selectedPlan.key === 'premium') return 8
    return 3
  }

  const saveSuccessAndNavigate = (accountNumber?: string) => {
    dispatch(
      setPaymentSuccess({
        addedCount: getAddedCount(),
        totalAvailableCount: getEstimatedTotalAvailableCount(),
        amountPaid: totalPrice,
        orderId: createOrderId(),
        paidAt: new Date().toISOString(),
        paymentMethodLabel: formatPaymentMethodLabel(
          paymentMethod,
          cardValue.number
        ),
        planLabel: selectedPlan.label,
        bankName: paymentMethod === 'cash' ? bankName : undefined,
        accountNumber: paymentMethod === 'cash' ? accountNumber : undefined,
      })
    )

    toast.success('결제가 완료되었습니다.')
    navigate('/payment-success')
  }

  const submitPayment = async () => {
    try {
      if (isFreePlan) return

      const apiMethod = paymentMethod === 'card' ? 'CARD' : 'CASH'

      if (isTopUpPlan) {
        await dispatch(
          createPayment({
            idempotencyKey: createIdempotencyKey('topup'),
            method: apiMethod,
            type: 'TOPUP',
            quantity: topUpCount,
          })
        ).unwrap()

        const accountNumber =
          paymentMethod === 'cash' ? createRandomAccountNumber() : undefined

        saveSuccessAndNavigate(accountNumber)
        return
      }

      if (isSubscriptionPlan) {
        if (!subscriptionPlan) {
          toast.error('잘못된 구독 플랜입니다.')
          return
        }

        const hasActiveSubscription = subscription?.status === 'active'
        const isChangingPlan =
          hasActiveSubscription && subscription?.plan !== subscriptionPlan
        const isSamePlan =
          hasActiveSubscription && subscription?.plan === subscriptionPlan

        if (isSamePlan) {
          toast.error('이미 이용 중인 플랜입니다.')
          return
        }

        if (isChangingPlan) {
          await dispatch(
            changeSubscriptionPlan({
              idempotencyKey: createIdempotencyKey('sub-change'),
              method: apiMethod,
              plan: subscriptionPlan,
            })
          ).unwrap()
        } else {
          await dispatch(
            createPayment({
              idempotencyKey: createIdempotencyKey('sub'),
              method: apiMethod,
              type: 'SUBSCRIPTION',
              plan: subscriptionPlan,
            })
          ).unwrap()
        }

        const accountNumber =
          paymentMethod === 'cash' ? createRandomAccountNumber() : undefined

        saveSuccessAndNavigate(accountNumber)
      }
    } catch (error) {
      console.error(error)
      toast.error('결제 처리에 실패했습니다.')
    }
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
                          setCardValue({
                            number: '',
                            name: '',
                            expiry: '',
                            cvc: '',
                            focus: '',
                          })
                          setBankName('')
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

        {canShowPaymentForm && paymentMethod === 'card' && (
          <CardPaymentForm
            cardValue={cardValue}
            onChange={setCardValue}
            onSubmit={submitPayment}
            totalPrice={totalPrice}
            disabled={paymentLoading}
          />
        )}

        {canShowPaymentForm && paymentMethod === 'cash' && (
          <CashPaymentForm
            bankName={bankName}
            onChangeBank={setBankName}
            onSubmit={submitPayment}
            totalPrice={totalPrice}
            disabled={paymentLoading}
          />
        )}

        <div className="mt-10 rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 md:mt-14 md:rounded-[28px] md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
              결제 상세 정보
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('card')
                setBankName('')
              }}
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
              onClick={() => {
                setPaymentMethod('cash')
                setCardValue({
                  number: '',
                  name: '',
                  expiry: '',
                  cvc: '',
                  focus: '',
                })
              }}
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

            {isFreePlan && (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                무료 플랜은 별도 결제가 필요하지 않습니다.
              </div>
            )}

            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm text-zinc-500">
                {isFreePlan
                  ? '무료 플랜은 결제 없이 바로 사용할 수 있어요.'
                  : isTopUpPlan
                    ? `추가 AI 사용 ${topUpCount}회 선택`
                    : `${selectedPlan.label} 플랜 선택`}
              </div>

              <div>
                <div className="text-xs text-zinc-500">총 결제 금액</div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                  ₩{totalPrice.toLocaleString()}
                </div>
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
