export const formatPhoneNumber = (value: string) => {
  const nums = value.replace(/[^\d]/g, '').slice(0, 11)
  if (nums.length <= 3) return nums
  if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`
  if (nums.length <= 10) {
    return `${nums.slice(0, 3)}-${nums.slice(3, 6)}-${nums.slice(6)}`
  }
  return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`
}
