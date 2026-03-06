import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const AuthLayout: React.FC = () => {
  const location = useLocation()
  const isLoginPage = location.pathname.includes('login')

  return (
    <div className="bg-background-light dark:bg-background-dark flex h-screen w-full flex-row overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <div className="relative hidden h-full w-1/2 flex-col justify-between overflow-hidden bg-zinc-900 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <Link
          to="/"
          className="relative z-10 flex items-center gap-3 text-white no-underline"
        >
          <img src="/favicon.svg" alt="Logo" className="size-8" />
          <h2 className="text-2xl font-extrabold tracking-tight">SideMate</h2>
        </Link>

        <div className="relative z-10 max-w-lg">
          <h1 className="mb-6 text-[clamp(1.5rem,4.5vw,3.8rem)] leading-[1.15] font-black tracking-tight">
            <span className="block whitespace-nowrap">기획부터 평가까지,</span>
            <span className="block whitespace-nowrap">
              프로젝트의 모든 여정을
            </span>
            <span className="block whitespace-nowrap">
              <span className="bg-gradient-to-r from-violet-600 via-teal-400 to-blue-500 bg-clip-text text-transparent">
                SideMate
              </span>
              와 함께
            </span>
          </h1>
          <p className="text-[clamp(1rem,2vw,1.25rem)] leading-relaxed font-medium text-white/80">
            <span className="block whitespace-nowrap">
              AI가 설계하는 최적의 기획부터 검증된 팀 빌딩까지.
            </span>
            <span className="block whitespace-nowrap">
              시작과 끝을 잇는 데이터 기반 평가 시스템으로
            </span>
            <span className="block whitespace-nowrap">
              당신의 프로젝트를 압도적인 포트폴리오로 만드세요.
            </span>
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              <Avatar className="border-primary size-10 border-2">
                <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
                <AvatarFallback className="bg-slate-200 text-xs font-bold text-slate-600">
                  SM
                </AvatarFallback>
              </Avatar>
              <Avatar className="border-primary size-10 border-2">
                <AvatarImage src="https://i.pravatar.cc/150?u=2" alt="User 2" />
                <AvatarFallback className="bg-slate-300 text-xs font-bold text-slate-600">
                  JD
                </AvatarFallback>
              </Avatar>
              <Avatar className="border-primary size-10 border-2">
                <AvatarImage src="https://i.pravatar.cc/150?u=3" alt="User 3" />
                <AvatarFallback className="bg-slate-400 text-xs font-bold text-slate-600">
                  KH
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-sm">
              <p className="font-bold">500개 이상의 프로젝트</p>
              <p className="text-white/60">지금 바로 모집 중</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/50">
          © 2026 SideMate Inc. All rights reserved.
        </div>
      </div>

      <main className="relative flex h-full w-full flex-col overflow-y-auto bg-white lg:w-1/2 dark:bg-slate-900">
        <div
          className={`flex min-h-full w-full flex-col items-center p-8 md:p-12 ${isLoginPage ? 'justify-center' : 'justify-start'}`}
        >
          <div
            key={location.pathname}
            className="animate-in fade-in slide-in-from-bottom-4 flex w-full max-w-md flex-col py-12 duration-500 ease-out"
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
