import { useState } from 'react'
import { Pencil, Trash2, Users, UserPlus, AlertTriangle } from 'lucide-react'
import AdminPageCommonLayout from './components/AdminPageCommonLayout'
import AdminTable, { type TableColumn } from './components/AdminTable'
import AdminStatCard from './components/AdminStatCard'
import AdminUserDetailModal from './components/modal/AdminUserDetailModal'
import { AdminTablePagination } from './components/AdminTablePagination'
import { Badge } from '@/components/ui/badge'
import { useUserList } from '@/hooks/admin/useAdminUser'
import type { UserResponse } from '@/types/user'

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

  const { data, isLoading, isError } = useUserList({ page: 1, limit: 10 })

  const users = data?.data ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1
  const todayCount = data?.todayCount ?? 0

  const handleEditClick = (user: UserResponse) => {
    setSelectedUser(user)
    setDetailOpen(true)
  }

  const rows = users.map((user) => ({
    name: <span className="font-medium">{user.name}</span>,
    isActive: (
      <Badge variant={user.isActive ? 'default' : 'destructive'}>
        {user.isActive ? '활성' : '정지'}
      </Badge>
    ),
    email: <span className="text-muted-foreground text-sm">{user.email}</span>,
    createdAt: (
      <span className="text-muted-foreground text-sm">
        {/* {formatDate(user.createdAt)} */}
        {user.createdAt.split('T')[0]} {/* 간단히 날짜만 표시 */}
      </span>
    ),
    role: (
      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
        {user.role === 'admin' ? '관리자' : '일반'}
      </Badge>
    ),
    tier: (
      <Badge variant={user.tier === 'PRO' ? 'default' : 'outline'}>
        {user.tier === 'PRO' ? 'PRO' : 'FREE'}
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
          value={totalCount.toString()}
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
          label="신규 가입"
          value={todayCount.toString()}
          sub={
            <span className="text-muted-foreground text-xs">
              이번 달 신규 가입
            </span>
          }
        />
        <AdminStatCard
          icon={AlertTriangle}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
          label="신고된 사용자"
          value="12"
          sub={
            <span className="text-muted-foreground text-xs">
              처리 필요 신고 건
            </span>
          }
        />
      </div>

      {/* 유저 테이블 */}
      <div className="border-border rounded-3xl border bg-white">
        {/* 현황 */}
        <div className="flex items-center border-b-2 p-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">전체 사용자 ({totalCount})</span>
          </div>
        </div>

        {/* 테이블 */}
        <div className="rounded-2xl">
          {isLoading ? (
            <div className="p-10 text-center text-sm">불러오는 중...</div>
          ) : isError ? (
            <div className="p-10 text-center text-sm text-red-500">
              데이터를 불러오지 못했습니다.
            </div>
          ) : (
            <AdminTable columns={USER_COLUMNS} rows={rows || []} />
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-end gap-4 rounded-b-3xl bg-[#f8fafc] px-4 py-3">
          <AdminTablePagination
            page={1}
            totalPages={totalPages}
            onPageChange={(page) => console.log('페이지 변경:', page)}
          />
        </div>
      </div>

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
