import { Route, Routes } from 'react-router-dom'

import AppLayout from '@/layout/AppLayout'
import AdminRoute from '@/routes/AdminRoute'
import PrivateRoute from '@/routes/PrivateRoute'
import PublicOnlyRoute from '@/routes/PublicOnlyRoute'
import AuthLayout from '@/layout/AuthLayout'
import SignUpPage from '@/pages/SignUpPage/SignUpPage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import MyPage from '@/pages/MyPage/MyPage'
import AdminLayout from '@/layout/AdminLayout'
import AdminProjectPage from '@/pages/admin/AdminProjectPage'
import AdminBanner from '@/pages/admin/AdminBanner'
import AdminUserPage from '@/pages/admin/AdminUser'
import PaymentPage from '@/pages/PaymentPage/PaymentPage'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage/PaymentSuccessPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public - 누구나 접근 가능 */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/projects/:id" element={<div>ProjectDetail</div>} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Route>

      {/* PublicOnly - 비로그인만 접근 (로그인 상태면 / 로 리다이렉트) */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      {/* Private - 로그인 필요 (비로그인이면 /login 으로 리다이렉트) */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/projects/create" element={<div>ProjectCreate</div>} />
          <Route path="/projects/:id/edit" element={<div>ProjectEdit</div>} />
          <Route path="/my" element={<MyPage />} />
        </Route>
      </Route>

      {/* Admin - 관리자만 접근 (아니면 / 로 리다이렉트) */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/banner" element={<AdminBanner />} />
          <Route path="/admin/projects" element={<AdminProjectPage />} />
          <Route path="/admin/users" element={<AdminUserPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
