import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { type SignUpFormValues } from './signUp.schema'
import { TERMS_CONTENT } from '@/constants/terms'
import { Button } from '@/components/ui/button'

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
      label: '서비스 이용약관 동의',
      content: TERMS_CONTENT.service,
      required: true,
    },
    {
      name: 'terms.privacy',
      id: 'privacy',
      label: '개인정보 처리방침 동의',
      content: TERMS_CONTENT.privacy,
      required: true,
    },
    {
      name: 'terms.marketing',
      id: 'marketing',
      label: '이벤트 및 마케팅 정보 수신',
      content: TERMS_CONTENT.marketing,
      required: false,
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
          className="cursor-pointer text-sm font-bold text-slate-900 dark:text-white"
        >
          약관 전체 동의
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
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    className={`size-4 cursor-pointer transition-all ${
                      item.required &&
                      errors.terms?.[item.id as keyof typeof errors.terms]
                        ? 'border-red-500 ring-2 ring-red-500/20 data-[state=checked]:border-red-500'
                        : 'border-slate-300 bg-transparent data-[state=checked]:border-zinc-900 data-[state=checked]:bg-zinc-900'
                    }`}
                  />
                )}
              />
              <label
                htmlFor={item.id}
                className="cursor-pointer text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                {item.label}
                {item.required ? (
                  <span className="ml-1 text-[10px] font-bold text-red-500">
                    *
                  </span>
                ) : (
                  <span className="ml-1 text-[10px] text-slate-400">
                    (선택)
                  </span>
                )}
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
              <DialogContent className="mx-auto w-[calc(100%-40px)] max-w-[400px] overflow-hidden rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-left">{item.label}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 max-h-[450px] overflow-y-auto text-sm leading-relaxed break-keep whitespace-pre-wrap text-slate-900 dark:text-slate-400">
                  {item.content}
                </div>
                <DialogFooter className="mt-1 flex flex-row gap-2">
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 sm:flex-1"
                    >
                      취소
                    </Button>
                  </DialogTrigger>

                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 sm:flex-1"
                      onClick={() => {
                        setValue(item.name, true, { shouldValidate: true })
                      }}
                    >
                      동의
                    </Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>

      {(errors.terms?.service || errors.terms?.privacy) && (
        <p className="animate-in fade-in slide-in-from-top-1 font-lg ml-1 text-xs text-red-500">
          필수 약관에 동의해야 가입이 가능합니다.
        </p>
      )}
    </div>
  )
}
