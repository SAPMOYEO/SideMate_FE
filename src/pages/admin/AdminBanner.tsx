import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import AdminPageCommonLayout from './components/AdminPageCommonLayout'
import AdminTable, { type TableColumn } from './components/AdminTable'
import { AdminTablePagination } from '@/components/shared/AdminTablePagination'
import { formatDate } from '@/utils/formatter'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import AdminBannerFormModal from './components/modal/AdminBannerFormModal'
import {
  useBanners,
  useUpdateBanner,
  useDeleteBanner,
} from '@/hooks/admin/useBanners'
import type { Banner } from '@/utils/api/admin'

const LIMIT = 5

const BANNER_COLUMNS: TableColumn[] = [
  { key: 'preview', label: '미리보기' },
  { key: 'isActive', label: '활성' },
  { key: 'createdAt', label: '등록일' },
  { key: 'updatedAt', label: '수정일' },
  { key: 'actions', label: '관리' },
]

const AdminBanner = () => {
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)

  // ── React Query ───────────────────────────────────────────────
  const { data, isLoading, isError } = useBanners({ page, limit: LIMIT })
  const { mutate: updateBanner } = useUpdateBanner()
  const { mutate: deleteBanner } = useDeleteBanner()

  // ── 파생 데이터 ───────────────────────────────────────────────
  const banners = data?.data ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1
  const activeCount = data?.activeCount ?? 0
  const inactiveCount = totalCount - activeCount
  const MAX_ACTIVE = 3

  // ── 핸들러 ───────────────────────────────────────────────────
  const handleToggle = (id: string, isActive: boolean) => {
    updateBanner({ id, payload: { isActive } })
  }

  const handleEditClick = (banner: Banner) => {
    setSelectedBanner(banner)
    setFormOpen(true)
  }

  const handleCreateClick = () => {
    setSelectedBanner(null)
    setFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    if (confirm('배너를 삭제하시겠습니까?')) {
      deleteBanner(id)
    }
  }

  // ── 테이블 rows ───────────────────────────────────────────────
  const rows = banners.map((banner) => ({
    preview: (
      <img
        src={banner.imageUrl}
        alt={`배너 ${banner._id} 이미지`}
        className="h-12 w-auto rounded-md object-cover"
      />
    ),
    isActive: (
      <Switch
        checked={banner.isActive}
        disabled={!banner.isActive && activeCount >= MAX_ACTIVE}
        onCheckedChange={(checked) => handleToggle(banner._id, checked)}
        title={
          !banner.isActive && activeCount >= MAX_ACTIVE
            ? '활성 배너는 최대 3개까지 가능합니다'
            : undefined
        }
      />
    ),
    createdAt: (
      <span className="text-muted-foreground text-sm">
        {formatDate(new Date(banner.createdAt))}
      </span>
    ),
    updatedAt: (
      <span className="text-muted-foreground text-sm">
        {formatDate(new Date(banner.updatedAt))}
      </span>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleEditClick(banner)}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => handleDeleteClick(banner._id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  }))

  // ── 로딩 / 에러 ───────────────────────────────────────────────
  if (isLoading)
    return <div className="p-10 text-center text-sm">불러오는 중...</div>
  if (isError)
    return (
      <div className="p-10 text-center text-sm text-red-500">
        데이터를 불러오지 못했습니다.
      </div>
    )

  console.log(totalPages)
  return (
    <AdminPageCommonLayout
      title="배너 관리"
      description="메인 페이지의 홍보 배너를 관리합니다."
    >
      <div className="border-border rounded-3xl border bg-white">
        {/* 현황 */}
        <div className="flex items-center gap-3 border-b-2 p-4 text-sm">
          <span className="font-medium">전체 배너 ({totalCount})</span>
          <div className="bg-border h-4 w-px" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span
              className={`text-sm font-medium ${activeCount >= MAX_ACTIVE ? 'text-orange-500' : 'text-muted-foreground'}`}
            >
              활성 {activeCount} / {MAX_ACTIVE}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-muted-foreground h-2 w-2 rounded-full" />
            <span className="text-muted-foreground">
              대기/만료 {inactiveCount}
            </span>
          </div>
        </div>

        <div className="rounded-2xl">
          <AdminTable columns={BANNER_COLUMNS} rows={rows} />
        </div>

        <div className="flex items-center justify-end gap-4 rounded-b-3xl bg-[#f8fafc] px-4 py-3">
          <AdminTablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* 배너 등록 버튼 */}
      <div className="mt-8 flex justify-end">
        <Button size="lg" onClick={handleCreateClick}>
          배너 등록
        </Button>
      </div>

      {/* 배너 등록/수정 모달 */}
      <AdminBannerFormModal
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v)
          if (!v) setSelectedBanner(null)
        }}
        banner={selectedBanner}
      />
    </AdminPageCommonLayout>
  )
}

export default AdminBanner
