import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const PrivateRoute = () => {
  const { user, loginLoading } = useAppSelector((state) => state.user)
  if (loginLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    )
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
