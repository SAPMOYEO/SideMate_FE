// 결제 완료 후 정보 페이지 결제 일시
export function paymentFormatDateTime(value: string) {
  const date = new Date(value)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 카드결제 관련 형식 //
// 카드 번호 0000-0000-0000-0000
export function formatCardNumber(value: string) {
  const onlyNumber = value.replace(/\D/g, '').slice(0, 16)
  const groups = onlyNumber.match(/.{1,4}/g)

  return groups ? groups.join('-') : onlyNumber
}

// 카드 유효기간 00/00
export function formatExpiry(value: string) {
  const onlyNumber = value.replace(/\D/g, '').slice(0, 4)

  if (onlyNumber.length < 3) return onlyNumber
  return `${onlyNumber.slice(0, 2)}/${onlyNumber.slice(2)}`
}

// cvc 번호 3글자까지
export function formatCvc(value: string) {
  return value.replace(/\D/g, '').slice(0, 3)
}
