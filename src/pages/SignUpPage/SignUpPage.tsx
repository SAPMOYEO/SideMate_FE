import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { UserBasicInfo } from './components/UserBasicInfo'
import { PasswordField } from './components/PasswordField'
import { TechStackField } from './components/TechStackField'
import { TermsSection } from './components/TermsSection'
import { signUpSchema, type SignUpFormValues } from './components/signUp.schema'
import { registerUser } from '@/features/slices/userSlice'
import { useAppDispatch } from '@/hooks'

const SignUpPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      techStacks: [],
      terms: {
        service: false,
        privacy: false,
        marketing: false,
      },
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data: SignUpFormValues) => {
    const userData = {
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      techStacks: data.techStacks,
      terms: {
        marketing: data.terms.marketing,
      },
    }

    try {
      const resultAction = await dispatch(
        registerUser(userData as SignUpFormValues)
      )

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('회원가입이 완료되었습니다! 로그인해 주세요.')
        navigate('/login')
      } else {
        const errorMessage = resultAction.payload as string
        toast.error(errorMessage || '회원가입 중 오류가 발생했습니다.')
      }
    } catch (err) {
      console.error(err)
      toast.error('네트워크 오류가 발생했습니다.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center lg:hidden">
        <Link to="/" className="mb-4 flex items-center gap-2">
          <img
            src="/favicon.svg"
            alt="SideMate Logo"
            className="size-5 sm:size-7"
          />
          <span className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            SideMate
          </span>
        </Link>
      </div>

      <div className="mb-8 text-center lg:text-left">
        <h2 className="mb-3 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-black tracking-tight text-slate-900 dark:text-white">
          당신의 여정을 시작하세요
        </h2>

        <p className="text-[clamp(0.85rem,1.5vw,1.1rem)] font-medium break-keep text-slate-500 dark:text-slate-400">
          AI 기획부터 팀 빌딩까지, 프로젝트 성공을 향한 첫걸음
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
          Google 계정으로 시작
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

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <UserBasicInfo />
          <PasswordField />
          <TechStackField />
          <TermsSection />

          <Button
            type="submit"
            className="mt-4 h-12 w-full bg-zinc-800 font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              '계정 생성하기'
            )}
          </Button>
        </form>
      </FormProvider>

      <p className="mt-8 text-center text-sm text-slate-500">
        이미 회원이신가요?
        <Link
          to="/login"
          className="text-primary ml-1 font-bold hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  )
}

export default SignUpPage
