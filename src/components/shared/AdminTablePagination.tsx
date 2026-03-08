import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface Props {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AdminTablePagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  // 최대 5개 페이지 번호 노출 (앞뒤 ... 처리)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (page <= 3) return [1, 2, 3, 4, null, totalPages]
    if (page >= totalPages - 2)
      return [
        1,
        null,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    return [1, null, page - 1, page, page + 1, null, totalPages]
  }

  return (
    <Pagination className="justify-end">
      <PaginationContent className="gap-0">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) onPageChange(page - 1)
            }}
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-40' : ''}
          />
        </PaginationItem>

        {getPageNumbers().map((p, idx) =>
          p === null ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(p)
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page < totalPages) onPageChange(page + 1)
            }}
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages ? 'pointer-events-none opacity-40' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
