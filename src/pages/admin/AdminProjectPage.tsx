import { useState } from 'react'
import { Briefcase, CalendarPlus, Flag } from 'lucide-react'
import AdminPageCommonLayout from './components/AdminPageCommonLayout'
import AdminStatCard from './components/AdminStatCard'
import AdminTableCard from './components/AdminTableCard'
import AdminSearchInput from './components/AdminSearchInput'
import AdminSortSelect from './components/AdminSortSelect'
import AdminProjectDetailModal from './components/modal/AdminProjectDetailModal'
import { Badge } from '@/components/ui/badge'
import { useAdminProject } from '@/hooks/admin/useAdminProject'
import type { TableColumn } from './components/AdminTable'
import type { ProjectResponse } from '@/types/project.type'

type SortOrder = '-createdAt' | 'createdAt'

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  RECRUITING: {
    label: '모집 중',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  CLOSED: {
    label: '모집 마감',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
  },
  COMPLETED: {
    label: '완료',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
}

const PROJECT_COLUMNS: TableColumn[] = [
  { key: 'title', label: '프로젝트 제목' },
  { key: 'author', label: '작성자' },
  { key: 'createdAt', label: '생성 일자' },
  { key: 'status', label: '상태' },
  { key: 'hidden', label: '숨김 여부' },
  { key: 'actions', label: '관리' },
]

const AdminProjectPage = () => {
  const [selectedProject, setSelectedProject] =
    useState<ProjectResponse | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [inputSearch, setInputSearch] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('-createdAt')

  const { data, isLoading, isError } = useAdminProject({
    page,
    limit: 5,
    search,
    sort,
  })
  const projects = data?.data ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1
  const todayCount = data?.todayCount ?? 0

  const handleSearchCommit = () => {
    setSearch(inputSearch)
    setPage(1)
  }
  const handleSortChange = (value: string) => {
    setSort(value as SortOrder)
    setPage(1)
  }
  const handleDetailClick = (project: ProjectResponse) => {
    setSelectedProject(project)
    setDetailOpen(true)
  }

  const rows = projects.map((project) => {
    const statusInfo = STATUS_MAP[project.status] ?? {
      label: project.status,
      className: '',
    }
    return {
      title: <span className="font-medium">{project.title}</span>,
      author: (
        <span className="text-muted-foreground font-mono text-xs">
          {project.author}
        </span>
      ),
      createdAt: (
        <span className="text-muted-foreground text-sm">
          {project.createdAt.split('T')[0]}
        </span>
      ),
      status: (
        <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
      ),
      actions: (
        <button
          onClick={() => handleDetailClick(project)}
          className="text-muted-foreground text-sm hover:underline"
        >
          상세보기
        </button>
      ),
      hidden: (
        <Badge
          className={
            project.hiddenYn
              ? 'bg-destructive text-white'
              : 'bg-green-100 text-green-700'
          }
        >
          {project.hiddenYn ? '숨김' : '노출'}
        </Badge>
      ),
    }
  })

  return (
    <AdminPageCommonLayout
      title="프로젝트 관리"
      description="등록된 프로젝트를 검색하고 노출 상태를 관리합니다."
    >
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <AdminStatCard
          icon={Briefcase}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          label="전체 프로젝트"
          value={totalCount.toLocaleString()}
          sub={
            <span className="text-muted-foreground text-xs">
              전체 등록 프로젝트 수
            </span>
          }
        />
        <AdminStatCard
          icon={CalendarPlus}
          iconColor="text-blue-500"
          iconBg="bg-blue-50"
          label="오늘 등록 프로젝트"
          value={todayCount.toString()}
          sub={
            <span className="text-muted-foreground text-xs">
              최근 24시간 기준
            </span>
          }
        />
        <AdminStatCard
          icon={Flag}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
          label="신고된 콘텐츠"
          value="0"
          sub={
            <span className="text-destructive flex items-center gap-1 text-xs font-medium">
              <Flag size={12} />
              빠른 조치가 필요합니다
            </span>
          }
        />
      </div>

      {/* 테이블 */}
      <AdminTableCard
        label="전체 프로젝트"
        totalCount={totalCount}
        search={search}
        toolbar={
          <>
            <AdminSearchInput
              value={inputSearch}
              onChange={setInputSearch}
              onCommit={handleSearchCommit}
              placeholder="프로젝트 제목 검색 후 Enter"
            />
            <AdminSortSelect value={sort} onChange={handleSortChange} />
          </>
        }
        isLoading={isLoading}
        isError={isError}
        columns={PROJECT_COLUMNS}
        rows={rows}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* 프로젝트 상세 모달 */}
      <AdminProjectDetailModal
        open={detailOpen}
        onOpenChange={(v) => {
          setDetailOpen(v)
          if (!v) setSelectedProject(null)
        }}
        project={selectedProject}
      />
    </AdminPageCommonLayout>
  )
}

export default AdminProjectPage
