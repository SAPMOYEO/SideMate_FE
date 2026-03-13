import { CheckCircle2 } from 'lucide-react'

interface Props {
  role: {
    name: string
    current: number
    total: number
  }
}

const RoleProgress = ({ role }: Props) => {
  const percent = (role.current / role.total) * 100

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span className="font-medium">{role.name}</span>
        <span>
          {role.current >= role.total ? (
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              모집 완료
            </span>
          ) : (
            <span className="text-primary rounded-full bg-indigo-50 px-2 py-0.5 font-medium">
              {role.current} / {role.total}
            </span>
          )}
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-200">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default RoleProgress
