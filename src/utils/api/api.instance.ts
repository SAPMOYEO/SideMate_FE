import axios from 'axios'

// ── 인스턴스 생성 ─────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── 요청 인터셉터 ─────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 토큰 꺼내서 Authorization 헤더에 자동 주입
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── 응답 인터셉터 ─────────────────────────────────────────────────
api.interceptors.response.use(
  // 정상 응답: data만 바로 반환
  (response) => response,

  // 에러 응답 처리
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // 인증 만료 → 토큰 제거 후 로그인 페이지로
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    if (status === 403) {
      // 권한 없음
      window.location.href = '/403'
    }

    return Promise.reject(error)
  }
)

export default api
