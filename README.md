# Sidemate Frontend

## 시작하기

```bash
pnpm install
pnpm dev
```

## 기술 스택

| 분류 | 패키지 |
|------|--------|
| Core | React 19, TypeScript, Vite |
| 스타일 | Tailwind CSS v4, shadcn/ui |
| 상태 관리 | @tanstack/react-query, Redux Toolkit |
| 폼 | react-hook-form + zod |
| 라우팅 | react-router-dom v7 |

## 프로젝트 구조

```
src/
├── components/ui/   # shadcn 컴포넌트
├── lib/utils.ts     # cn() 유틸
├── index.css        # Tailwind + 테마 변수
└── main.tsx         # 전역 프로바이더
```

## 스크립트

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm lint     # 린트
```
