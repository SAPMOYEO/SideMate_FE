import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LogOut,
  User,
  CreditCard,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
  CircleUser,
} from 'lucide-react'
import { SideMateLogo } from '../icons'
import { NotificationPopover } from './NotificationPopover'
import { Button } from '../ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { clearUser } from '@/features/slices/userSlice'
import { fetchMyQuota } from '@/features/slices/aiQuotaSlice'
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
  const quotaSummary = useAppSelector((state) => state.aiQuota.summary)
  const isLoggedIn = !!user
  const totalRemaining = quotaSummary?.totalRemaining ?? 0
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchMyQuota())
    }
  }, [dispatch, isLoggedIn])

  const handleLogout = () => {
    dispatch(clearUser())
    navigate('/login')
  }

  const iconClasses =
    'mr-2 h-4 w-4 text-muted-foreground transition-all duration-500 ease-in-out group-hover:text-primary group-hover:stroke-[2.5]'
  const menuItemClasses = 'group cursor-pointer hover:bg-primary/10'

  return (
    <>
      <header className="border-border-light bg-surface sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4 whitespace-nowrap md:px-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-[120px] md:w-[160px]">
            <SideMateLogo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-8">
          <div className="hidden items-center gap-8 md:flex">
            <Link
              className="text-text-main hover:text-primary text-sm font-semibold transition-colors"
              to="/projects"
            >
              프로젝트
            </Link>
            <Link
              className="text-text-muted hover:text-text-main flex items-center text-sm font-semibold transition-colors"
              to="#"
            >
              AI 피드백
            </Link>

            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors"
                  >
                    <Sparkles size={16} strokeWidth={2} />
                    <span>AI {totalRemaining}회</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2 w-56">
                  <DropdownMenuLabel>AI 사용 가능 횟수</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 text-sm">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">무료</span>
                      <span className="font-semibold">
                        {quotaSummary?.freeRemaining ?? 0}회
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">구독</span>
                      <span className="font-semibold">
                        {quotaSummary?.subExtraRemaining ?? 0}회
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">충전</span>
                      <span className="font-semibold">
                        {quotaSummary?.topUpRemaining ?? 0}회
                      </span>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <div className="flex items-center justify-between py-1">
                      <span className="font-medium">총 사용 가능</span>
                      <span className="text-primary font-bold">
                        {totalRemaining}회
                      </span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3.5 md:gap-7">
              <div className="flex items-center md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-primary hover:text-primary/80 cursor-pointer transition-colors">
                      <Sparkles size={20} strokeWidth={1.8} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="mt-2 w-56">
                    <DropdownMenuLabel>AI 사용 가능 횟수</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-2 text-sm">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground">무료</span>
                        <span className="font-semibold">
                          {quotaSummary?.freeRemaining ?? 0}회
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground">구독</span>
                        <span className="font-semibold">
                          {quotaSummary?.subExtraRemaining ?? 0}회
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-muted-foreground">충전</span>
                        <span className="font-semibold">
                          {quotaSummary?.topUpRemaining ?? 0}회
                        </span>
                      </div>
                      <DropdownMenuSeparator className="my-2" />
                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium">총 사용 가능</span>
                        <span className="text-primary font-bold">
                          {totalRemaining}회
                        </span>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <NotificationPopover />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="h-9 w-9 cursor-pointer overflow-hidden rounded-full bg-zinc-100 ring-offset-2 transition-all duration-500 hover:ring-2 hover:ring-slate-300 dark:bg-slate-800">
                    {user?.profile?.profileImage ? (
                      <img
                        src={user.profile.profileImage}
                        alt="프로필"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <CircleUser
                          size={32}
                          strokeWidth={1.5}
                          className="relative top-[0.5px]"
                        />
                      </div>
                    )}
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
                    onClick={() => {
                      navigate('/my')
                      setTimeout(() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        })
                      }, 300)
                    }}
                  >
                    <User className={iconClasses} />
                    <span>내 계정</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={menuItemClasses}
                    onClick={() => {
                      navigate('/payment-history')
                      setTimeout(() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        })
                      }, 300)
                    }}
                  >
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

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-text-muted hover:text-primary cursor-pointer transition-colors md:hidden"
              >
                <Menu size={22} strokeWidth={1.8} />
              </button>
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

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="bg-surface absolute top-0 right-0 flex h-full w-[280px] flex-col border-l px-6 py-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-base font-bold">메뉴</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-muted hover:text-primary cursor-pointer transition-colors"
              >
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-5">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-main hover:text-primary text-base font-semibold transition-colors"
              >
                홈
              </Link>
              <Link
                to="/projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-main hover:text-primary text-base font-semibold transition-colors"
              >
                프로젝트
              </Link>
              <Link
                to="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-main hover:text-primary flex items-center text-base font-semibold transition-colors"
              >
                AI 피드백
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
