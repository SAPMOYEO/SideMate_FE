import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SortOption {
  value: string
  label: string
}

const DEFAULT_OPTIONS: SortOption[] = [
  { value: '-createdAt', label: '최신순' },
  { value: 'createdAt', label: '오래된순' },
]

interface AdminSortSelectProps {
  value: string
  onChange: (value: string) => void
  options?: SortOption[]
}

const AdminSortSelect = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: AdminSortSelectProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="h-8 w-28 text-sm">
      <SelectValue placeholder="정렬" />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

export default AdminSortSelect
