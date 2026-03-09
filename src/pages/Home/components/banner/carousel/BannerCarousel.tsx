import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'

import AutoPlay from 'embla-carousel-autoplay'
import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api/api.instance'
import { useState, useEffect, useId } from 'react'

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

const fetchHomeData = async (): Promise<BannerResponse> => {
  try {
    const response = await api.get('/banner')
    return response.data
  } catch (error) {
    console.error('홈 데이터 가져오기 실패:', error)
    throw error
  }
}

export const BannerCarousel = () => {
  const { data } = useQuery({
    queryKey: ['homeData'],
    queryFn: () => fetchHomeData(),
  })

  const uid = useId()
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  useEffect(() => {
    if (!carouselApi) return

    const onInit = () => setScrollSnaps(carouselApi.scrollSnapList())
    const onSelect = () => setSelectedIndex(carouselApi.selectedScrollSnap())

    onInit()
    onSelect()

    carouselApi.on('select', onSelect)
    carouselApi.on('reInit', onInit) // 데이터 로드 후 슬라이드 추가되면 재계산
    carouselApi.on('reInit', onSelect)

    return () => {
      carouselApi.off('select', onSelect)
      carouselApi.off('reInit', onInit)
      carouselApi.off('reInit', onSelect)
    }
  }, [carouselApi])
  return (
    <Carousel
      setApi={setCarouselApi}
      plugins={[AutoPlay({ delay: 3000, stopOnInteraction: false })]}
      className="relative h-[60vh]"
    >
      <CarouselContent>
        {data?.banners.map((banner) => (
          <CarouselItem key={banner._id} className="h-[60vh]">
            <img
              src={banner.imageUrl}
              alt={banner.imageUrl}
              className="h-full w-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Dot Indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {scrollSnaps.map((_, index) => (
          <button
            key={`${uid}-${index}`}
            onClick={() => carouselApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </Carousel>
  )
}
