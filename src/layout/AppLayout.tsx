import { Outlet } from 'react-router-dom'
import { Header } from '@/components/shared/Header'

const AppLayout = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
