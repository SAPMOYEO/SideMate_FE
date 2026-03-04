import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Loader2, X, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Controller } from 'react-hook-form'
import { toast } from 'sonner'

const signUpSchema = z
  .object({
    name: z.string().min(2, { message: '이름은 2자 이상 입력해주세요.' }),
    phone: z.string().regex(/^010-\d{4}-\d{4}$/, {
      message: '010-0000-0000 형식으로 입력해주세요.',
    }),
    email: z.string().email({ message: '올바른 이메일 형식이 아닙니다.' }),
    password: z
      .string()
      .min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호 확인을 입력해주세요.' }),
    terms: z.boolean().refine((val) => val === true, {
      message: '서비스 이용약관 및 개인정보 처리방침에 동의해야 합니다.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [techStacks, setTechStacks] = useState([
    'React',
    'TypeScript',
    'Tailwind',
  ])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: SignUpFormValues) => {
    console.log('가입 데이터:', { ...data, techStacks })
    toast.success('회원가입 요청 성공')
  }

  const formatPhoneNumber = (value: string) => {
    const nums = value.replace(/[^\d]/g, '')
    if (nums.length <= 3) return nums
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`
  }

  return (
    <div className="animate-in fade-in mx-auto w-full max-w-md duration-500">
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
        <h2 className="mb-2 text-3xl font-black text-slate-900 dark:text-white">
          당신의 여정을 시작하세요
        </h2>
        <p className="font-medium text-slate-500 dark:text-slate-400">
          AI 기획부터 팀 빌딩까지, 프로젝트의 성공을 향한 첫걸음
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div className="grid gap-1.5">
          <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
            이름
          </label>
          <Input
            {...register('name')}
            placeholder="홍길동"
            className={`h-12 pr-10 ${errors.name ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
          />
          {errors.name && (
            <p className="ml-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
            휴대폰 번호
          </label>
          <Input
            {...register('phone')}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value)
              if (formatted.length <= 13) {
                e.target.value = formatted
                register('phone').onChange(e)
              }
            }}
            maxLength={13}
            placeholder="010-0000-0000"
            className={`h-12 pr-10 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
          />
          {errors.phone && (
            <p className="ml-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
            이메일 주소
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="example@email.com"
            className={`h-12 pr-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
          />
          {errors.email && (
            <p className="ml-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <div className="grid gap-1.5 text-left">
            <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              비밀번호
            </label>
            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`h-12 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400"
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
          <div className="grid gap-1.5 text-left">
            <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              비밀번호 확인
            </label>
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`h-12 pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="ml-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 text-left">
          <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
            기술 스택
          </label>
          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            {techStacks.map((tech) => (
              <span
                key={tech}
                className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
              >
                {tech}
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() =>
                    setTechStacks(techStacks.filter((t) => t !== tech))
                  }
                />
              </span>
            ))}
            <button
              type="button"
              className="hover:text-primary cursor-pointer text-xs font-bold text-slate-500"
            >
              <PlusCircle size={14} className="mr-1 inline" />
              기술 추가
            </button>
          </div>
        </div>

        <div className="space-y-2 py-2">
          <div className="flex items-center gap-2 px-1">
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={`size-4 cursor-pointer transition-all ${
                    errors.terms
                      ? 'border-red-500 ring-2 ring-red-500/20 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500'
                      : 'border-slate-300'
                  }`}
                />
              )}
            />
            <label
              htmlFor="terms"
              className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400"
            >
              서비스 약관 및 개인정보 처리방침에 동의합니다.
            </label>
          </div>

          {errors.terms && (
            <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-xs font-bold text-red-500">
              {errors.terms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="bg-primary mt-4 h-12 w-full font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            '계정 생성하기'
          )}
        </Button>
      </form>

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
