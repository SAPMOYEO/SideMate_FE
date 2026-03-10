import { Outlet } from 'react-router-dom'
import { Header } from '@/components/shared/Header'
import { OnboardingModal } from '@/components/shared/OnboardingModal'

const AppLayout = () => {
  return (
    <div>
      <Header />
      <div className="">
        <main className="animate-in fade-in slide-in-from-bottom-4 flex-1 duration-500 ease-out">
          <Outlet />
        </main>
      </div>
      <OnboardingModal />
    </div>
  )
}

export default AppLayout
