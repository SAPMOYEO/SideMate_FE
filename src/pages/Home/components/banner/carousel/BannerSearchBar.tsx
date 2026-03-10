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
    <div className="absolute inset-0 z-10 flex h-[60vh] w-full flex-col items-center justify-center bg-black/40 px-4 text-center">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary shadow-primary/20 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"></div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          SideMate
        </h1>
      </div>
      <p className="mb-10 max-w-2xl text-lg text-slate-200 md:text-xl">
        당신의 위대한 아이디어를 현실로. 전문가들과 함께 사이드 프로젝트를
        시작해보세요.
      </p>
      <div className="w-full max-w-2xl px-4">
        <form className="group relative" onSubmit={handleSubmit}>
          <Input
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            className="focus:ring-primary/20 block w-full rounded-2xl border-none bg-white py-8 pr-4 pl-4 text-lg text-slate-900 shadow-2xl transition-all focus:ring-4"
            placeholder="프로젝트, 기술 또는 멘토를 검색해보세요..."
            type="text"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            <button className="bg-primary hover:bg-primary/90 shadow-primary/30 rounded-xl px-6 py-2 font-bold text-white shadow-lg transition-colors">
              검색하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BannerSearchBar
