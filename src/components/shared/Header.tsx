import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { SideMateLogo } from '../icons'
import { Button } from '../ui/button'

export const Header = () => {
  const isLoggedIn = true
  return (
    <header className="border-border-light bg-surface sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 whitespace-nowrap md:px-10">
      <div className="flex items-center gap-3">
        <SideMateLogo />
      </div>
      <div className="flex flex-1 items-center justify-end gap-8">
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-text-muted hover:text-text-main text-sm font-semibold transition-colors"
          >
            홈
          </Link>
          <Link
            className="text-text-main hover:text-primary text-sm font-semibold transition-colors"
            to="/"
          >
            프로젝트
          </Link>
          <Link
            className="text-text-muted hover:text-text-main text-sm font-semibold transition-colors"
            to="#"
          >
            AI 피드백
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <button className="text-text-muted hover:text-primary transition-colors">
              <Bell size={22} strokeWidth={1.5} />
            </button>
            <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
              <img
                src="https://github.com/shadcn.png"
                alt="프로필"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : (
          <Button variant="black" size="lg">
            로그인
          </Button>
        )}
      </div>
    </header>
  )
}
