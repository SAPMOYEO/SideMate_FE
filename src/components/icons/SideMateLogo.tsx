const LOGO_ICON = '/sidematelogo.svg'

export const SideMateLogo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <img src={LOGO_ICON} alt="SideMate" className="h-8 w-auto shrink-0" />
      <h1 className="hidden sm:block">
        <span
          className={`xs:text-white text-primary text-2xl font-[800] tracking-[-0.02em] antialiased dark:text-white`}
        >
          SideMate
        </span>
      </h1>
    </div>
  )
}
