export const createRandomAccountNumber = (): string => {
  const first = Math.floor(100 + Math.random() * 900)
  const second = Math.floor(100000 + Math.random() * 900000)
  const third = Math.floor(100000 + Math.random() * 900000)

  return `${first}-${second}-${third}`
}
