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
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import PaymentPage from '@/pages/PaymentPage/PaymentPage'
import ProjectPage from '@/pages/ProjectPage/ProjectPage'
import ProjectDetailPage from '@/pages/ProjectDetailPage/ProjectDetailPage'
import ProjectCreatePage from '@/pages/ProjectCreatePage/ProjectCreatePage'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage/PaymentSuccessPage'
import FindEmailPage from '@/pages/LoginPage/FindAccount/FindEmailPage'
import FindPasswordPage from '@/pages/LoginPage/FindAccount/FindPasswordPage'
import ResetPasswordPage from '@/pages/LoginPage/FindAccount/ResetPasswordPage'
import OnboardingPage from '@/pages/SignUpPage/components/OnboardingPage'
import HomePage from '@/pages/Home/HomePage'
import MyProjectPage from '@/pages/MyPage/MyProjectPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public - 누구나 접근 가능 */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Route>

      {/* PublicOnly - 비로그인만 접근 (로그인 상태면 / 로 리다이렉트) */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* 이메일 찾기/비밀번호 찾기/비밀번호 재설정 페이지 */}
          <Route path="/forgot-email" element={<FindEmailPage />} />
          <Route path="/forgot-password" element={<FindPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
        </Route>
      </Route>

      {/* Private - 로그인 필요 (비로그인이면 /login 으로 리다이렉트) */}
      <Route element={<PrivateRoute />}>
        {/* 구글유저 가입 시 필수정보 받기위해 /onboarding 페이지로 이동 */}
        <Route element={<AuthLayout />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/projects/create" element={<ProjectCreatePage />} />
          <Route path="/projects/:id/edit" element={<ProjectCreatePage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/my/project" element={<MyProjectPage />} />
        </Route>
      </Route>

      {/* Admin Login - 인증 없이 접근 가능 */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

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
