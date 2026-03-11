import React from 'react'

interface FindAccountLayoutProps {
  children: React.ReactNode
}

const FindAccountLayout: React.FC<FindAccountLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-160px)] w-full flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  )
}

export default FindAccountLayout
