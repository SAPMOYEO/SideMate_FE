import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Spinner } from '@/components/ui/spinner'
import { GoogleLoginButton } from '@/components/shared/GoogleLoginButton'
import { SideMateLogo } from '@/components/icons/SideMateLogo'

const SignUpPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    reValidateMode: 'onBlur',
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
        toast.success('회원가입이 완료되었습니다!')
        navigate('/login')
        return
      }

      const errorMessage = resultAction.payload as string

      if (errorMessage.match(/이메일|존재|Email/)) {
        methods.setError(
          'email',
          {
            type: 'manual',
            message: '이미 사용 중인 이메일입니다.',
          },
          { shouldFocus: true }
        )
        return
      }

      if (errorMessage.match(/휴대폰|번호|Phone/)) {
        methods.setError(
          'phone',
          {
            type: 'manual',
            message: '이미 사용 중인 휴대폰 번호입니다.',
          },
          { shouldFocus: true }
        )
        return
      }

      toast.error(errorMessage || '회원가입 중 오류가 발생했습니다.')
    } catch (err) {
      console.error(err)
      toast.error('네트워크 오류가 발생했습니다.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center lg:hidden">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <SideMateLogo className="block" />
        </Link>
      </div>

      <div className="mb-8 text-center lg:text-left">
        <h2 className="mb-2 text-3xl font-black text-slate-900 dark:text-white">
          당신의 여정을 시작하세요
        </h2>
        <p className="text-sm font-medium text-slate-500 sm:text-base dark:text-slate-400">
          AI 기획부터 팀 빌딩까지, 프로젝트 성공을 향한 첫걸음
        </p>
      </div>
      <GoogleLoginButton text="Google 계정으로 시작하기" />

      <div className="relative mb-8 text-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100 dark:border-slate-800"></span>
        </div>
        <span className="relative bg-white px-4 text-xs font-bold tracking-widest text-slate-400 uppercase dark:bg-slate-900">
          or
        </span>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(onSubmit)(e)
          }}
          className="space-y-4 text-left"
        >
          <UserBasicInfo />
          <PasswordField />
          <TechStackField />
          <TermsSection />
          <Button
            type="submit"
            className="shadow-primary/20 mt-2 h-12 w-full bg-zinc-900 font-bold shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="size-5" />
                <span>가입 처리 중...</span>
              </div>
            ) : (
              '계정 생성하기'
            )}
          </Button>
        </form>
      </FormProvider>

      <p className="mt-8 pb-12 text-center text-sm text-slate-500">
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
