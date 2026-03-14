import { SideMateLogo } from '@/components/icons/SideMateLogo'
import React from 'react'
import { Link } from 'react-router-dom'

interface FindAccountHeaderProps {
  title: string
  description: string
  icon?: React.ReactNode
}

const FindAccountHeader: React.FC<FindAccountHeaderProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <div className="mb-8 flex flex-col items-center lg:hidden">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <SideMateLogo className="block" />
        </Link>
      </div>
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-indigo-500 dark:bg-slate-800">
          {icon}
        </div>
      )}
      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="text-sm leading-relaxed font-medium break-keep text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  )
}

export default FindAccountHeader
