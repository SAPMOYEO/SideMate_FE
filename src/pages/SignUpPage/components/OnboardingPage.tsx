import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useForm,
  FormProvider,
  useWatch,
  type FieldErrors,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { registerSocialUser } from '@/features/slices/userSlice'
import { UserBasicInfo } from '@/pages/SignUpPage/components/UserBasicInfo'
import { TechStackSelector } from '@/components/shared/TechStackSelector'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { TermsSection } from './TermsSection'
import { Spinner } from '@/components/ui/spinner'
import { usePhoneValidation } from '@/hooks/usePhoneValidation'
import type { User } from '@/features/slices/userSlice'
import {
  onboardingSchema,
  type OnboardingFormValues,
} from '@/utils/schemas/user.schema'

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)

  const { phone, phoneError } = usePhoneValidation('', '')

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      phone: '',
      techStacks: [],
    },
  })

  useEffect(() => {
    if (user) {
      methods.setValue('email', user.email || '')
      methods.setValue('name', user.name || '')
    }
  }, [user, methods])

  useEffect(() => {
    if (phone) {
      methods.setValue('phone', phone, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [phone, methods])

  const {
    formState: { isSubmitting, isValid },
  } = methods

  const onInvalid = (errors: FieldErrors) => {
    const errorKeys = Object.keys(errors)
    if (errorKeys.length > 0) {
      toast.error('입력 정보를 다시 확인해 주세요.')
    }
  }
  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      const tempUser = user as User & { googleId?: string; picture?: string }

      const finalData = {
        name: data.name,
        email: tempUser?.email,
        googleId: tempUser?.googleId,
        phone: data.phone,
        techStacks: data.techStacks,
        profileImage: tempUser?.picture || tempUser?.profile?.profileImage,
        marketingAgree: data.terms?.marketing || false,
      }

      await dispatch(registerSocialUser(finalData)).unwrap()

      toast.success('SideMate에 성공적으로 가입되었습니다.')
      navigate('/', { replace: true })
    } catch (error: unknown) {
      console.error(error)
      let errorMessage = '가입 중 오류가 발생했습니다.'

      if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message
      }

      toast.error(errorMessage)
    }
  }

  const watchedName = useWatch({
    control: methods.control,
    name: 'name',
  })

  const watchedTechStacks =
    useWatch({
      control: methods.control,
      name: 'techStacks',
    }) || []

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-md duration-500 lg:pt-16">
      <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
        <div className="flex items-center justify-center rounded-full border border-slate-100 bg-white p-2 shadow-sm">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="G"
            className="size-7"
          />
        </div>
        <span className="text-sm font-black tracking-tight text-zinc-700 uppercase">
          구글 계정으로 가입하셨습니다.
        </span>
      </div>
      <div className="mb-10 text-center lg:text-left">
        <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          <span className="text-zinc-800 dark:text-indigo-400">
            {watchedName || user?.name}님,
          </span>
          <span className="break-keep"> 반갑습니다! </span>
        </h2>
        <p className="text-sm leading-relaxed font-medium break-keep text-slate-500 dark:text-slate-400">
          원활한 서비스 이용을 위해 필수 정보를 입력해 주세요.
          <br />
          이후부터는 구글로 간편하게 로그인하실 수 있습니다.
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            methods.handleSubmit(onSubmit, onInvalid)(e)
          }}
          className="space-y-4 text-left"
        >
          <div className="space-y-4">
            <UserBasicInfo isReadOnly={true} />

            <TechStackSelector
              selectedStacks={watchedTechStacks}
              onAdd={(stack) => {
                const current = methods.getValues('techStacks') || []
                methods.setValue('techStacks', [...current, stack], {
                  shouldValidate: true,
                })
              }}
              onRemove={(stack) => {
                const current = methods.getValues('techStacks') || []
                methods.setValue(
                  'techStacks',
                  current.filter((s) => s !== stack),
                  { shouldValidate: true }
                )
              }}
              error={methods.formState.errors.techStacks?.message}
            />

            <TermsSection />
          </div>

          <Button
            type="submit"
            className={`shadow-primary/20 mt-2 h-12 w-full font-bold shadow-lg transition-all ${
              isSubmitting || !isValid || !!phoneError
                ? 'bg-zinc-900 !opacity-100'
                : 'hover:bg-primary bg-zinc-900'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="size-5" />
                <span>정보 저장 중...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-white p-1 shadow-sm">
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="G"
                    className="size-4"
                  />
                </div>
                <span className="tracking-tight">구글 계정으로 시작하기</span>
              </div>
            )}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}

export default OnboardingPage
