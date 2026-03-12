import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/hooks'
import { loginWithGoogle } from '@/features/slices/userSlice'
import { toast } from 'sonner'

interface GoogleLoginButtonProps {
  text?: string
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  text = 'Google 계정으로 로그인',
}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleGoogleSuccess = async (googleData: CredentialResponse) => {
    if (googleData.credential) {
      try {
        const user = await dispatch(
          loginWithGoogle(googleData.credential)
        ).unwrap()

        if (!user.phone || user.phone.trim() === '') {
          navigate('/onboarding')
        } else {
          navigate('/')
        }
      } catch (err) {
        console.error('구글 로그인 에러:', err)
        toast.error('구글 로그인에 실패했습니다. 다시 시도해 주세요.')
      }
    }
  }

  return (
    <div className="relative mb-8 h-11 w-full">
      <Button
        variant="outline"
        type="button"
        className="pointer-events-none flex h-11 w-full items-center justify-center border-slate-200 font-semibold dark:border-slate-700"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="G"
          className="mr-2 size-4"
        />
        {text}
      </Button>

      <div className="absolute inset-0 z-10 cursor-pointer overflow-hidden opacity-0">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('구글 로그인 중 오류가 발생했습니다.')}
          width="400px"
        />
      </div>
    </div>
  )
}
