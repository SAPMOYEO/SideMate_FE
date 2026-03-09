// import { BannerCarousel } from './components/banner/carousel/BannerCarousel'
// import BannerSearchBar from './components/banner/carousel/BannerSearchBar'
import RecommendProjectList from './components/RecommendProjectList'
import { Button } from '@/components/ui/button'
import BannerGrid from './components/banner/grid/BannerGrid'
const HomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="relative">
        <BannerSearchBar />
        <BannerCarousel />
      </div> */}
      <div className="relative px-12 py-8">
        <BannerGrid />
      </div>
      <div className="flex-1 p-12">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              추천 프로젝트
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              당신을 위해 엄선된 기회들입니다.
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button className="bg-primary rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm">
              전체
            </Button>
            <Button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
              디자인
            </Button>
            <Button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
              개발
            </Button>
            <Button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
              마케팅
            </Button>
            <Button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
              AI/ML
            </Button>
          </div>
        </div>
        <RecommendProjectList />
      </div>
      {/* 하단 */}
      <section className="bg-primary/5 dark:bg-primary/10 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
            프로젝트를 구상 중이신가요?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-slate-600 dark:text-slate-400">
            수천 명의 빌더들과 함께 아이디어를 실현할 최고의 팀원을 찾아보세요.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="bg-primary shadow-primary/30 w-full rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] sm:w-auto">
              프로젝트 시작하기
            </button>
            <button className="w-full rounded-xl border border-slate-200 bg-white px-8 py-3 font-bold text-slate-900 transition-colors hover:bg-slate-50 sm:w-auto dark:border-slate-800 dark:bg-slate-900 dark:text-white">
              모든 멘토 보기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
export default HomePage
