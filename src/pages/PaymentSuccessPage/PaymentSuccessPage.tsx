import { CheckCircle2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/features/store'
import { clearPaymentSuccess } from '@/features/slices/paymentSlice'
import { toast } from 'sonner'
import { paymentFormatDateTime } from '@/utils/paymentForm'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const paymentSuccess = useSelector(
    (state: RootState) => state.payment.paymentSuccess
  )

  if (!paymentSuccess) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-16">
        <div className="w-full max-w-[560px] rounded-[32px] border border-zinc-200 bg-white p-8 text-center shadow-sm md:p-10">
          <h1 className="text-2xl font-bold text-zinc-900">
            결제 정보가 없습니다
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            결제 페이지에서 다시 진행해주세요.
          </p>

          <div className="mt-8">
            <Button
              type="button"
              onClick={() => navigate('/payment')}
              className="h-12 rounded-xl bg-[#6366F1] px-6 text-sm font-semibold text-white hover:bg-[#5558e8]"
            >
              결제 페이지로 이동
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleGoMyPage = () => {
    dispatch(clearPaymentSuccess())
    navigate('/my')
  }

  const handleGoHome = () => {
    dispatch(clearPaymentSuccess())
    navigate('/')
  }

  const isCashPayment = paymentSuccess.paymentMethodLabel === '현금 결제'
  const hasCashInfo =
    isCashPayment && !!paymentSuccess.bankName && !!paymentSuccess.accountNumber

  const handleCopyAccountNumber = async () => {
    if (!paymentSuccess.accountNumber) return

    try {
      await navigator.clipboard.writeText(paymentSuccess.accountNumber)
      toast.success('계좌번호가 복사되었습니다.')
    } catch {
      toast.error('계좌번호 복사에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[760px] flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>

        <h1 className="mt-10 text-center text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          결제가 성공적으로 완료되었어요!
        </h1>

        <p className="mt-4 text-center text-base leading-7 text-zinc-500">
          <span className="font-semibold text-[#6366F1]">
            {paymentSuccess.planLabel}
          </span>
          결제가 정상적으로 처리되었어요.
        </p>

        <div className="mt-12 w-full overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 divide-y divide-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-6 py-8 text-center">
              <p className="text-xs font-semibold tracking-[0.12em] text-zinc-400">
                추가된 사용 횟수
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#6366F1]">
                +{paymentSuccess.addedCount}회
              </p>
            </div>

            <div className="px-6 py-8 text-center">
              <p className="text-xs font-semibold tracking-[0.12em] text-zinc-400">
                현재 총 사용 가능 횟수
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
                {paymentSuccess.totalAvailableCount}회
              </p>
            </div>

            <div className="px-6 py-8 text-center">
              <p className="text-xs font-semibold tracking-[0.12em] text-zinc-400">
                결제 금액
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
                ₩{paymentSuccess.amountPaid.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-200 px-6 py-8 sm:px-8">
            <h2 className="text-sm font-bold tracking-[0.08em] text-zinc-700">
              결제 상세 정보
            </h2>

            <div className="mt-6 grid grid-cols-1 items-center gap-y-4 sm:grid-cols-[160px_1fr] sm:gap-x-6">
              <div className="text-sm text-zinc-400">결제 번호</div>
              <div className="text-sm font-semibold text-zinc-900">
                #{paymentSuccess.orderId}
              </div>

              <div className="text-sm text-zinc-400">결제 일시</div>
              <div className="text-sm font-medium text-zinc-900">
                {paymentFormatDateTime(paymentSuccess.paidAt)}
              </div>

              <div className="text-sm text-zinc-400">결제 수단</div>
              <div className="text-sm font-medium text-zinc-900">
                {paymentSuccess.paymentMethodLabel}
              </div>

              {hasCashInfo && (
                <>
                  <div className="text-sm text-zinc-400">입금 은행</div>
                  <div className="text-sm font-medium text-zinc-900">
                    {paymentSuccess.bankName}
                  </div>

                  <div className="text-sm text-zinc-400">입금 계좌번호</div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <span className="text-sm font-semibold text-zinc-900">
                      {paymentSuccess.accountNumber}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyAccountNumber}
                      className="h-9 w-fit rounded-lg px-3 text-xs font-semibold"
                    >
                      <Copy className="mr-1 h-4 w-4" />
                      복사
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            type="button"
            onClick={handleGoHome}
            className="h-12 rounded-xl bg-[#6366F1] px-8 text-sm font-semibold text-white hover:bg-[#5558e8]"
          >
            홈으로 이동
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoMyPage}
            className="h-12 rounded-xl px-8 text-sm font-semibold"
          >
            마이페이지로 이동
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          결제 관련 도움이 필요하신가요?
          <button
            type="button"
            className="font-medium text-[#6366F1] hover:underline"
          >
            고객센터 문의하기
          </button>
        </p>
      </div>
    </div>
  )
}
