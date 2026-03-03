# Sidemate Frontend

## 시작하기

```bash
pnpm install
pnpm dev
```

## 기술 스택

| 분류      | 패키지                               |
| --------- | ------------------------------------ |
| Core      | React 19, TypeScript, Vite           |
| 스타일    | Tailwind CSS v4, shadcn/ui           |
| 상태 관리 | @tanstack/react-query, Redux Toolkit |
| 폼        | react-hook-form + zod                |
| 라우팅    | react-router-dom v7                  |

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

## 코드 품질 (ESLint + Husky)

### ESLint 전략

`typescript-eslint recommended` 기반으로 아래 항목은 커밋 차단.

| 위반 항목        | 출처                                               |
| ---------------- | -------------------------------------------------- |
| `any` 타입 사용  | ESLint `no-explicit-any`                           |
| 미사용 변수·함수 | TypeScript `noUnusedLocals` / `noUnusedParameters` |
| 미사용 import    | TypeScript `noUnusedLocals`                        |

### Husky + lint-staged

`git commit` 시 staged 파일에만 자동으로 린트·포맷 실행.

| 대상              | 실행                            |
| ----------------- | ------------------------------- |
| `*.{ts,tsx}`      | eslint --fix → prettier --write |
| `*.{css,json,md}` | prettier --write                |

### 초기 세팅

`pnpm install` 시 `prepare` 스크립트가 자동 실행되어 훅이 등록됩니다. 별도 작업 불필요.
