// src/types/cloudinary.d.ts

// 1. 타입들 정의하고 export
export interface CloudinaryUploadWidgetInfo {
  public_id: string
  secure_url: string
  url: string
  original_filename: string
  format: string
  resource_type: string
  created_at: string
  bytes: number
  width?: number
  height?: number
}

export interface CloudinaryUploadWidgetResult {
  event:
    | 'success'
    | 'queues-end'
    | 'close'
    | 'display-changed'
    | 'source-changed'
  info: CloudinaryUploadWidgetInfo | string
}

export interface CloudinaryUploadWidgetError {
  status: string
  statusText: string
}

export interface CloudinaryUploadWidgetInstance {
  open: () => void
  close: () => void
  destroy: () => void
}

export interface CloudinaryUploadWidgetOptions {
  cloudName: string
  uploadPreset: string
  multiple?: boolean
  maxFiles?: number
  folder?: string
  tags?: string[]
  [key: string]: unknown
}

export type CloudinaryUploadWidgetCallback = (
  error: CloudinaryUploadWidgetError | null,
  result: CloudinaryUploadWidgetResult
) => void

export interface CloudinaryInstance {
  createUploadWidget(
    options: CloudinaryUploadWidgetOptions,
    callback: CloudinaryUploadWidgetCallback
  ): CloudinaryUploadWidget
}

// 2. Window 전역 타입 확장
declare global {
  interface Window {
    cloudinary?: CloudinaryInstance
  }
}
