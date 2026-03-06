import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks'
import { loginUser } from '@/features/slices/userSlice'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Loader2, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요.' })
    .email({ message: '올바른 이메일 형식이 아닙니다.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null)
    try {
      const resultAction = await dispatch(loginUser(data))

      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/')
      } else {
        const errorMessage = resultAction.payload as string
        setLoginError(
          errorMessage || '이메일 또는 비밀번호가 일치하지 않습니다.'
        )
        setValue('password', '', { shouldValidate: false })
        setFocus('password')
      }
    } catch (err) {
      console.error(err)
      toast.error('로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center lg:hidden">
        <Link to="/" className="mb-4 flex items-center gap-2">
          <img
            src="/favicon.svg"
            alt="SideMate Logo"
            className="size-7 sm:size-8"
          />
          <span className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            SideMate
          </span>
        </Link>
      </div>

      <div className="mb-8 text-center lg:text-left">
        <h2 className="mb-2 text-3xl font-black text-slate-900 dark:text-white">
          환영합니다
        </h2>
        <p className="text-sm font-medium text-slate-500 sm:text-base dark:text-slate-400">
          AI와 동료들이 기다리고 있는 대시보드로 이동합니다.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          type="button"
          className="h-11 border-slate-200 font-semibold dark:border-slate-700"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="G"
            className="mr-2 size-4"
          />
          Google 계정으로 로그인
        </Button>
      </div>

      <div className="relative mb-8 text-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100 dark:border-slate-800"></span>
        </div>
        <span className="relative bg-white px-4 text-xs font-bold tracking-widest text-slate-400 uppercase dark:bg-slate-900">
          or
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
        {loginError && (
          <div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <TriangleAlert className="size-4 shrink-0" />
            {loginError}
          </div>
        )}
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
              이메일 주소
            </label>
            <Link
              to="/forgot-email"
              className="text-primary mb-[-4px] text-xs font-bold hover:underline"
            >
              이메일 찾기
            </Link>
          </div>
          <Input
            {...register('email')}
            type="email"
            placeholder="example@email.com"
            className={`h-12 ${errors.email ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
          />
          {errors.email && (
            <p className="ml-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
              비밀번호
            </label>
            <Link
              to="/forgot-password"
              className="text-primary mb-[-4px] text-xs font-bold hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className={`h-12 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="ml-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="shadow-primary/20 mt-2 h-12 w-full bg-zinc-900 font-bold shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            '로그인'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          계정이 없으신가요?
          <Link
            to="/signup"
            className="text-primary ml-2 font-bold hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
