import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CATEGORY_COLOR_MAP } from '@/constants/category'

const DEFAULT_COLOR = 'bg-slate-100 text-slate-600 border-slate-200'

interface Props {
  category: string
  className?: string
}

const CategoryBadge = ({ category, className }: Props) => {
  const color = CATEGORY_COLOR_MAP[category] ?? DEFAULT_COLOR

  return <Badge className={cn(color, className)}>{category}</Badge>
}

export default CategoryBadge
