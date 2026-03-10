import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Loader2, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch } from '@/hooks'
import { loginAdmin } from '@/features/slices/userSlice'

const adminLoginSchema = z.object({
  name: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
})

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>

const AdminLoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { name: '', password: '' },
  })

  const onSubmit = async (data: AdminLoginFormValues) => {
    setLoginError(null)
    const resultAction = await dispatch(loginAdmin(data))

    if (loginAdmin.fulfilled.match(resultAction)) {
      navigate('/admin/users')
    } else {
      setLoginError(
        (resultAction.payload as string) ??
          '아이디 또는 비밀번호가 올바르지 않습니다.'
      )
    }
  }

  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-background rounded-2xl border shadow-sm">
          {/* Card Header */}
          <div className="border-b px-8 py-6 text-center">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <ShieldCheck className="text-primary" size={22} />
            </div>
            <h1 className="text-lg font-bold">관리자 로그인</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              SideMate Admin에 오신 것을 환영합니다.
            </p>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* 서버 에러 */}
              {loginError && (
                <div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                  <TriangleAlert className="size-4 shrink-0" />
                  {loginError}
                </div>
              )}

              {/* ID */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">아이디</label>
                <Input
                  {...register('name')}
                  type="text"
                  placeholder="admin"
                  className={`h-11 ${errors.name ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                />
                {errors.name && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <TriangleAlert size={12} />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">비밀번호</label>
                <div className="relative">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    className={`h-11 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <TriangleAlert size={12} />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="mt-2 h-11 w-full font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground mt-6 text-center text-xs">
          SideMate Admin · 허가된 관리자만 접근 가능합니다
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage
