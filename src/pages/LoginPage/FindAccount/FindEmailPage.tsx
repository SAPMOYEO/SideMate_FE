import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import FindAccountLayout from './components/FindAccountLayout'
import FindAccountHeader from './components/FindAccountHeader'
import { useAppDispatch } from '@/hooks'
import { findUserEmail } from '@/features/slices/userSlice'
import { Spinner } from '../../../components/ui/spinner'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { GoogleLoginButton } from '@/components/shared/GoogleLoginButton'
import { useFormHelper } from '@/hooks/useFormHelper.ts'
import { userBaseSchema } from '@/utils/schemas/user.schema'

const findEmailSchema = userBaseSchema.pick({ name: true, phone: true })

type FindEmailFormValues = z.infer<typeof findEmailSchema>

const FindEmailFormInner = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FindEmailFormValues>()
  const { handleInputChange } = useFormHelper<FindEmailFormValues>()

  return (
    <div className="space-y-5">
      <div className="grid gap-1.5">
        <label className="px-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          이름<span className="ml-0.5 text-red-500">*</span>
        </label>
        <Input
          {...register('name')}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="이름을 입력하세요"
          className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && (
          <p className="ml-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label className="px-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          휴대폰 번호<span className="ml-0.5 text-red-500">*</span>
        </label>
        <Input
          {...register('phone')}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value)
            handleInputChange('phone', formatted)
          }}
          maxLength={13}
          type="tel"
          placeholder="휴대폰 번호를 입력하세요"
          className={`h-12 ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && (
          <p className="ml-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>
    </div>
  )
}

const FindEmailPage: React.FC = () => {
  const [isFound, setIsFound] = useState(false)
  const [foundEmail, setFoundEmail] = useState('')
  const [provider, setProvider] = useState<'local' | 'google'>('local')
  const dispatch = useAppDispatch()

  const methods = useForm<FindEmailFormValues>({
    resolver: zodResolver(findEmailSchema),
    defaultValues: { name: '', phone: '' },
    mode: 'onBlur',
  })

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
        toast.error('일치하는 사용자 정보를 찾을 수 없습니다.')
      }
    } catch {
      toast.error('오류가 발생했습니다.')
    }
  }

  return (
    <FindAccountLayout>
      <FormProvider {...methods}>
        {!isFound ? (
          <>
            <FindAccountHeader
              title="이메일 찾기"
              description="이름과 휴대폰 번호를 입력해 주세요."
            />
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-5 text-left"
            >
              <FindEmailFormInner />
              <Button
                type="submit"
                className="mt-2 h-12 w-full bg-zinc-900 font-bold"
                disabled={methods.formState.isSubmitting}
              >
                {methods.formState.isSubmitting ? (
                  <Spinner className="size-5" />
                ) : (
                  '이메일 찾기'
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="size-12 text-zinc-800" />
            </div>
            <h2 className="text-2xl font-black">이메일을 찾았습니다.</h2>
            <div className="my-10 rounded-2xl bg-slate-50 p-6">
              <span className="font-black">{foundEmail}</span>
            </div>
            {provider === 'google' && (
              <GoogleLoginButton text="Google 계정으로 로그인" />
            )}
          </div>
        )}
      </FormProvider>

      <div className="mt-10 flex justify-center gap-4 text-xs font-bold text-slate-400">
        <Link to="/login">로그인으로 돌아가기</Link>
        <Link to="/forgot-password">비밀번호 찾기</Link>
      </div>
    </FindAccountLayout>
  )
}

export default FindEmailPage
