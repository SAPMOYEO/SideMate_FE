import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import FindAccountLayout from './components/FindAccountLayout'
import FindAccountHeader from './components/FindAccountHeader'
import { Spinner } from '@/components/ui/spinner'
import api from '@/utils/api/api.instance'

const findPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해 주세요.' })
    .email({ message: '올바른 이메일 형식이 아닙니다.' }),
})

type FindPasswordFormValues = z.infer<typeof findPasswordSchema>

const FindPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [isSent, setIsSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
    defaultValues: { email: '' },
  })
  const onSubmit = async (data: FindPasswordFormValues) => {
    try {
      await api.post('/user/forgot-password', { email: data.email })

      setSentEmail(data.email)
      setIsSent(true)
      toast.success('정보가 일치할 경우 재설정 메일이 발송됩니다.')
    } catch (err) {
      console.error(err)
      const message =
        '메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      toast.error(message)
    }
  }

  return (
    <FindAccountLayout>
      {!isSent ? (
        <>
          <FindAccountHeader
            title="비밀번호 찾기"
            description="이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다."
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 text-left"
          >
            <div className="grid gap-1.5">
              <label className="px-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                이메일 주소<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="example@email.com"
                  className={`h-12 ${errors.email ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-xs text-red-500">
                  {errors.email.message}
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
                  <span>메일 발송 중...</span>
                </div>
              ) : (
                '재설정 메일 보내기'
              )}
            </Button>
          </form>
        </>
      ) : (
        <div className="animate-in zoom-in-95 text-center duration-300">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-slate-50 p-4 dark:bg-slate-800">
              <Mail className="size-12 text-slate-800" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">
            <span className="mb-3 block text-[16px] font-bold text-slate-900 dark:text-slate-200">
              {sentEmail}
            </span>
            메일함을 확인해 주세요.
          </h2>
          <p className="mb-8 text-sm leading-relaxed font-medium text-slate-500">
            가입된 계정이라면 비밀번호 재설정 링크를 보내드렸습니다.
          </p>

          <Button
            onClick={() => navigate('/login')}
            className="shadow-primary/20 h-12 w-full bg-zinc-900 font-bold shadow-lg"
          >
            로그인
          </Button>
        </div>
      )}

      <div className="mt-10 flex items-center justify-center gap-4 text-xs font-bold text-slate-400">
        <Link
          to="/login"
          className="flex items-center gap-1 transition-colors hover:text-slate-600 hover:underline"
        >
          {' '}
          로그인으로 돌아가기
        </Link>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <Link
          to="/forgot-email"
          className="hover:text-slate-600 hover:underline"
        >
          이메일 찾기
        </Link>
      </div>
    </FindAccountLayout>
  )
}

export default FindPasswordPage
