import { Navigate, Outlet } from 'react-router-dom'

// TODO: redux userSlice 연결 후 실제 인증 상태로 교체
const isLoggedIn = false

const PublicOnlyRoute = () => {
  if (isLoggedIn) return <Navigate to="/" replace />

  return <Outlet />
}

export default PublicOnlyRoute
