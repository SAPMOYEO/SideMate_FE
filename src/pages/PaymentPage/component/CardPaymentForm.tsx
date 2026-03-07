import * as React from 'react'
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface CardValue {
  number: string
  name: string
  expiry: string
  cvc: string
  focus: 'number' | 'name' | 'expiry' | 'cvc' | ''
}

interface CardPaymentFormProps {
  cardValue: CardValue
  onChange: (value: CardValue) => void
  onSubmit: () => void
  disabled?: boolean
  totalPrice: number
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16)
}

function formatExpiry(value: string) {
  const onlyNumber = value.replace(/\D/g, '').slice(0, 4)

  if (onlyNumber.length < 3) return onlyNumber
  return `${onlyNumber.slice(0, 2)}/${onlyNumber.slice(2)}`
}

function formatCvc(value: string) {
  return value.replace(/\D/g, '').slice(0, 3)
}

export default function CardPaymentForm({
  cardValue,
  onChange,
  onSubmit,
  disabled = false,
  totalPrice,
}: CardPaymentFormProps) {
  const handleFocus = (field: CardValue['focus']) => () => {
    onChange({
      ...cardValue,
      focus: field,
    })
  }

  const handleBlur = () => {
    onChange({
      ...cardValue,
      focus: '',
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'number') {
      onChange({
        ...cardValue,
        number: formatCardNumber(value),
      })
      return
    }

    if (name === 'expiry') {
      onChange({
        ...cardValue,
        expiry: formatExpiry(value),
      })
      return
    }

    if (name === 'cvc') {
      onChange({
        ...cardValue,
        cvc: formatCvc(value),
      })
      return
    }

    onChange({
      ...cardValue,
      [name]: value,
    })
  }

  const isCardValid =
    cardValue.number.length === 16 &&
    cardValue.name.trim().length > 0 &&
    cardValue.expiry.length === 5 &&
    cardValue.cvc.length === 3

  const isSubmitDisabled = disabled || !isCardValid

  return (
    <div className="mt-8 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900">카드 결제 정보</h3>
        <p className="mt-2 text-sm text-zinc-500">
          카드 정보를 입력한 뒤 결제를 진행해주세요.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-[320px]">
          <div className="overflow-hidden rounded-2xl">
            <Cards
              cvc={cardValue.cvc}
              expiry={cardValue.expiry.replace('/', '')}
              focused={cardValue.focus}
              name={cardValue.name}
              number={cardValue.number}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4">
            <Input
              type="tel"
              name="number"
              placeholder="카드 번호"
              value={cardValue.number}
              onChange={handleInputChange}
              onFocus={handleFocus('number')}
              onBlur={handleBlur}
            />

            <Input
              type="text"
              name="name"
              placeholder="카드 소유자명"
              value={cardValue.name}
              onChange={handleInputChange}
              onFocus={handleFocus('name')}
              onBlur={handleBlur}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={cardValue.expiry}
                onChange={handleInputChange}
                onFocus={handleFocus('expiry')}
                onBlur={handleBlur}
              />

              <Input
                type="text"
                name="cvc"
                placeholder="CVC"
                value={cardValue.cvc}
                onChange={handleInputChange}
                onFocus={handleFocus('cvc')}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              카드로 결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
