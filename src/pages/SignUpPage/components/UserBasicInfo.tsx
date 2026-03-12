import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { type SignUpFormValues } from './signUp.schema'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { validateDuplicate } from '@/utils/userValidation'
import { useFormHelper } from '@/hooks/useFormHelper'

interface UserBasicInfoProps {
  isReadOnly?: boolean
}

export const UserBasicInfo: React.FC<UserBasicInfoProps> = ({
  isReadOnly = false,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    setError,
  } = useFormContext<SignUpFormValues>()

  const { handleInputChange } = useFormHelper<SignUpFormValues>()

  return (
    <div className="space-y-4">
      <div className="grid gap-1.5">
        <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          이메일 주소<span className="ml-0.5 text-red-500">*</span>
        </label>
        <Input
          {...register('email', {
            onBlur: async (e) => {
              if (isReadOnly) return
              const email = e.target.value.trim()
              const isValid = await trigger('email')
              if (!isValid || !email) return
              const { isDuplicate } = await validateDuplicate('email', email)
              if (isDuplicate) {
                setError('email', {
                  type: 'manual',
                  message: '이미 사용 중인 이메일입니다.',
                })
              }
            },
          })}
          onChange={(e) => {
            setValue('email', e.target.value, { shouldValidate: false })

            handleInputChange('email', e.target.value)
          }}
          type="email"
          readOnly={isReadOnly}
          placeholder="example@email.com"
          className={`h-12 ${isReadOnly ? 'cursor-not-allowed bg-slate-50 text-slate-500 opacity-80' : ''} ${
            errors.email ? 'border-red-500 focus-visible:ring-red-500/20' : ''
          }`}
        />
        {errors.email && (
          <p className="ml-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          이름<span className="ml-0.5 text-red-500">*</span>
        </label>
        <Input
          {...register('name', {
            onBlur: (e) => {
              e.target.value = e.target.value.trim()
            },
          })}
          onChange={(e) => {
            setValue('name', e.target.value, { shouldValidate: false })
            handleInputChange('name', e.target.value)
          }}
          placeholder="홍길동"
          className={`h-12 ${errors.name ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
        />
        {errors.name && (
          <p className="ml-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          휴대폰 번호<span className="ml-0.5 text-red-500">*</span>
        </label>

        <Input
          {...register('phone', {
            onBlur: async (e) => {
              const phone = e.target.value.trim()
              const isValid = await trigger('phone')
              if (!isValid || !phone) return
              const { isDuplicate } = await validateDuplicate('phone', phone)
              if (isDuplicate) {
                setError('phone', {
                  type: 'manual',
                  message: '이미 사용 중인 휴대폰 번호입니다.',
                })
              }
            },
          })}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value)

            setValue('phone', formatted, { shouldValidate: false })

            handleInputChange('phone', formatted)
          }}
          maxLength={13}
          placeholder="010-0000-0000"
          className={`h-12 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
        />
        {errors.phone && (
          <p className="ml-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>
    </div>
  )
}
