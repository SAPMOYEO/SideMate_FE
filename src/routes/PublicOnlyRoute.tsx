import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const PublicOnlyRoute = () => {
  const { user } = useAppSelector((state) => state.user)
  if (user) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export default PublicOnlyRoute
