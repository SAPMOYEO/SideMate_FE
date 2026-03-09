import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api/api.instance'
import BannerItem from './BannerItem'

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
  const { data } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.banners.map((banner) => (
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
