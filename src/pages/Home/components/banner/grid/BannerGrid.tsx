import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api/api.instance'
import BannerItem from './BannerItem'
import { ImageOff } from 'lucide-react'

interface BannerTypes {
  _id: string
  imageUrl: string
  isActive: boolean
  updatedAt: string
  createdAt: string
}

interface BannerResponse {
  message: string
  banners: BannerTypes[]
}

const fetchBanners = async (): Promise<BannerResponse> => {
  const response = await api.get('/banner')
  return response.data
}

const BannerGrid = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  })

  // 로딩 중
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[220px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    )
  }

  // 에러 또는 배너 없음
  if (isError || !data?.banners.length) {
    return (
      <div className="flex h-[220px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 text-slate-400 dark:border-slate-700">
        <ImageOff size={32} strokeWidth={1.5} />
        <p className="text-sm">등록된 배너가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.banners.map((banner) => (
        <BannerItem
          key={banner._id}
          imageUrl={banner.imageUrl}
          className="h-[220px]"
        />
      ))}
    </div>
  )
}

export default BannerGrid
