import { Link, NavLink, Outlet } from 'react-router-dom'
import { Briefcase, Megaphone, Users } from 'lucide-react'
import { SideMateLogo } from '@/components/icons'

const AdminHeader = () => {
  return (
    <header className="border-border bg-background flex items-center justify-between border-b px-10 py-3 whitespace-nowrap">
      <div className="text-primary flex items-center gap-4">
        <div className="flex items-center justify-center">
          <SideMateLogo />
        </div>
        <h2 className="text-foreground text-lg font-bold tracking-tight">
          Admin
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-6">
          <Link
            className="hover:text-primary text-muted-foreground text-sm font-medium transition-colors"
            to="#"
          >
            대시보드
          </Link>
          <Link
            className="hover:text-primary text-muted-foreground text-sm font-medium transition-colors"
            to="#"
          >
            시스템 로그
          </Link>
        </div>
        <div className="border-border flex items-center gap-4 border-l pl-8">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-10 min-w-[84px] cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors">
            <span className="truncate">로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  )
}

const AdminLayout = () => {
  return (
    <div className="flex h-dvh flex-col">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <aside className="border-border bg-background flex w-72 flex-col gap-8 overflow-y-auto border-r p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-muted-foreground px-3 text-xs font-semibold tracking-widest uppercase">
              Menu
            </h3>
            <nav className="flex flex-col gap-1">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium'
                  }`
                }
                to="/admin/projects"
              >
                <Briefcase size={22} />
                <span className="text-sm">프로젝트 관리</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium'
                  }`
                }
                to="/admin/users"
              >
                <Users size={22} />
                <span className="text-sm">사용자 관리</span>
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium'
                  }`
                }
                to="/admin/banner"
              >
                <Megaphone size={22} />
                <span className="text-sm">배너 관리</span>
              </NavLink>
            </nav>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
