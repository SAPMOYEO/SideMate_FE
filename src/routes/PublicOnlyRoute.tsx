import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const PublicOnlyRoute = () => {
  const { user, loginLoading } = useAppSelector((state) => state.user)
  if (loginLoading) return null
  if (user) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default PublicOnlyRoute
