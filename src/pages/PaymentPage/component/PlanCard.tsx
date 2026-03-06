import { Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Plan } from '../plans'

interface PlanCardProps {
  plan: Plan
  active?: boolean
  onSelect?: () => void
  onOpenPolicy?: () => void
}

export default function PlanCard({
  plan,
  active = false,
  onSelect,
  onOpenPolicy,
}: PlanCardProps) {
  return (
    <Card
      className={[
        'h-full rounded-[28px] border bg-white transition-all duration-300',
        active
          ? 'border-[#6366F1] shadow-[0_0_0_4px_rgba(99,102,241,0.12)]'
          : 'border-zinc-200 shadow-none',
      ].join(' ')}
    >
      <CardContent className="flex h-full flex-col p-6 md:p-8">
        <div className="mb-4 min-h-[28px]">
          {plan.popular && active ? (
            <span className="inline-flex rounded-full bg-[#6366F1] px-3 py-1 text-xs font-semibold text-white">
              가장 인기 있는
            </span>
          ) : null}
        </div>

        <h3
          className={[
            'text-2xl font-bold transition-colors duration-300',
            active ? 'text-[#6366F1]' : 'text-zinc-900',
          ].join(' ')}
        >
          {plan.label}
        </h3>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-zinc-900 md:text-5xl">
            ₩{plan.price.toLocaleString()}
          </span>

          {typeof plan.tokens === 'number' && (
            <span className="pb-1 text-sm font-medium text-zinc-500">
              / {plan.tokens}회
            </span>
          )}
        </div>

        <p className="mt-4 min-h-[48px] text-sm leading-6 text-zinc-500">
          {plan.desc}
        </p>

        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-zinc-700"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6366F1]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onOpenPolicy}
          className="mt-6 w-fit cursor-pointer text-xs font-medium text-zinc-500 underline underline-offset-4 transition hover:text-[#6366F1]"
        >
          POLICY
        </button>

        <Button
          type="button"
          onClick={onSelect}
          className={[
            'mt-3 h-12 cursor-pointer rounded-xl text-sm font-semibold transition-colors duration-300',
            active
              ? 'bg-[#6366F1] text-white hover:bg-[#5558e8]'
              : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
          ].join(' ')}
        >
          {plan.oneTime ? '추가 구매하기' : '플랜 구독하기'}
        </Button>
      </CardContent>
    </Card>
  )
}
