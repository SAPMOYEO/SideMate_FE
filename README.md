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
├── components/
│   ├── ui/          # shadcn 컴포넌트
│   ├── shared/      # 공통 컴포넌트 (Header 등)
│   └── icons/       # 아이콘 컴포넌트
├── features/        # Redux slice, store
├── hooks/           # 커스텀 훅
├── layout/          # 레이아웃 컴포넌트 (AppLayout 등)
├── lib/             # 유틸리티 (cn 등)
├── pages/           # 페이지 컴포넌트
├── routes/          # 라우트 설정
├── index.css        # Tailwind + 테마 변수
└── main.tsx         # 전역 프로바이더 (BrowserRouter > QueryClientProvider > Redux)
```

## 스크립트

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm lint     # 린트
```

## 라우팅 구조

권한별 3단계 가드 컴포넌트로 구성.

| 가드              | 파일                         | 설명                                         |
| ----------------- | ---------------------------- | -------------------------------------------- |
| `PublicOnlyRoute` | `routes/PublicOnlyRoute.tsx` | 비로그인만 접근, 로그인 시 `/` 리다이렉트    |
| `PrivateRoute`    | `routes/PrivateRoute.tsx`    | 로그인 필요, 비로그인 시 `/login` 리다이렉트 |
| `AdminRoute`      | `routes/AdminRoute.tsx`      | 관리자만 접근, 아니면 `/` 리다이렉트         |

| 경로                                            | 접근       | 레이아웃  |
| ----------------------------------------------- | ---------- | --------- |
| `/`                                             | Public     | AppLayout |
| `/projects/:id`                                 | Public     | AppLayout |
| `/login`, `/register`, `/register/survey`       | PublicOnly | AppLayout |
| `/projects/create`, `/projects/:id/edit`, `/my` | Private    | AppLayout |
| `/admin/banner`, `/admin/projects`              | Admin      | 없음      |

> 각 Route의 `element`는 현재 `<div>` 플레이스홀더로 작성되어 있으며, 페이지 작업 시 컴포넌트로 교체.
> 가드 내 인증 변수(`isLoggedIn`, `isAdmin`)는 Redux 연결 전까지 파일 내 임시 변수로 관리.

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
