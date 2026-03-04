import { Button } from '@/components/ui/button'
import { Home, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark flex h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
        <TriangleAlert className="size-10 text-red-500" />
      </div>

      <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="mt-5 mb-8 max-w-sm text-sm font-medium text-slate-500 sm:text-lg dark:text-slate-400">
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
  )
}

export default NotFoundPage
