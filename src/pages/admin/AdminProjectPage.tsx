import { useState } from 'react'
import {
  Briefcase,
  CalendarPlus,
  Flag,
  TrendingUp,
  Download,
  SlidersHorizontal,
} from 'lucide-react'
import AdminPageCommonLayout from './components/AdminPageCommonLayout'
import AdminTable, { type TableColumn } from './components/AdminTable'
import { AdminTablePagination } from './components/AdminTablePagination'
import AdminStatCard from './components/AdminStatCard'
import AdminProjectDetailModal from './components/AdminProjectDetailModal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Project {
  _id: string
  title: string
  author: string
  createdAt: Date
  isVisible: boolean
}

const DUMMY_PROJECTS: Project[] = [
  {
    _id: '1',
    title: 'AI 기반 인재 매칭 시스템 구축',
    author: '김철수',
    createdAt: new Date('2023-11-20'),
    isVisible: true,
  },
  {
    _id: '2',
    title: '블록체인 기반 경력 증명 앱 개발',
    author: '이영희',
    createdAt: new Date('2023-11-19'),
    isVisible: false,
  },
  {
    _id: '3',
    title: '이커머스 플랫폼 UI 리뉴얼 프로젝트',
    author: '박지민',
    createdAt: new Date('2023-11-18'),
    isVisible: true,
  },
  {
    _id: '4',
    title: '실시간 협업 툴 개발 프로젝트',
    author: '최지우',
    createdAt: new Date('2023-11-17'),
    isVisible: true,
  },
  {
    _id: '5',
    title: '헬스케어 데이터 시각화 대시보드',
    author: '정민서',
    createdAt: new Date('2023-11-16'),
    isVisible: false,
  },
]

const formatDate = (date: Date) =>
  date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

const PROJECT_COLUMNS: TableColumn[] = [
  { key: 'title', label: '프로젝트 제목' },
  { key: 'author', label: '작성자' },
  { key: 'createdAt', label: '생성 일자' },
  { key: 'status', label: '노출 상태' },
  { key: 'actions', label: '관리' },
]

const AdminProjectPage = () => {
  const [projects, setProjects] = useState(DUMMY_PROJECTS)
  const [search, setSearch] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  // const [currentPage, setCurrentPage] = useState(1)

  const filteredProjects = projects.filter(
    (p) => p.title.includes(search) || p.author.includes(search)
  )

  const visibleCount = projects.filter((p) => p.isVisible).length
  const hiddenCount = projects.length - visibleCount

  const toggleVisibility = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isVisible: !p.isVisible } : p))
    )
  }

  const rows = filteredProjects.map((project) => ({
    title: <span className="font-medium">{project.title}</span>,
    author: (
      <span className="text-muted-foreground text-sm">{project.author}</span>
    ),
    createdAt: (
      <span className="text-muted-foreground text-sm">
        {formatDate(project.createdAt)}
      </span>
    ),
    status: project.isVisible ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        공개 중
      </Badge>
    ) : (
      <Badge variant="secondary">숨김 처리</Badge>
    ),
    actions: (
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDetailOpen(true)}
          className="text-muted-foreground text-sm hover:underline"
        >
          상세보기
        </button>
        <button
          onClick={() => toggleVisibility(project._id)}
          className="text-primary text-sm font-medium hover:underline"
        >
          {project.isVisible ? '숨기기' : '숨김 해제'}
        </button>
      </div>
    ),
  }))

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
          value="1,284"
          sub={
            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp size={12} />
              지난달 대비 12% 상승
            </span>
          }
        />
        <AdminStatCard
          icon={CalendarPlus}
          iconColor="text-blue-500"
          iconBg="bg-blue-50"
          label="오늘 등록 프로젝트"
          value="24"
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
          value="12"
          sub={
            <span className="text-destructive flex items-center gap-1 text-xs font-medium">
              <Flag size={12} />
              빠른 조치가 필요합니다
            </span>
          }
        />
      </div>

      {/* 프로젝트 테이블 */}
      <div className="border-border rounded-3xl border bg-white">
        {/* 현황 + 검색/버튼 */}
        <div className="flex items-center border-b-2 p-4">
          {/* 현황 */}
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">
              전체 프로젝트 ({filteredProjects.length.toLocaleString()})
            </span>
            <div className="bg-border h-4 w-px" />
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">공개 {visibleCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-muted-foreground h-2 w-2 rounded-full" />
              <span className="text-muted-foreground">숨김 {hiddenCount}</span>
            </div>
          </div>

          {/* 검색 + 필터 + 다운로드 */}
          <div className="ml-auto flex items-center gap-2">
            <Input
              placeholder="프로젝트 제목 또는 작성자 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-input/40 w-72 rounded-full border-none outline-none"
            />
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal size={14} />
              필터
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={14} />
              엑셀 다운로드
            </Button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="rounded-2xl">
          <AdminTable columns={PROJECT_COLUMNS} rows={rows} />
        </div>

        {/* 푸터: 정보 + 페이지네이션 */}
        <div className="flex items-center rounded-b-3xl bg-[#f8fafc] px-4 py-3">
          <div className="flex flex-1 justify-center">
            <AdminTablePagination />
          </div>
        </div>
      </div>
      <AdminProjectDetailModal open={detailOpen} onOpenChange={setDetailOpen} />
    </AdminPageCommonLayout>
  )
}

export default AdminProjectPage
