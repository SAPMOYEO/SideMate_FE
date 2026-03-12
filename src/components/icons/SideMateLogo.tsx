const LOGO_ICON = '/sidematelogo.svg'

export const SideMateLogo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <img src={LOGO_ICON} alt="SideMate" className="h-8 w-auto shrink-0" />

      <img
        src="/logo-text.svg"
        alt=""
        className="hidden h-5 w-auto object-contain sm:block dark:invert"
      />
      <h1 className="hidden sm:block">
        <span
          className={`text-2xl font-[800] tracking-[-0.02em] text-[#430387] antialiased lg:text-white dark:text-white`}
        >
          SideMate
        </span>
      </h1>
    </div>
  )
}
