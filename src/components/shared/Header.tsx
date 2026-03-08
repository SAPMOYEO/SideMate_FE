import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, User, CreditCard, LayoutDashboard } from 'lucide-react'
import { SideMateLogo } from '../icons'
import { Button } from '../ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { clearUser } from '@/features/slices/userSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export const Header = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { user } = useAppSelector((state) => state.user)
  const isLoggedIn = !!user

  const handleLogout = () => {
    dispatch(clearUser())
    navigate('/login')
  }

  const iconClasses =
    'mr-2 h-4 w-4 text-muted-foreground transition-all duration-500 ease-in-out group-hover:text-primary group-hover:stroke-[2.5]'
  const menuItemClasses = 'group cursor-pointer hover:bg-primary/10'

  return (
    <header className="border-border-light bg-surface sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 whitespace-nowrap md:px-10">
      <div className="flex items-center gap-3">
        <Link to="/">
          <SideMateLogo />
        </Link>
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
            to="/projects"
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
          <div className="flex items-center gap-7">
            <button className="text-text-muted hover:text-primary cursor-pointer transition-colors">
              <Bell size={22} strokeWidth={1.5} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-9 w-9 cursor-pointer overflow-hidden rounded-full bg-gray-200 ring-offset-2 transition-all duration-500 hover:ring-2 hover:ring-slate-300">
                  <img
                    src={
                      user?.profile?.profileImage ||
                      'https://github.com/shadcn.png'
                    }
                    alt="프로필"
                    className="h-full w-full object-cover"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2 w-auto">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-bold">
                      {user?.name}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === 'admin' && (
                  <>
                    <DropdownMenuItem
                      className={menuItemClasses}
                      onClick={() => navigate('/admin/banner')}
                    >
                      <LayoutDashboard className={iconClasses} />
                      <span>대시보드</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className={menuItemClasses}
                  onClick={() => navigate('/my')}
                >
                  <User className={iconClasses} />
                  <span>내 계정</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClasses}>
                  <CreditCard className={iconClasses} />
                  <span>결제정보</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={menuItemClasses}
                  onClick={handleLogout}
                >
                  <LogOut className={iconClasses} />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link to="/login">
            <Button variant="black" size="lg">
              로그인
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
