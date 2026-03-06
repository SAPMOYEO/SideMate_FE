const AdminPageCommonLayout = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description: string
}) => {
  return (
    <div className="h-full bg-[#f6f6f8] p-8">
      <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden">
        <div>
          <h1 className="mb-2 text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mb-4">{description}</p>
        </div>
        <div className="h-full">{children}</div>
      </div>
    </div>
  )
}

export default AdminPageCommonLayout
