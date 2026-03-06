import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const AdminRoute = () => {
  const { user } = useAppSelector((state) => state.user)

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute
