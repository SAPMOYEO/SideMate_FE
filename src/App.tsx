import { useEffect } from 'react'
import AppRouter from './routes/AppRouter'
import { useAppDispatch } from '@/hooks'
import { loginWithToken, stopLoading } from '@/features/slices/userSlice'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loginWithToken())
    } else {
      dispatch(stopLoading())
    }
  }, [dispatch])
  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-center" />
    </>
  )
}

export default App
