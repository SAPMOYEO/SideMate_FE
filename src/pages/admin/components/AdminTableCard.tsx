import type { ReactNode } from 'react'
import AdminTable, { type TableColumn } from './AdminTable'
import { AdminTablePagination } from './AdminTablePagination'

interface AdminTableCardProps {
  label: string
  totalCount: number
  search?: string
  toolbar?: ReactNode
  isLoading: boolean
  isError: boolean
  columns: TableColumn[]
  rows: Record<string, ReactNode>[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const AdminTableCard = ({
  label,
  totalCount,
  search,
  toolbar,
  isLoading,
  isError,
  columns,
  rows,
  page,
  totalPages,
  onPageChange,
}: AdminTableCardProps) => (
  <div className="border-border rounded-3xl border bg-white">
    {/* 헤더: 카운트 + 툴바 */}
    <div className="flex items-center justify-between border-b-2 p-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">
          {label} ({totalCount.toLocaleString()})
          {search && (
            <span className="text-muted-foreground ml-1 font-normal">
              · "{search}" 검색 결과
            </span>
          )}
        </span>
      </div>
      {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
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
        <AdminTable columns={columns} rows={rows} />
      )}
    </div>

    {/* 페이지네이션 */}
    <div className="flex items-center justify-end gap-4 rounded-b-3xl bg-[#f8fafc] px-4 py-3">
      <AdminTablePagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  </div>
)

export default AdminTableCard
