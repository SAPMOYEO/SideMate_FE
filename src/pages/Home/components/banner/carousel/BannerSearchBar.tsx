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
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-[900] tracking-tight break-keep text-zinc-300 antialiased drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] md:text-5xl lg:text-6xl">
          당신의
          <span className="animate-pulse text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] [animation-duration:4s]">
            아이디어
          </span>
          를 현실로
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-medium text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] md:text-xl">
          전문가들과 함께 사이드 프로젝트를 시작해 보세요.
        </p>
      </div>
      {/* 검색바 */}
      <div className="w-full max-w-2xl px-8 md:px-4">
        <form className="group relative" onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setQuery(e.target.value)}
            className="focus:ring-primary/20 block w-full rounded-2xl border-none bg-white py-6 pr-20 pl-4 text-sm text-slate-900 shadow-2xl transition-all focus:ring-4 md:py-6 md:pr-28 md:text-lg"
            placeholder="어떤 프로젝트를 찾고 계신가요?"
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
