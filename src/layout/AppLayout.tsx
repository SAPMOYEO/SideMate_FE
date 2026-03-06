import { Outlet } from 'react-router-dom'
import { Header } from '@/components/shared/Header'

const AppLayout = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
