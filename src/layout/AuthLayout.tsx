import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const AuthLayout: React.FC = () => {
  const location = useLocation()
  // const isLoginPage = location.pathname.includes('login')

  return (
    <div className="bg-background-light dark:bg-background-dark flex min-h-screen w-full flex-row font-sans text-slate-900 dark:text-slate-100">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-800 p-12 text-white lg:flex">
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
          <h1 className="mb-6 text-5xl leading-tight font-black">
            기획부터 평가까지, <br />
            프로젝트의 모든 여정을 <br />
            <span className="bg-gradient-to-r from-violet-600 via-teal-400 to-blue-500 bg-clip-text text-transparent">
              SideMate
            </span>
            함께
          </h1>
          <p className="text-lg leading-relaxed font-medium text-white/80">
            AI가 설계하는 최적의 기획부터 검증된 팀 빌딩까지. <br />
            시작과 끝을 잇는 데이터 기반 평가 시스템으로 <br />
            당신의 프로젝트를 압도적인 포트폴리오로 만드세요.
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

      <div className="flex w-full flex-col bg-white lg:w-1/2 dark:bg-slate-900">
        <main className="flex flex-grow items-center justify-center overflow-y-auto p-8">
          <div
            key={location.pathname}
            className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md duration-500 ease-out"
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AuthLayout
