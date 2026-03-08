import { Button } from '@/components/ui/button'
import { Home, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark flex h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-zinc-100">
        <TriangleAlert className="text-primary size-10" />
      </div>

      <div className="flex flex-col items-center px-4 text-center">
        <h1 className="mb-2 text-[clamp(1.875rem,5vw,2.5rem)] font-black tracking-tight break-keep text-slate-900 dark:text-white">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="mt-5 mb-8 max-w-[420px] text-[clamp(0.875rem,2vw,1.125rem)] leading-relaxed font-medium break-keep text-slate-500 dark:text-slate-400">
          요청하신 페이지는 존재하지 않거나, 사용할 수 없습니다. <br />
          입력하신 주소가 정확한 지 다시 한 번 확인 해 주세요.
        </p>

        <Link to="/">
          <Button className="shadow-primary/20 font-semi-bold h-10 gap-2 px-8 shadow-lg">
            <Home size={18} />
            홈으로
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
