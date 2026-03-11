import { useState, useCallback } from 'react'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { validateDuplicate } from '@/utils/userValidation'

const phoneRegex = /^010-\d{3,4}-\d{4}$/

export const usePhoneValidation = (
  initialValue: string = '',
  originalValue?: string
) => {
  const [phone, setPhone] = useState(initialValue)
  const [phoneError, setPhoneError] = useState('')
  const [isPhoneTouched, setIsPhoneTouched] = useState(false)

  const handlePhoneChange = useCallback(
    (value: string) => {
      const formatted = formatPhoneNumber(value)
      setPhone(formatted)
      if (phoneError) setPhoneError('')
    },
    [phoneError]
  )

  const checkPhoneDuplicate = useCallback(
    async (value: string) => {
      setIsPhoneTouched(true)

      if (value.trim().length === 0) {
        setPhoneError('휴대폰 번호는 필수 입력 항목입니다.')
        return false
      }

      if (!phoneRegex.test(value)) {
        setPhoneError('올바른 휴대폰 번호 형식이 아닙니다.')
        return false
      }

      const { isDuplicate } = await validateDuplicate(
        'phone',
        value,
        originalValue
      )
      if (isDuplicate) {
        setPhoneError('이미 사용 중인 휴대폰 번호입니다.')
        return false
      }

      setPhoneError('')
      return true
    },
    [originalValue]
  )

  return {
    phone,
    setPhone,
    phoneError,
    isPhoneTouched,
    setIsPhoneTouched,
    handlePhoneChange,
    checkPhoneDuplicate,
    phoneRegex,
  }
}
