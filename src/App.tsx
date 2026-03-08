import { useEffect } from 'react'
import AppRouter from './routes/AppRouter'
import { useAppDispatch } from '@/hooks'
import {
  loginWithToken,
  setInitialized,
  stopLoading,
  setUser,
} from '@/features/slices/userSlice'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const dispatch = useAppDispatch()

  const decodedToken = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      dispatch(setInitialized())
      dispatch(stopLoading())
      return
    }

    const payload = decodedToken(token as string)

    if (payload?._id === 'admin') {
      dispatch(setUser({ _id: 'admin', role: 'admin', name: 'Admin' }))
      dispatch(setInitialized())
      dispatch(stopLoading())
      return
    }
    dispatch(loginWithToken())
  }, [dispatch])
  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-center" />
    </>
  )
}

export default App
