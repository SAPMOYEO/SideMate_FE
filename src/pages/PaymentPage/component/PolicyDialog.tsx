import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Plan, PolicySection } from '@/types/payment.type'

interface PolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Plan | null
}

const commonPolicy: PolicySection = {
  title: '공통 안내',
  paragraphs: [
    'AI 사용 횟수는 플랜에 따라 제공 방식이 다르지만, 실제 차감될 때는 같은 순서로 적용됩니다.',
    '무료 사용 횟수는 로그인한 날짜를 기준으로 1개월마다 다시 채워지며, 구독 플랜의 추가 횟수는 결제일을 기준으로 다시 채워집니다.',
    '1회성으로 구매한 추가 횟수는 월 단위로 사라지지 않으며 모두 사용할 때까지 유지됩니다.',
  ],
  bullets: [
    '1순위: 1회성 결제로 구매한 추가 사용 횟수',
    '2순위: 구독 플랜으로 제공되는 추가 사용 횟수',
    '3순위: 무료 사용 횟수',
  ],
}

const planPolicyMap: Record<Plan['key'], PolicySection> = {
  free: {
    title: '일반 플랜 이용 정책',
    paragraphs: [
      '일반 플랜은 로그인한 모든 사용자에게 제공되는 기본 플랜입니다.',
      '월 3회의 무료 AI 사용이 가능하며, 무료 횟수는 로그인 날짜 기준으로 1개월마다 다시 채워집니다.',
      '별도의 구독 혜택은 없지만 필요할 때 1회성 결제로 추가 AI 사용 횟수를 구매할 수 있습니다.',
    ],
    example: [
      '예시',
      '4월 10일에 처음 로그인했다면 무료 3회는 5월 10일에 다시 채워집니다.',
    ],
  },
  basic: {
    title: '베이직 플랜 이용 정책',
    paragraphs: [
      '베이직 플랜은 월 29,000원으로 AI 기능을 조금 더 자주 사용하는 분께 적합한 플랜입니다.',
      '무료 3회에 더해 구독 전용 2회가 추가되어 총 5회까지 사용할 수 있습니다.',
      '무료 3회는 로그인 날짜 기준으로, 추가 2회는 결제일 기준으로 다시 채워집니다.',
    ],
    bullets: [
      '무료 사용: 3회',
      '구독 추가 사용: 2회',
      '총 사용 가능 횟수: 5회',
    ],
    example: [
      '예시',
      '총 5회 중 4회를 사용했다면 먼저 추가 2회가 차감되고 그다음 무료 2회가 차감됩니다. 이 경우 무료 1회가 남습니다.',
      '이 상태에서 구독을 해지하면 추가 2회는 소멸되고 남아 있는 무료 1회만 로그인 기준 리셋 전까지 사용할 수 있습니다.',
    ],
  },
  premium: {
    title: '프리미엄 플랜 이용 정책',
    paragraphs: [
      '프리미엄 플랜은 월 59,000원으로 AI 기능을 자주 사용하는 분께 적합한 플랜입니다.',
      '무료 3회에 더해 구독 전용 5회가 추가되어 총 8회까지 사용할 수 있습니다.',
      '무료 3회는 로그인 날짜 기준으로, 추가 5회는 결제일 기준으로 다시 채워집니다.',
    ],
    bullets: [
      '무료 사용: 3회',
      '구독 추가 사용: 5회',
      '총 사용 가능 횟수: 8회',
    ],
    example: [
      '예시',
      '프리미엄에서 AI를 사용할 때도 먼저 추가 5회가 차감되고 이후 무료 3회가 차감됩니다.',
      '구독을 해지하면 남아 있던 추가 5회는 소멸되고 무료 횟수만 남아 있다면 로그인 기준 리셋 전까지 사용할 수 있습니다.',
    ],
  },
  topUp: {
    title: '추가 AI 사용 이용 정책',
    paragraphs: [
      '추가 AI 사용은 기존 플랜과 별도로 필요한 만큼 AI 사용 횟수를 더 구매할 수 있는 1회성 상품입니다.',
      '1회당 9,900원이며 1회부터 10회까지 원하는 수량으로 선택할 수 있습니다.',
      '결제한 횟수는 즉시 추가되며 월 리셋 없이 모두 사용할 때까지 유지됩니다.',
    ],
    bullets: [
      '1회당 9,900원',
      '1회~10회 선택 가능',
      '월 리셋 없음',
      'AI 사용 시 가장 먼저 차감',
    ],
    example: [
      '예시',
      '3회를 추가 구매했다면 총 사용 가능 횟수에 3회가 더해지고 이후 AI를 사용할 때 가장 먼저 이 3회부터 차감됩니다.',
      '이 상품은 1회성 결제이기 때문에 결제 후 중간 해지나 취소는 불가합니다.',
    ],
  },
}

function PolicySectionBlock({ section }: { section: PolicySection }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h3 className="text-base font-semibold text-zinc-900">{section.title}</h3>

      <div className="mt-3 space-y-3 text-sm leading-6 text-zinc-600">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {section.bullets && (
        <ul className="mt-4 space-y-2 text-sm text-zinc-700">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {section.example && (
        <div className="mt-4 rounded-xl bg-indigo-50/60 p-4">
          <p className="text-sm font-semibold text-[#6366F1]">
            {section.example[0]}
          </p>
          <div className="mt-2 space-y-2 text-sm leading-6 text-zinc-700">
            {section.example.slice(1).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default function PolicyDialog({
  open,
  onOpenChange,
  plan,
}: PolicyDialogProps) {
  if (!plan) return null

  const planPolicy = planPolicyMap[plan.key]
  const showCancelGuide = plan.key === 'basic' || plan.key === 'premium'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-[720px] overflow-y-auto rounded-3xl p-0">
        <DialogHeader className="border-b border-zinc-100 px-6 py-5 text-left sm:px-8">
          <DialogTitle className="text-2xl font-bold text-zinc-900">
            {plan.label} POLICY
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-zinc-500">
            플랜별 이용 정책, AI 사용 횟수 차감 방식, 결제 및 해지 조건을 쉽게
            확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-6 sm:px-8 sm:py-8">
          <PolicySectionBlock section={commonPolicy} />
          <PolicySectionBlock section={planPolicy} />

          {showCancelGuide && (
            <section className="rounded-2xl border border-zinc-200 bg-white p-5">
              <h3 className="text-base font-semibold text-zinc-900">
                구독 해지 시 안내
              </h3>
              <div className="mt-3 space-y-3 text-sm leading-6 text-zinc-600">
                <p>
                  구독을 중간에 해지하면 구독 플랜에 포함된 추가 AI 사용 횟수는
                  더 이상 사용할 수 없습니다.
                </p>
                <p>
                  다만 무료 사용 횟수는 이미 사용한 수량을 제외한 나머지만
                  유지됩니다. 다음 로그인 기준 리셋 시점이 되면 일반 사용자
                  기준인 무료 3회가 다시 채워집니다.
                </p>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
