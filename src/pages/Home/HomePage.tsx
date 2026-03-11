import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BannerCarousel } from './components/banner/carousel/BannerCarousel'
import BannerSearchBar from './components/banner/carousel/BannerSearchBar'
import RecommendProjectList from './components/RecommendProjectList'
import { Button } from '@/components/ui/button'
import api from '@/utils/api/api.instance'
import { type Project } from '@/types/project'
import { PREVIEW_LIMIT } from '@/constants/home'
import { CATEGORY_COLOR_MAP } from '@/constants/category'

const CATEGORY_OPTIONS = ['전체', ...Object.keys(CATEGORY_COLOR_MAP)]

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체')

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['home-projects', selectedCategory],
    queryFn: async (): Promise<Project[]> => {
      const params = new URLSearchParams({
        limit: String(PREVIEW_LIMIT),
        sort: 'latest',
      })
      if (selectedCategory !== '전체') params.set('category', selectedCategory)
      const response = await api.get(`/project?${params.toString()}`)
      return response.data.data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden">
        <BannerSearchBar />
        <BannerCarousel />
      </div>

      <div className="m-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">
        <div className="mb-10 flex flex-1 flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              최신 프로젝트
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              당신을 위해 엄선된 기회들입니다.
            </p>
          </div>
          <div className="min-w-0">
            <div className="flex w-[90vw] items-center gap-2 overflow-x-scroll md:w-full [&::-webkit-scrollbar]:hidden">
              {CATEGORY_OPTIONS.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-primary shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm'
                      : 'shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }
                >
                  {category}
                </Button>
              ))}
              <Link
                to="/projects"
                className="hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 shrink-0 rounded-full border px-3 py-2 text-sm font-medium whitespace-nowrap shadow-xs"
              >
                더보기
              </Link>
            </div>
          </div>
        </div>
        <RecommendProjectList projects={projects} isLoading={isLoading} />
      </div>
      {/* 하단 */}
      <section className="bg-primary/5 dark:bg-primary/10 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900 md:text-3xl dark:text-white">
            프로젝트를 구상 중이신가요?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm whitespace-pre-wrap text-slate-600 md:text-lg dark:text-slate-400">
            나의 아이디어를 실현할 최고의 팀원을 찾아보세요.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={'/projects/create'}
              className="bg-primary shadow-primary/30 w-full rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
            >
              프로젝트 시작하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
export default HomePage
