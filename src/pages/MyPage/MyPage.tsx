import React from 'react'
import { User, Rocket, Plus, LineChart, Clock, FolderCog } from 'lucide-react'
import ProfileSection from './components/ProfileSection'
import ProfileEditModal from './components/ProfileEditModal'
import { Link } from 'react-router-dom'

const MyPage: React.FC = () => {
  const sectionTitleClasses =
    'text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2'
  const sectionWrapperClasses =
    'flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-100 pb-4 mb-6'

  return (
    <div className="min-h-full bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-20 px-6 py-12">
        <section>
          <div className={sectionWrapperClasses}>
            <h2 className={sectionTitleClasses}>
              <User className="text-primary" size={28} strokeWidth={2.5} />내
              프로필
            </h2>
            <ProfileEditModal />
          </div>
          <ProfileSection />
        </section>

        <section>
          <div className={sectionWrapperClasses}>
            <h2 className={sectionTitleClasses}>
              <Rocket className="text-primary" size={28} strokeWidth={2.5} />
              지원한 프로젝트
            </h2>
            <span className="cursor-pointer rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">
              총 3건
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-900">
              <div className="flex-1">
                <h3 className="cursor-pointer text-lg font-bold text-slate-900 dark:text-white">
                  시니어 프론트엔드 아키텍트
                </h3>
                <p className="text-sm text-slate-500">
                  프로젝트: 핀테크 모바일 앱 리디자인
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} /> 2일 전 지원
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600" />
                  대기 중
                </span>
                <button className="cursor-pointer text-xs font-medium text-slate-400 underline underline-offset-4 transition-colors hover:text-red-500">
                  지원 취소
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className={sectionWrapperClasses}>
            <h2 className={sectionTitleClasses}>
              <FolderCog className="text-primary" size={28} strokeWidth={2.5} />
              생성 프로젝트 & AI 분석
            </h2>
            <Link
              to="/projects/create"
              className="bg-primary flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-100 transition-all hover:bg-indigo-600"
            >
              <Plus size={16} strokeWidth={3} />새 프로젝트
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800">
              <h3 className="cursor-pointer text-xl font-bold text-slate-900 dark:text-white">
                현대적인 이커머스 플랫폼
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Next.js와 Stripe 결제 연동 풀스택 재구축
              </p>
            </div>
            <div className="dark:bg-primary/5 flex flex-col items-center justify-between gap-4 bg-indigo-50/50 p-6 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="dark:bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                  <LineChart size={20} />
                </div>
                <div>
                  <p className="text-primary text-xs font-bold tracking-wide uppercase">
                    AI 피드백 요약
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    기술 스택 적합도 분석 완료
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    9.2
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 10</span>
                </div>
                <button className="text-primary cursor-pointer rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-bold transition-colors hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800">
                  상세 분석 보기
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MyPage
