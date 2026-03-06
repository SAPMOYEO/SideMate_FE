import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { type SignUpFormValues } from './signUp.schema'

export const TermsSection: React.FC = () => {
  const {
    watch,
    setValue,
    formState: { errors },
    control,
  } = useFormContext<SignUpFormValues>()

  const TERMS_CONFIG = [
    {
      name: 'terms.service',
      id: 'service',
      label: '서비스 이용약관 동의 (필수)',
    },
    {
      name: 'terms.privacy',
      id: 'privacy',
      label: '개인정보 처리방침 동의 (필수)',
    },
    {
      name: 'terms.marketing',
      id: 'marketing',
      label: '이벤트 및 마케팅 정보 수신 (선택)',
    },
  ] as const

  const service = watch('terms.service')
  const privacy = watch('terms.privacy')
  const marketing = watch('terms.marketing')
  const isAllChecked = service && privacy && marketing

  return (
    <div className="space-y-4 border-t border-slate-100 py-4 dark:border-slate-800">
      <div className="flex items-center gap-2 px-1">
        <Checkbox
          id="all-terms"
          checked={isAllChecked}
          onCheckedChange={(checked) => {
            const val = !!checked
            setValue('terms.service', val, { shouldValidate: true })
            setValue('terms.privacy', val, { shouldValidate: true })
            setValue('terms.marketing', val)
          }}
          className="size-5 cursor-pointer border-slate-300 data-[state=checked]:border-zinc-900 data-[state=checked]:bg-zinc-900"
        />
        <label
          htmlFor="all-terms"
          className="text-sm font-bold text-slate-900 dark:text-white"
        >
          약관 전체 동의하기
        </label>
      </div>

      <div className="ml-1 space-y-3 border-l-2 border-slate-100 pl-7 dark:border-slate-800">
        {TERMS_CONFIG.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name={item.name}
                render={({ field }) => (
                  <Checkbox
                    id={item.id}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={`size-4 cursor-pointer transition-all ${
                      errors.terms?.[item.id as keyof typeof errors.terms]
                        ? 'border-red-500 ring-2 ring-red-500/20 data-[state=checked]:border-red-500'
                        : 'border-slate-300 data-[state=checked]:border-zinc-900 data-[state=checked]:bg-zinc-900'
                    }`}
                  />
                )}
              />
              <label
                htmlFor={item.id}
                className="cursor-pointer text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                {item.label}
              </label>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer text-[11px] font-bold text-slate-400 underline underline-offset-2 hover:text-slate-600"
                >
                  보기
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[400px] rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-left">{item.label}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 max-h-[300px] overflow-y-auto text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>

      {(errors.terms?.service || errors.terms?.privacy) && (
        <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-xs font-bold text-red-500">
          필수 약관에 동의해야 가입이 가능합니다.
        </p>
      )}
    </div>
  )
}
