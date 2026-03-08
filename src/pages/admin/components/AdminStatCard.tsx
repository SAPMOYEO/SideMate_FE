import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface AdminStatCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  value: string
  sub: ReactNode
}

const AdminStatCard = ({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  sub,
}: AdminStatCardProps) => {
  return (
    <div className="border-border flex items-center gap-4 rounded-2xl border bg-white p-5">
      <div className={`rounded-xl p-3 ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        <div className="mt-0.5">{sub}</div>
      </div>
    </div>
  )
}

export default AdminStatCard
