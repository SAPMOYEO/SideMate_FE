import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import AdminPageCommonLayout from './components/AdminPageCommonLayout'
import AdminTable, { type TableColumn } from './components/AdminTable'
import { AdminTablePagination } from './components/AdminTablePagination'
import { formatDate } from '@/utils/formatter'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import AdminBannerFormModal from './components/modal/AdminBannerFormModal'

interface Banner {
  _id: string
  imageUrl: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const DUMMY_BANNERS: Banner[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    imageUrl: 'https://placehold.co/160x60/6366f1/ffffff?text=Banner+1',
    isActive: true,
    order: 1,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-08-31'),
  },
  {
    _id: '507f1f77bcf86cd799439012',
    imageUrl: 'https://placehold.co/160x60/6366f1/ffffff?text=Banner+2',
    isActive: true,
    order: 2,
    createdAt: new Date('2025-02-14'),
    updatedAt: new Date('2025-09-14'),
  },
  {
    _id: '507f1f77bcf86cd799439013',
    imageUrl: 'https://placehold.co/160x60/94a3b8/ffffff?text=Banner+3',
    isActive: false,
    order: 3,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-31'),
  },
  {
    _id: '507f1f77bcf86cd799439014',
    imageUrl: 'https://placehold.co/160x60/6366f1/ffffff?text=Banner+4',
    isActive: true,
    order: 4,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-06-30'),
  },
  {
    _id: '507f1f77bcf86cd799439015',
    imageUrl: 'https://placehold.co/160x60/94a3b8/ffffff?text=Banner+5',
    isActive: false,
    order: 5,
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-11-15'),
  },
]

const BANNER_COLUMNS: TableColumn[] = [
  { key: 'preview', label: '미리보기' },
  { key: 'order', label: '순서' },
  { key: 'isActive', label: '활성' },
  { key: 'createdAt', label: '등록일' },
  { key: 'updatedAt', label: '수정일' },
  { key: 'actions', label: '관리' },
]

const AdminBanner = () => {
  const [banners, setBanners] = useState(DUMMY_BANNERS)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)

  const handleToggle = (_id: string, checked: boolean) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner._id === _id ? { ...banner, isActive: checked } : banner
      )
    )
  }

  const handleEditClick = (banner: Banner) => {
    setSelectedBanner(banner)
    setFormOpen(true)
  }

  const handleCreateClick = () => {
    setSelectedBanner(null)
    setFormOpen(true)
  }

  const activeCount = banners.filter((b) => b.isActive).length
  const inactiveCount = banners.length - activeCount

  const rows = banners.map((banner) => ({
    preview: (
      <img
        src={banner.imageUrl}
        alt={`배너 ${banner.order}`}
        className="h-12 w-auto rounded-md object-cover"
      />
    ),
    order: (
      <span className="text-muted-foreground text-sm">{banner.order}</span>
    ),
    isActive: (
      <Switch
        checked={banner.isActive}
        onCheckedChange={(checked) => handleToggle(banner._id, checked)}
      />
    ),
    createdAt: (
      <span className="text-muted-foreground text-sm">
        {formatDate(banner.createdAt)}
      </span>
    ),
    updatedAt: (
      <span className="text-muted-foreground text-sm">
        {formatDate(banner.updatedAt)}
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
        <button className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    ),
  }))

  return (
    <AdminPageCommonLayout
      title="배너 관리"
      description="메인 페이지의 홍보 배너를 관리합니다."
    >
      {/* 배너 리스트 */}
      <div className="border-border rounded-3xl border bg-white">
        {/* 현황 */}
        <div className="flex items-center gap-3 border-b-2 p-4 text-sm">
          <span className="font-medium">전체 배너 ({banners.length})</span>
          <div className="bg-border h-4 w-px" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">활성 {activeCount}</span>
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
          <AdminTablePagination />
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
