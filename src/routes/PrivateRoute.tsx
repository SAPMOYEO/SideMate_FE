import { Navigate, Outlet } from 'react-router-dom'

// TODO: redux userSlice 연결 후 실제 인증 상태로 교체
const isLoggedIn = false

const PrivateRoute = () => {
  if (!isLoggedIn) return <Navigate to="/login" replace />

  return <Outlet />
}

export default PrivateRoute
