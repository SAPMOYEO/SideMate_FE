import { useEffect, useRef } from 'react'

import type { CloudinaryUploadWidgetInstance } from '@/types/cloudinary'

interface UwConfig {
  cloudName: string
  uploadPreset: string
  multiple?: boolean
  maxFiles?: number
  publicId?: string
  asset_folder?: string
  folder?: string
  tags?: string[]
  [key: string]: unknown
}

interface CloudinaryUploadWidgetProps<T extends UwConfig = UwConfig> {
  uwConfig: T
  setPublicId: (publicId: string) => void
}

const CloudinaryUploadWidget = <T extends UwConfig>({
  uwConfig,
  setPublicId,
}: CloudinaryUploadWidgetProps<T>) => {
  const uploadWidgetRef = useRef<CloudinaryUploadWidgetInstance | null>(null)
  const uploadButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create upload widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === 'success') {
              if (typeof result.info !== 'string') {
                setPublicId(result.info.url)
              }
            }
          }
        )

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open()
          }
        }

        const buttonElement = uploadButtonRef.current
        buttonElement.addEventListener('click', handleUploadClick)

        // Cleanup
        return () => {
          buttonElement.removeEventListener('click', handleUploadClick)
        }
      }
    }

    initializeUploadWidget()
  }, [uwConfig, setPublicId])

  return (
    <button
      type="button"
      style={{
        backgroundColor: 'black',
      }}
      ref={uploadButtonRef}
      id="upload_widget"
      className="cloudinary-button z-50 bg-black text-white"
    >
      상품이미지 업로드
    </button>
  )
}

export default CloudinaryUploadWidget
