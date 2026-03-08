import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface AdminSearchInputProps {
  value: string
  onChange: (value: string) => void
  onCommit: () => void
  placeholder?: string
  className?: string
}

const AdminSearchInput = ({
  value,
  onChange,
  onCommit,
  placeholder = '검색 후 Enter',
  className = 'w-60',
}: AdminSearchInputProps) => (
  <div className="relative">
    <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommit()
      }}
      className={`h-8 pl-8 text-sm ${className}`}
    />
  </div>
)

export default AdminSearchInput
