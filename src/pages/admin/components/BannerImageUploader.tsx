import { useRef, useState, type ChangeEvent } from 'react'
import { ImageIcon, UploadCloud, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadToCloudinary } from '@/utils/cloudinary'

interface Props {
  /** 현재 이미지 URL (RHF field.value) */
  value: string
  /** 업로드 완료 후 URL 전달 (RHF field.onChange) */
  onChange: (url: string) => void
}

/**
 * 이미지 파일 선택 → Cloudinary 업로드 → URL 반환
 * - 업로드 중 로딩 스피너 표시
 * - 업로드 완료 시 미리보기 렌더링
 */
const BannerImageUploader = ({ value, onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const showPreview = value.trim().length > 0 && !loadError

  /** 파일 선택 시 Cloudinary 업로드 */
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setLoadError(false)

    try {
      const url = await uploadToCloudinary(file)
      onChange(url)
    } catch {
      setLoadError(true)
    } finally {
      setUploading(false)
      // 같은 파일 재선택 가능하도록 input 초기화
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 숨겨진 파일 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 업로드 버튼 */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 size={15} className="mr-2 animate-spin" />
            업로드 중...
          </>
        ) : (
          <>
            <UploadCloud size={15} className="mr-2" />
            이미지 선택
          </>
        )}
      </Button>

      {/* 미리보기 */}
      <div className="bg-muted flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border">
        {showPreview ? (
          <img
            src={value}
            alt="배너 미리보기"
            className="h-full w-full object-contain"
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <ImageIcon size={28} className="text-muted-foreground opacity-40" />
            <span className="text-muted-foreground text-xs">
              {loadError ? '이미지를 불러올 수 없습니다' : '미리보기'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BannerImageUploader
