import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const PrivateRoute = () => {
  const { user } = useAppSelector((state) => state.user)
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export default PrivateRoute
