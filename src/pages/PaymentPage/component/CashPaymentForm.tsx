import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CashPaymentFormProps {
  bankName: string
  onChangeBank: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  totalPrice: number
}

const BANK_OPTIONS = [
  '국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  '카카오뱅크',
  '토스뱅크',
  '농협은행',
] as const

export default function CashPaymentForm({
  bankName,
  onChangeBank,
  onSubmit,
  disabled = false,
  totalPrice,
}: CashPaymentFormProps) {
  const isSubmitDisabled = disabled || !bankName

  return (
    <div className="mt-8 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900">현금 결제 정보</h3>
        <p className="mt-2 text-sm text-zinc-500">
          입금할 은행을 선택한 뒤 결제를 진행해주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="mb-2 text-sm font-medium text-zinc-700">
            입금 은행 선택
          </div>
          <Select value={bankName} onValueChange={onChangeBank}>
            <SelectTrigger className="h-12 w-full rounded-xl">
              <SelectValue placeholder="은행을 선택해주세요." />
            </SelectTrigger>
            <SelectContent>
              {BANK_OPTIONS.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-600">
            선택한 은행 기준으로 입금 절차가 진행됩니다.
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-end">
          <div>
            <div className="text-xs text-zinc-500">결제 예정 금액</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900">
              ₩{totalPrice.toLocaleString()}
            </div>
          </div>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="h-12 rounded-xl bg-[#6366F1] px-6 text-sm font-semibold text-white hover:bg-[#5558e8] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            현금으로 결제하기
          </Button>
        </div>
      </div>
    </div>
  )
}
