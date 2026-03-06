import { Navigate, Outlet } from 'react-router-dom'

// TODO: redux userSlice 연결 후 실제 role 상태로 교체
const isAdmin = true

const AdminRoute = () => {
  if (!isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}

export default AdminRoute
