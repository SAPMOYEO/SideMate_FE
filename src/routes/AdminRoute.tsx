import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const AdminRoute = () => {
  const { user, isInitializing } = useAppSelector((state) => state.user)

  console.log('AdminRoute - user:', user?.role)
  if (isInitializing) {
    return <div>로딩 중...</div>
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute
