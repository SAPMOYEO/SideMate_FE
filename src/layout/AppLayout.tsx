import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Header } from '@/components/shared/Header'
import { useAppSelector } from '@/hooks'

const AppLayout = () => {
  const location = useLocation()
  const { user, loginLoading } = useAppSelector((state) => state.user)

  const isOnboardingPage = location.pathname === '/onboarding'

  if (loginLoading) return null
  if (user && (!user.phone || user.phone.trim() === '') && !isOnboardingPage) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <div>
      {!isOnboardingPage && <Header />}

      <div className="flex">
        <main className="animate-in fade-in slide-in-from-bottom-4 flex-1 duration-500 ease-out">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
