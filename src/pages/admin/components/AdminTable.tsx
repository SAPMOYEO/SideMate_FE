import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface TableColumn {
  key: string
  label: string
  className?: string
}

interface AdminTableProps {
  columns: TableColumn[]
  rows: Record<string, ReactNode>[]
}

const AdminTable = ({ columns, rows }: AdminTableProps) => {
  return (
    <Table className="border-collapse">
      <TableHeader>
        <TableRow className="bg-[#f8fafc]">
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={`text-accent-foreground px-6 py-5 ${col.className ?? ''}`}
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-muted-foreground py-12 text-center text-sm"
            >
              데이터가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={`px-6 py-5 ${col.className ?? ''}`}
                >
                  {row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default AdminTable
