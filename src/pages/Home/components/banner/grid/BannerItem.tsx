interface Props {
  imageUrl: string
  title?: string
  description?: string
  className?: string
}

const BannerItem = ({
  imageUrl,
  title = '인기 프로젝트',
  description = '지금 가장 핫한 협업 기회',
  className = '',
}: Props) => {
  return (
    <div
      className={`relative cursor-pointer overflow-hidden rounded-2xl transition-transform hover:scale-[1.02] ${className}`}
    >
      {/* 배경 이미지 */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 다크 오버레이 */}
      <div className="absolute inset-0 bg-black/40" />
      {/* 텍스트 */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <h2 className="mb-1 text-xl font-bold text-white">{title}</h2>
        <p className="text-sm text-white/75">{description}</p>
      </div>
    </div>
  )
}

export default BannerItem
