import { useEffect, useMemo, useState } from 'react'
import { useProjects } from '@/hooks/project/useProject'
import {
  initialProjectFilter,
  type ProjectFilterState,
  type ProjectSearchParams,
} from '@/types/project'
import { AdminTablePagination } from '@/components/shared/AdminTablePagination'
import FilterSidebar from './components/FilterSidebar'
import ProjectCard from './components/ProjectCard'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const LIMIT = Number(import.meta.env.VITE_PROJECT_LIMIT) || 10

const ProjectPage = () => {
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [urlParams, setUrlParams] = useSearchParams()
  const q = urlParams.get('q') ?? ''
  const [filter, setFilter] = useState<ProjectFilterState>({
    ...initialProjectFilter,
    title: q,
  })
  const searchParams = useMemo<ProjectSearchParams>(
    () => ({
      page,
      limit: LIMIT,
      sort,
      ...(filter.title.trim() ? { title: filter.title.trim() } : {}),
      ...(filter.category.length ? { category: filter.category } : {}),
      ...(filter.requiredTechStack.length
        ? { requiredTechStack: filter.requiredTechStack }
        : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.startDate ? { startDate: filter.startDate } : {}),
      ...(filter.endDate ? { endDate: filter.endDate } : {}),
      ...(filter.deadlineStartDate
        ? { deadlineStartDate: filter.deadlineStartDate }
        : {}),
      ...(filter.deadlineEndDate
        ? { deadlineEndDate: filter.deadlineEndDate }
        : {}),
    }),
    [filter, page, sort]
  )

  const { data, isLoading, isError } = useProjects(searchParams)
  const projects = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!open) return
    if (window.matchMedia('(min-width: 768px)').matches) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  const toggleInArray = (
    key: 'category' | 'requiredTechStack',
    value: string
  ) => {
    setPage(1)
    setFilter((prev) => {
      const exists = prev[key].includes(value)
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value],
      }
    })
  }

  const handleDateChange = (
    field: 'startDate' | 'endDate' | 'deadlineStartDate' | 'deadlineEndDate',
    value: string
  ) => {
    setPage(1)
    setFilter((prev) => ({ ...prev, [field]: value }))
  }

  const handleTitleChange = (value: string) => {
    setPage(1)
    setFilter((prev) => ({ ...prev, title: value }))
  }

  const resetFilter = () => {
    setPage(1)
    setFilter(initialProjectFilter)
    setUrlParams({}, { replace: true })
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-4.5rem)] w-full bg-gray-50">
      <div className="hidden md:block">
        <FilterSidebar
          filter={filter}
          onReset={resetFilter}
          onTitleChange={handleTitleChange}
          onToggleCategory={(value) => toggleInArray('category', value)}
          onToggleTechStack={(value) =>
            toggleInArray('requiredTechStack', value)
          }
          onStatusChange={(value) => {
            setPage(1)
            setFilter((prev) => ({ ...prev, status: value }))
          }}
          onDateChange={handleDateChange}
        />
      </div>

      <button
        aria-label={open ? '필터 닫기' : '필터 열기'}
        onClick={() => setOpen(!open)}
        className="fixed top-24 z-50 flex h-8 w-6 items-center justify-center rounded-r-lg border bg-indigo-100 shadow transition hover:bg-gray-100 md:hidden"
        style={{
          left: open ? '280px' : '0px',
        }}
      >
        {open ? '◀' : '▶'}
      </button>

      <div
        className={`fixed inset-x-0 top-[4.5rem] bottom-0 z-30 bg-black/35 transition-opacity duration-300 md:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} `}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed top-[4.5rem] left-0 z-40 h-[calc(100dvh-4.5rem)] transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'} `}
      >
        <FilterSidebar
          filter={filter}
          onReset={resetFilter}
          onTitleChange={handleTitleChange}
          onToggleCategory={(value) => toggleInArray('category', value)}
          onToggleTechStack={(value) =>
            toggleInArray('requiredTechStack', value)
          }
          onStatusChange={(value) => {
            setPage(1)
            setFilter((prev) => ({ ...prev, status: value }))
          }}
          onDateChange={handleDateChange}
        />
      </div>

      <main className="min-w-0 flex-1 p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/projects/create"
              className="bg-primary flex w-[130px] cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-100 transition-all hover:bg-indigo-600"
            >
              <Plus size={16} strokeWidth={3} />새 프로젝트
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              프로젝트 탐색
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {data?.totalCount ?? 0}개의 프로젝트가 조회되었습니다
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">정렬 기준:</span>

            <select
              value={sort}
              onChange={(e) => {
                setPage(1)
                setSort(e.target.value as 'latest' | 'oldest')
              }}
              className="rounded-lg border bg-white px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading && (
            <div className="rounded-lg border bg-white px-4 py-8 text-center text-sm text-gray-500">
              프로젝트를 불러오는 중입니다...
            </div>
          )}

          {isError && (
            <div className="rounded-lg border bg-white px-4 py-8 text-center text-sm text-red-500">
              프로젝트 조회 중 오류가 발생했습니다.
            </div>
          )}

          {!isLoading && !isError && projects.length === 0 && (
            <div className="rounded-lg border bg-white px-4 py-8 text-center text-sm text-gray-500">
              검색 조건에 맞는 프로젝트가 없습니다.
            </div>
          )}

          {!isLoading &&
            !isError &&
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
        </div>

        {!isLoading && !isError && totalPages > 1 && (
          <div className="mt-8">
            <AdminTablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default ProjectPage
