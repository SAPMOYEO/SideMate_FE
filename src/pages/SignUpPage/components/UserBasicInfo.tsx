import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { type SignUpFormValues } from './signUp.schema'
import api from '@/utils/api/api.instance'

export const UserBasicInfo: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    setError,
    clearErrors,
  } = useFormContext<SignUpFormValues>()

  const formatPhoneNumber = (value: string) => {
    const nums = value.replace(/[^\d]/g, '').slice(0, 11)
    if (nums.length <= 3) return nums
    if (nums.length <= 6) return `${nums.slice(0, 3)}-${nums.slice(3)}`
    if (nums.length <= 10) {
      return `${nums.slice(0, 3)}-${nums.slice(3, 6)}-${nums.slice(6)}`
    }
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`
  }

  const { onBlur } = register('phone')

  return (
    <div className="space-y-4">
      <div className="grid gap-1.5">
        <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          이메일 주소
        </label>
        <Input
          {...register('email', {
            onBlur: async (e) => {
              const email = e.target.value.trim()

              const isValid = await trigger('email')
              if (!isValid || !email) return

              try {
                const response = await api.get(
                  `/user/check-email?email=${email}`
                )

                if (response.data.isDuplicate) {
                  setError('email', {
                    type: 'manual',
                    message: '이미 사용 중인 이메일입니다.',
                  })
                } else {
                  clearErrors('email')
                }
              } catch (err) {
                console.error('중복 체크 에러:', err)
              }
            },
          })}
          type="email"
          placeholder="example@email.com"
          className={`h-12 ${errors.email ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
        />
        {errors.email && (
          <p className="ml-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="grid gap-1.5">
        <label className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">
          이름
        </label>
        <Input
          {...register('name', {
            onBlur: (e) => {
              e.target.value = e.target.value.trim()
            },
          })}
          placeholder="홍길동"
          className={`h-12 ${errors.name ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
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
            setValue('phone', formatted)
          }}
          onBlur={(e) => {
            onBlur(e)
            trigger('phone')
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
