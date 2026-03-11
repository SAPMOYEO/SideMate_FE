import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'
import FindAccountLayout from './components/FindAccountLayout'
import FindAccountHeader from './components/FindAccountHeader'
import api from '@/utils/api/api.instance'
import { PasswordField } from '@/pages/SignUpPage/components/PasswordField'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
      .regex(/[a-z]/, { message: '소문자가 포함되어야 합니다.' })
      .regex(/[A-Z]/, { message: '대문자가 포함되어야 합니다.' })
      .regex(/[0-9]/, { message: '숫자가 포함되어야 합니다.' })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: '특수문자가 포함되어야 합니다.',
      })
      .refine((val) => !val.includes(' '), {
        message: '공백을 포함할 수 없습니다.',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해 주세요.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()

  const [isValidating, setIsValidating] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)

  const methods = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  })

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get(`/user/verify-reset-token/${token}`)
        setIsTokenValid(true)
      } catch (err) {
        console.error(err)
        setIsTokenValid(false)
      } finally {
        setIsValidating(false)
      }
    }
    verifyToken()
  }, [token])

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await api.put('/user/reset-password', {
        token,
        password: data.password,
      })
      toast.success('비밀번호가 성공적으로 변경되었습니다.')
      navigate('/login')
    } catch (err) {
      console.error(err)
      const axiosError = err as {
        response?: {
          data?: { message?: string }
          status?: number
        }
      }
      const message =
        axiosError.response?.data?.message ||
        '비밀번호 재설정 중 오류가 발생했습니다.'
      toast.error(message)
      if (axiosError.response?.status === 400) setIsTokenValid(false)
    }
  }

  if (isValidating) {
    return (
      <FindAccountLayout>
        <div className="flex h-40 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </FindAccountLayout>
    )
  }

  if (!isTokenValid) {
    return (
      <FindAccountLayout>
        <div className="animate-in fade-in zoom-in-95 py-10 text-center duration-300">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-slate-50 p-4 dark:bg-slate-800">
              <AlertCircle className="size-12 text-zinc-800" />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
            만료된 링크입니다
          </h2>
          <p className="mb-10 text-[15px] leading-relaxed text-slate-500">
            보안을 위해 비밀번호 재설정 링크는 <br />
            <strong>발송 후 10분 동안</strong>만 유효합니다. <br />
            다시 한번 재설정 요청해 주세요.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/forgot-password')}
              className="h-12 w-full bg-zinc-900 font-bold"
            >
              재설정 메일 받기
            </Button>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 hover:underline"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </FindAccountLayout>
    )
  }

  return (
    <FindAccountLayout>
      <FindAccountHeader
        title="새 비밀번호 설정"
        description="계정 보안을 위해 새로운 비밀번호를 입력해 주세요."
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <PasswordField />

          <Button
            type="submit"
            className="shadow-primary/20 mt-2 h-12 w-full bg-zinc-900 font-bold shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="size-5" />
                <span>변경 중...</span>
              </div>
            ) : (
              '비밀번호 변경하기'
            )}
          </Button>
        </form>
      </FormProvider>
    </FindAccountLayout>
  )
}

export default ResetPasswordPage
