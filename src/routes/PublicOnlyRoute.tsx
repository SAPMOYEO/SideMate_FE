import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const PublicOnlyRoute = () => {
  const { user, isInitializing } = useAppSelector((state) => state.user)
  if (isInitializing) return null
  if (user) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default PublicOnlyRoute
