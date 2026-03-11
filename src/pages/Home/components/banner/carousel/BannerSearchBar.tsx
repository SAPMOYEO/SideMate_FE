import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const BannerSearchBar = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState<string>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query?.trim()) return
    navigate(`/projects?q=${encodeURIComponent(query.trim())}`)
  }
  return (
    <div className="absolute inset-0 z-10 flex h-[40vh] w-full flex-col items-center justify-center bg-black/40 px-4 text-center md:h-[50vh] lg:h-[60vh]">
      {/* 로고 — 모바일에서 축소 */}
      <div className="mb-3 flex items-center gap-2 md:mb-6 md:gap-3">
        <div className="shadow-primary/20 flex h-8 w-8 items-center justify-center rounded-xl bg-white p-1 shadow-lg md:h-12 md:w-12">
          <img src={'/favicon.svg'} alt="logo" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-5xl">
          SideMate
        </h1>
      </div>
      {/* 설명 — 모바일에서 숨김 */}
      <p className="mb-6 hidden max-w-2xl text-lg text-slate-200 md:mb-10 md:block md:text-xl">
        당신의 위대한 아이디어를 현실로. 전문가들과 함께 사이드 프로젝트를
        시작해보세요.
      </p>
      {/* 검색바 */}
      <div className="w-full max-w-2xl px-8 md:px-4">
        <form className="group relative" onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setQuery(e.target.value)}
            className="focus:ring-primary/20 block w-full rounded-2xl border-none bg-white py-6 pr-20 pl-4 text-sm text-slate-900 shadow-2xl transition-all focus:ring-4 md:py-6 md:pr-28 md:text-lg"
            placeholder="프로젝트, 기술 또는 멘토를 검색해보세요..."
            type="text"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-3">
            <Button className="bg-primary hover:bg-primary/90 shadow-primary/30 rounded-xl px-3 py-1.5 text-sm font-bold text-white shadow-lg transition-colors md:px-6 md:py-2">
              검색
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BannerSearchBar
