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
          {role.current}/{role.total}
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
