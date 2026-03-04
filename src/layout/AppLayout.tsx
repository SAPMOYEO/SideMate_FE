import { Header } from '@/components/shared/Header'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <div className="flex">
        <main>{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
