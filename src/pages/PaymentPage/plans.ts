import type { Plan } from '@/types/payment.type'

export const plans: Plan[] = [
  {
    key: 'free',
    label: '일반',
    price: 0,
    tokens: 3,
    desc: '로그인한 모든 사용자에게 제공되는 무료 플랜입니다.',
    features: [
      '월 3회 무료 AI 사용',
      '로그인 날짜 기준 1개월마다 리셋',
      '추가 결제 없이 기본 기능 사용 가능',
    ],
  },
  {
    key: 'basic',
    label: '베이직',
    price: 29000,
    tokens: 5,
    desc: '기본 무료 사용에 추가 AI 사용이 필요한 분들을 위한 플랜입니다.',
    features: [
      '무료 제공 3회 AI 사용',
      '구독 추가 2회 AI 사용',
      '총 5회 AI 사용 가능',
      '추가 2회는 결제일 기준 리셋',
    ],
    popular: true,
  },
  {
    key: 'premium',
    label: '프리미엄',
    price: 59000,
    tokens: 8,
    desc: 'AI 사용량이 많은 사용자에게 적합한 플랜입니다.',
    features: [
      '무료 제공 3회 AI 사용',
      '구독 추가 5회 AI 사용',
      '총 8회 AI 사용 가능',
      '추가 5회는 결제일 기준 리셋',
    ],
  },
  {
    key: 'topUp',
    label: '추가 AI 사용',
    price: 9900,
    desc: 'AI 사용 횟수가 부족할 때 필요한 만큼 추가로 구매할 수 있습니다.',
    features: [
      '원하는 횟수만큼 1~10회 선택 가능',
      '구독 없이 1회성 결제',
      '결제 후 즉시 사용 가능',
      '월 리셋 없이 소진 시까지 유지',
    ],
    oneTime: true,
  },
]
