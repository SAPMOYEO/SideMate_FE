import api from '@/utils/api/api.instance'

export const validateDuplicate = async (
  type: 'email' | 'phone',
  value: string,
  currentValue?: string
): Promise<{ isDuplicate: boolean; error?: boolean }> => {
  if (!value || value === currentValue) {
    return { isDuplicate: false }
  }

  try {
    const response = await api.get(`/user/check-${type}?${type}=${value}`)

    return {
      isDuplicate: response.data.isDuplicate,
    }
  } catch (error) {
    console.error(`${type} 중복 체크 중 서버 에러 발생:`, error)
    return { isDuplicate: false, error: true }
  }
}
