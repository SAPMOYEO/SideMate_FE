import React, { useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Eye, EyeOff, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { type SignUpFormValues } from './signUp.schema'

export const PasswordField: React.FC = () => {
  const {
    register,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<SignUpFormValues>()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const passwordValue = watch('password', '')
  const confirmPasswordValue = watch('confirmPassword', '')

  React.useEffect(() => {
    if (confirmPasswordValue) {
      trigger('confirmPassword')
    }
  }, [passwordValue, confirmPasswordValue, trigger])

  const passwordRules = [
    { label: '최소 6자 이상', test: (val: string) => val.trim().length >= 6 },
    {
      label: '대문자 및 소문자 포함',
      test: (val: string) => /[a-z]/.test(val) && /[A-Z]/.test(val),
    },
    { label: '숫자 포함', test: (val: string) => /[0-9]/.test(val) },
    {
      label: '특수문자 포함',
      test: (val: string) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
    },
    {
      label: '공백 제외',
      test: (val: string) => val.length > 0 && !val.includes(' '),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid gap-1.5 text-left">
        <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          비밀번호<span className="ml-0.5 text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            {...register('password')}
            onFocus={() => setIsPasswordFocused(true)}
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

        {(isPasswordFocused || passwordValue.length > 0) &&
          !passwordRules.every((rule) => rule.test(passwordValue)) && (
            <div className="animate-in fade-in slide-in-from-top-1 mt-2 space-y-1.5 px-1">
              {passwordRules.map((rule, index) => {
                const isPassed = rule.test(passwordValue)
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                      isPassed ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  >
                    {isPassed ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <div className="ml-1 size-1.5 rounded-full bg-current" />
                    )}
                    {rule.label}
                  </div>
                )
              })}
            </div>
          )}
        {errors.password &&
          passwordRules.every((rule) => rule.test(passwordValue)) && (
            <p className="ml-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
      </div>

      <div className="grid gap-1.5 text-left">
        <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          비밀번호 확인<span className="ml-0.5 text-red-500">*</span>
        </label>
        <div className="relative">
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  field.onChange(e)
                  trigger('confirmPassword')
                }}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`h-12 pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
              />
            )}
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
          <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </div>
  )
}
