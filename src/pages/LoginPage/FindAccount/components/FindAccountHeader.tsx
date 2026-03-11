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
        <Link to="/" className="mb-4 flex items-center gap-2">
          <img
            src="/favicon.svg"
            alt="SideMate Logo"
            className="size-7 sm:size-8"
          />
          <span className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            SideMate
          </span>
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
