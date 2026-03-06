import React from 'react'
import {
  User,
  Edit,
  Mail,
  Rocket,
  Plus,
  LineChart,
  Clock,
  XCircle,
  Camera,
  FolderCog,
  Search,
} from 'lucide-react'
import { useAppSelector } from '@/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const MyPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.user)

  const sectionTitleClasses =
    'text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2'
  const sectionWrapperClasses =
    'flex items-center justify-between border-b-2 border-slate-900 dark:border-slate-100 pb-4 mb-8'

  return (
    <div className="min-h-full bg-white dark:bg-slate-950">
      <main className="mx-auto max-w-4xl space-y-20 px-6 py-12">
        <section>
          <div className={sectionWrapperClasses}>
            <h2 className={sectionTitleClasses}>
              <User className="text-primary" size={28} strokeWidth={2.5} />내
              프로필
            </h2>

            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:text-primary flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300">
                  <Edit size={16} />
                  프로필 수정
                </button>
              </DialogTrigger>

              <DialogContent className="overflow-hidden border-none bg-white p-0 sm:max-w-[500px] dark:bg-slate-900">
                <div className="border-b border-slate-100 p-8 pb-6 dark:border-slate-800">
                  <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    프로필 수정
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    SideMate에서 사용될 내 프로필 정보를 관리합니다.
                  </DialogDescription>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-8 py-6">
                  <div className="mb-10 flex flex-col items-center gap-3">
                    <div className="group relative cursor-pointer">
                      <div
                        className="h-28 w-28 rounded-full border-4 border-slate-50 bg-cover bg-center shadow-md dark:border-slate-800"
                        style={{
                          backgroundImage: `url('https://github.com/shadcn.png')`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Camera className="text-white" size={32} />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-5 font-semibold dark:border-slate-700 dark:bg-slate-800"
                    >
                      이미지 변경
                    </Button>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        이름
                      </label>
                      <Input
                        className="focus:ring-primary focus:border-primary h-12 px-4 dark:border-slate-700 dark:bg-slate-800"
                        placeholder="이름을 입력해주세요"
                        defaultValue="개발하는 고양이"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        한 줄 소개 (Bio)
                      </label>
                      <Input
                        className="focus:ring-primary focus:border-primary h-12 px-4 dark:border-slate-700 dark:bg-slate-800"
                        placeholder="자신을 간단히 소개해주세요"
                        defaultValue="프론트엔드 개발에 관심이 많은 주니어 개발자입니다."
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        기술 스택
                      </label>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Tailwind CSS'].map((tech) => (
                          <span
                            key={tech}
                            className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium"
                          >
                            {tech}
                            <button className="hover:text-primary/70 cursor-pointer focus:outline-none">
                              <XCircle
                                size={14}
                                fill="currentColor"
                                className="group-hover:text-primary text-white"
                              />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="relative">
                        <Search
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <Input
                          className="focus:ring-primary focus:border-primary h-12 pr-4 pl-10 dark:border-slate-700 dark:bg-slate-800"
                          placeholder="기술 스택 검색 후 추가..."
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        GitHub 주소
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-sm font-medium text-slate-500 select-none dark:text-slate-400">
                          github.com/
                        </span>
                        <Input
                          className="focus:ring-primary focus:border-primary h-12 pr-4 pl-[100px] dark:border-slate-700 dark:bg-slate-800"
                          placeholder="username"
                          defaultValue="devcat"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 px-6 font-semibold dark:border-slate-700 dark:bg-slate-800"
                    >
                      취소
                    </Button>
                  </DialogTrigger>
                  <Button className="bg-primary hover:bg-primary/90 h-11 px-6 font-semibold shadow-sm">
                    변경사항 저장
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-start dark:border-slate-800 dark:bg-slate-900">
            <div className="shrink-0">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-lg dark:border-slate-800">
                <img
                  src="https://github.com/shadcn.png"
                  alt="프로필"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4 flex flex-col gap-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.name || '김개발'}
                </h3>
                <p className="flex items-center justify-center gap-2 text-sm text-slate-500 md:justify-start">
                  <Mail size={16} />
                  {user?.email || 'developer@example.com'}
                </p>
              </div>
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
                  기술 스택
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  {['React', 'TypeScript', 'Tailwind CSS'].map((tech) => (
                    <span
                      key={tech}
                      className="dark:bg-primary/10 text-primary dark:border-primary/20 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
            <button className="bg-primary flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-100 transition-all hover:bg-indigo-600">
              <Plus size={16} strokeWidth={3} />새 프로젝트
            </button>
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
      </main>
    </div>
  )
}

export default MyPage
