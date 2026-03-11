import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import FindAccountLayout from './components/FindAccountLayout'
import FindAccountHeader from './components/FindAccountHeader'
import { useAppDispatch } from '@/hooks'
import { findUserEmail, loginWithGoogle } from '@/features/slices/userSlice'
import { Spinner } from '../../../components/ui/spinner'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { useGoogleLogin } from '@react-oauth/google'

const findEmailSchema = z.object({
  name: z.string().min(1, { message: '이름을 입력해 주세요.' }),
  phone: z
    .string()
    .min(1, { message: '휴대폰 번호를 입력해 주세요.' })
    .regex(/^010-\d{3,4}-\d{4}$/, {
      message: '올바른 휴대폰 번호 형식이 아닙니다.',
    }),
})

type FindEmailFormValues = z.infer<typeof findEmailSchema>

const FindEmailPage: React.FC = () => {
  const navigate = useNavigate()
  const [isFound, setIsFound] = useState(false)
  const [foundEmail, setFoundEmail] = useState('')
  const dispatch = useAppDispatch()
  const [provider, setProvider] = useState<'local' | 'google'>('local')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FindEmailFormValues>({
    resolver: zodResolver(findEmailSchema),
    defaultValues: { name: '', phone: '' },
  })

  const executeGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const user = await dispatch(
          loginWithGoogle(tokenResponse.access_token)
        ).unwrap()

        if (!user.phone || user.phone.trim() === '') {
          navigate('/onboarding')
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error(error)
        toast.error('구글 로그인에 실패했습니다.')
      }
    },
    onError: () => toast.error('구글 로그인 중 오류가 발생했습니다.'),
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted, { shouldValidate: true })
  }

  const onSubmit = async (data: FindEmailFormValues) => {
    try {
      const [resultAction] = await Promise.all([
        dispatch(findUserEmail(data)),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ])

      if (findUserEmail.fulfilled.match(resultAction)) {
        setFoundEmail(resultAction.payload.email)
        setProvider(resultAction.payload.provider)
        setIsFound(true)
      } else {
        const errorMessage = resultAction.payload as string

        if (
          errorMessage.includes('404') ||
          errorMessage.includes('status code 404')
        ) {
          toast.error('일치하는 사용자 정보를 찾을 수 없습니다.')
        } else {
          toast.error(errorMessage || '정보를 찾는 중 오류가 발생했습니다.')
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <FindAccountLayout>
      {!isFound ? (
        <>
          <FindAccountHeader
            title="이메일 찾기"
            description="이름과 휴대폰 번호를 입력해 주세요."
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 text-left"
          >
            <div className="grid gap-1.5">
              <label className="px-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                이름<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  {...register('name')}
                  placeholder="이름을 입력하세요"
                  className={`h-12 ${errors.name ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <label className="px-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                휴대폰 번호<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  {...register('phone')}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  type="tel"
                  placeholder="휴대폰 번호를 입력하세요"
                  className={`h-12 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="shadow-primary/20 mt-2 h-12 w-full bg-zinc-900 font-bold shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="size-5" />
                  <span>처리 중...</span>
                </div>
              ) : (
                '이메일 찾기'
              )}
            </Button>
          </form>
        </>
      ) : (
        <div className="animate-in zoom-in-95 text-center duration-300">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-slate-50 p-4 dark:bg-slate-800">
              <CheckCircle2 className="size-12 text-zinc-800" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">
            이메일을 찾았습니다.
          </h2>
          <p className="mb-8 text-sm font-medium text-slate-500">
            개인정보 보호를 위해 이메일의 일부를 마스킹하였습니다.
          </p>

          <div className="mb-10 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/50">
            <span className="text-md font-black tracking-widest text-zinc-800 dark:text-white">
              {foundEmail}
            </span>
            {provider === 'google' && (
              <p className="mt-2 text-[11px] font-bold text-indigo-500">
                해당 계정은 Google 계정으로 가입되었습니다.
              </p>
            )}
          </div>
          {provider === 'google' ? (
            <Button
              onClick={() => executeGoogleLogin()}
              className="h-12 w-full border border-slate-200 bg-zinc-900 font-bold text-black shadow-lg hover:bg-slate-50"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-white p-1 shadow-sm">
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="G"
                    className="size-4"
                  />
                </div>
                <span className="tracking-tight text-white">
                  Google 계정으로 로그인
                </span>
              </div>
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="h-12 w-full bg-zinc-900 font-bold shadow-lg"
            >
              로그인
            </Button>
          )}
        </div>
      )}

      <div className="mt-10 flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
        <Link
          to="/login"
          className="flex items-center gap-1 transition-colors hover:text-slate-600 hover:underline"
        >
          로그인으로 돌아가기
        </Link>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <Link
          to="/forgot-password"
          className="hover:text-slate-600 hover:underline"
        >
          비밀번호 찾기
        </Link>
      </div>
    </FindAccountLayout>
  )
}

export default FindEmailPage
