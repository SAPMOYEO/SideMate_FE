import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const PrivateRoute = () => {
  const { user, loginLoading } = useAppSelector((state) => state.user)
  const location = useLocation()

  if (loginLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  if (!user.phone && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  if (user.phone && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PrivateRoute
