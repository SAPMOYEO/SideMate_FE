import * as React from 'react'
import type { FilterType } from '../PaymentHistoryPage'

interface PaymentFilterProps {
  filter: FilterType
  onChange: (value: FilterType) => void
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-4 py-2 text-sm font-medium transition',
        active
          ? 'border-[#6366F1] bg-[#6366F1] text-white'
          : 'border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default function PaymentFilter({
  filter,
  onChange,
}: PaymentFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <FilterButton active={filter === 'all'} onClick={() => onChange('all')}>
        전체
      </FilterButton>

      <FilterButton
        active={filter === 'SUBSCRIPTION'}
        onClick={() => onChange('SUBSCRIPTION')}
      >
        구독 결제
      </FilterButton>

      <FilterButton
        active={filter === 'TOPUP'}
        onClick={() => onChange('TOPUP')}
      >
        1회성 결제
      </FilterButton>
    </div>
  )
}
