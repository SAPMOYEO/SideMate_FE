import { Outlet } from 'react-router-dom'
import { Header } from '@/components/shared/Header'

const AppLayout = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <main className="animate-in fade-in slide-in-from-bottom-4 flex-1 duration-500 ease-out">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
