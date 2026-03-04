import { useState } from 'react'
import {
  Pencil,
  Trash2,
  Users,
  UserPlus,
  AlertTriangle,
  Download,
} from 'lucide-react'
import AdminPageCommonLayout from './components/AdminPageCommonLayout'
import AdminTable, { type TableColumn } from './components/AdminTable'
import AdminStatCard from './components/AdminStatCard'
import AdminUserDetailModal from './components/modal/AdminUserDetailModal'
import { Input } from '@/components/ui/input'
import { AdminTablePagination } from './components/AdminTablePagination'
import { formatDate } from '@/utils/formatter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface User {
  _id: string
  name: string
  email: string
  joinedAt: Date
  role: 'USER' | 'ADMIN'
  isActive: boolean
}

const DUMMY_USERS: User[] = [
  {
    _id: '507f1f77bcf86cd799439001',
    name: '김민준',
    email: 'minjun@example.com',
    joinedAt: new Date('2024-01-15'),
    role: 'USER',
    isActive: true,
  },
  {
    _id: '507f1f77bcf86cd799439002',
    name: '이서연',
    email: 'seoyeon@example.com',
    joinedAt: new Date('2024-02-20'),
    role: 'ADMIN',
    isActive: true,
  },
  {
    _id: '507f1f77bcf86cd799439003',
    name: '박지호',
    email: 'jiho@example.com',
    joinedAt: new Date('2024-03-10'),
    role: 'USER',
    isActive: false,
  },
  {
    _id: '507f1f77bcf86cd799439004',
    name: '최수아',
    email: 'sua@example.com',
    joinedAt: new Date('2024-04-05'),
    role: 'USER',
    isActive: true,
  },
  {
    _id: '507f1f77bcf86cd799439005',
    name: '정우진',
    email: 'woojin@example.com',
    joinedAt: new Date('2024-05-22'),
    role: 'USER',
    isActive: true,
  },
  {
    _id: '507f1f77bcf86cd799439006',
    name: '강예린',
    email: 'yerin@example.com',
    joinedAt: new Date('2024-06-18'),
    role: 'USER',
    isActive: false,
  },
  {
    _id: '507f1f77bcf86cd799439007',
    name: '윤도현',
    email: 'dohyun@example.com',
    joinedAt: new Date('2024-07-30'),
    role: 'USER',
    isActive: true,
  },
  {
    _id: '507f1f77bcf86cd799439008',
    name: '임하늘',
    email: 'haneul@example.com',
    joinedAt: new Date('2024-08-14'),
    role: 'ADMIN',
    isActive: true,
  },
]

const USER_COLUMNS: TableColumn[] = [
  { key: 'name', label: '이름' },
  { key: 'email', label: '이메일' },
  { key: 'joinedAt', label: '가입일' },
  { key: 'role', label: '역할' },
  { key: 'isActive', label: '상태' },
  { key: 'actions', label: '관리' },
]

const AdminUserPage = () => {
  const [users] = useState(DUMMY_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.includes(search) || user.email.includes(search)
    const matchRole = roleFilter === 'ALL' ? true : user.role === roleFilter
    return matchSearch && matchRole
  })

  const activeCount = users.filter((u) => u.isActive).length
  const inactiveCount = users.length - activeCount

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setDetailOpen(true)
  }

  const rows = filteredUsers.map((user) => ({
    name: <span className="font-medium">{user.name}</span>,
    email: <span className="text-muted-foreground text-sm">{user.email}</span>,
    joinedAt: (
      <span className="text-muted-foreground text-sm">
        {formatDate(user.joinedAt)}
      </span>
    ),
    role: (
      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
        {user.role === 'ADMIN' ? '관리자' : '일반'}
      </Badge>
    ),
    isActive: user.isActive ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        활성
      </Badge>
    ) : (
      <Badge variant="destructive">정지</Badge>
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
          value="1,247"
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
          value="83"
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
        {/* 현황 + 검색/필터 */}
        <div className="flex items-center border-b-2 p-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">전체 사용자 ({users.length})</span>
            <div className="bg-border h-4 w-px"></div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-muted-foreground">활성 {activeCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="bg-muted-foreground h-2 w-2 rounded-full"></span>
              <span className="text-muted-foreground">
                비활성 {inactiveCount}
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Input
              placeholder="이름 또는 이메일 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-input/40 w-52 border-none outline-none"
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-input/40 w-28 border-none">
                <SelectValue placeholder="역할" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="USER">일반</SelectItem>
                <SelectItem value="ADMIN">관리자</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={14} />
              엑셀 다운로드
            </Button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="rounded-2xl">
          <AdminTable columns={USER_COLUMNS} rows={rows} />
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-end gap-4 rounded-b-3xl bg-[#f8fafc] px-4 py-3">
          <AdminTablePagination />
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
