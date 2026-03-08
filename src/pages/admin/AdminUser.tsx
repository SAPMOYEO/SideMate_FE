import { useState } from 'react'
import { Pencil, Trash2, Users, UserPlus, AlertTriangle } from 'lucide-react'
import AdminPageCommonLayout from './components/AdminPageCommonLayout'
import AdminStatCard from './components/AdminStatCard'
import AdminTableCard from './components/AdminTableCard'
import AdminSearchInput from './components/AdminSearchInput'
import AdminSortSelect from './components/AdminSortSelect'
import AdminUserDetailModal from './components/modal/AdminUserDetailModal'
import { Badge } from '@/components/ui/badge'
import { useUserList } from '@/hooks/admin/useAdminUser'
import type { TableColumn } from './components/AdminTable'
import type { UserResponse } from '@/types/user.type'

type SortOrder = '-createdAt' | 'createdAt'

const USER_COLUMNS: TableColumn[] = [
  { key: 'name', label: '이름' },
  { key: 'email', label: '이메일' },
  { key: 'createdAt', label: '가입일' },
  { key: 'isActive', label: '상태' },
  { key: 'role', label: '역할' },
  { key: 'tier', label: '등급' },
  { key: 'actions', label: '관리' },
]

const AdminUserPage = () => {
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [inputSearch, setInputSearch] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('-createdAt')

  const { data, isLoading, isError } = useUserList({
    page,
    limit: 10,
    search,
    sort,
  })

  const users = data?.data ?? []
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
  const handleEditClick = (user: UserResponse) => {
    setSelectedUser(user)
    setDetailOpen(true)
  }

  const rows = users.map((user) => ({
    name: <span className="font-medium">{user.name}</span>,
    email: <span className="text-muted-foreground text-sm">{user.email}</span>,
    createdAt: (
      <span className="text-muted-foreground text-sm">
        {user.createdAt.split('T')[0]}
      </span>
    ),
    isActive: (
      <Badge variant={user.isActive ? 'default' : 'destructive'}>
        {user.isActive ? '활성' : '정지'}
      </Badge>
    ),
    role: (
      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
        {user.role === 'admin' ? '관리자' : '일반'}
      </Badge>
    ),
    tier: (
      <Badge variant={user.tier === 'PRO' ? 'default' : 'outline'}>
        {user.tier}
      </Badge>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleEditClick(user)}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    ),
  }))

  return (
    <AdminPageCommonLayout
      title="사용자 관리"
      description="서비스 가입 사용자를 관리합니다."
    >
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <AdminStatCard
          icon={Users}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          label="전체 사용자"
          value={totalCount.toLocaleString()}
          sub={
            <span className="text-muted-foreground text-xs">
              전체 가입 회원 수
            </span>
          }
        />
        <AdminStatCard
          icon={UserPlus}
          iconColor="text-green-500"
          iconBg="bg-green-50"
          label="오늘 신규 가입"
          value={todayCount.toString()}
          sub={
            <span className="text-muted-foreground text-xs">
              최근 24시간 기준
            </span>
          }
        />
        <AdminStatCard
          icon={AlertTriangle}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
          label="신고된 사용자"
          value="0"
          sub={
            <span className="text-muted-foreground text-xs">
              처리 필요 신고 건
            </span>
          }
        />
      </div>

      {/* 테이블 */}
      <AdminTableCard
        label="전체 사용자"
        totalCount={totalCount}
        search={search}
        toolbar={
          <>
            <AdminSearchInput
              value={inputSearch}
              onChange={setInputSearch}
              onCommit={handleSearchCommit}
              placeholder="이름 또는 이메일 검색 후 Enter"
            />
            <AdminSortSelect value={sort} onChange={handleSortChange} />
          </>
        }
        isLoading={isLoading}
        isError={isError}
        columns={USER_COLUMNS}
        rows={rows}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* 사용자 상세/수정 모달 */}
      <AdminUserDetailModal
        open={detailOpen}
        onOpenChange={(v) => {
          setDetailOpen(v)
          if (!v) setSelectedUser(null)
        }}
        user={selectedUser ?? undefined}
      />
    </AdminPageCommonLayout>
  )
}

export default AdminUserPage
