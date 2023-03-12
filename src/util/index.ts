export const generateReservationCode = () => {
  const ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ0123456789'
  return '123456'
    .split('')
    .map((letter: any, index: any) => {
      return ALPHA[Math.floor(Math.random() * 62)]
    })
    .join('')
}
