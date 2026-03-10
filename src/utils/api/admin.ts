import api from './api.instance'

export interface AdminLoginPayload {
  name: string
  password: string
}

export interface AdminLoginResponse {
  status: string
  message: string
  token: string
}

export const adminLoginApi = async (
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> => {
  const { data } = await api.post<AdminLoginResponse>('/admin/login', payload)
  return data
}
