import type { ReactNode } from 'react'

interface LabelProps {
  children: ReactNode
  required?: boolean
}

/** 폼 필드 레이블 */
export const Label = ({ children, required }: LabelProps) => (
  <label className="mb-1.5 block text-sm font-medium">
    {children}
    {required && <span className="text-destructive ml-0.5">*</span>}
  </label>
)

/** 필드 유효성 에러 메시지 */
export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-destructive mt-1 text-xs">{message}</p> : null
