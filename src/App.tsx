import { useEffect } from 'react'
import AppRouter from './routes/AppRouter'
import { useAppDispatch } from '@/hooks'
import { loginWithToken } from '@/features/slices/userSlice'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loginWithToken())
    }
  }, [dispatch])
  return <AppRouter />
}

export default App
