import React, { useRef, useState } from 'react'
import { Camera, Edit, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { uploadToCloudinary } from '@/utils/cloudinary'
import { updateUserProfile } from '@/features/slices/userSlice'
import api from '@/utils/api/api.instance'
import { toast } from 'sonner'
import axios from 'axios'
import { TechStackSelector } from '@/components/shared/TechStackSelector'

const ProfileEditModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.profile?.bio || '')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const MAX_BIO_LENGTH = 80
  const [techStack, setTechStack] = useState<string[]>(
    user?.profile?.techStack || []
  )
  const [gitUrl, setGitUrl] = useState(user?.profile?.gitUrl || '')
  const [previewImage, setPreviewImage] = useState(
    user?.profile?.profileImage || ''
  )

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const imageUrl = await uploadToCloudinary(file)
      setPreviewImage(imageUrl)
    } catch (error) {
      console.error(error)
      toast.error('이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddStack = (stack: string) => {
    if (techStack.length >= 8) return
    if (!techStack.includes(stack)) {
      setTechStack((prev) => [...prev, stack])
    }
  }

  const handleRemoveStack = (techToDelete: string) => {
    setTechStack((prev) => prev.filter((tech) => tech !== techToDelete))
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)

    if (!newOpen) {
      setName(user?.name || '')
      setBio(user?.profile?.bio || '')
      setTechStack(user?.profile?.techStack || [])
      setGitUrl(user?.profile?.gitUrl || '')
      setPreviewImage(user?.profile?.profileImage || '')
    }
  }

  const isChanged =
    previewImage !== (user?.profile?.profileImage || '') ||
    name !== user?.name ||
    bio !== (user?.profile?.bio || '') ||
    gitUrl !== (user?.profile?.gitUrl || '') ||
    JSON.stringify(techStack) !== JSON.stringify(user?.profile?.techStack || [])

  const isSaveDisabled = !isChanged || techStack.length === 0

  const handleSave = async () => {
    if (!isChanged) {
      setOpen(false)
      return
    }
    try {
      const updateData = {
        name: name,
        profile: {
          ...user?.profile,
          profileImage: previewImage,
          bio: bio,
          techStack: techStack,
          gitUrl: gitUrl,
        },
      }
      await api.put('/user/me', updateData)
      dispatch(updateUserProfile(updateData))

      toast.success('프로필 정보가 저장되었습니다.')
      setOpen(false)
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || '저장에 실패했습니다.'
        toast.error(message)
      } else {
        toast.error('알 수 없는 에러가 발생했습니다.')
      }
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          onClick={() => toast.dismiss()}
          className="hover:text-primary flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
        >
          <Edit size={16} />
          프로필 수정
        </button>
      </DialogTrigger>

      <DialogContent className="top-[50%] flex max-h-[99vh] flex-col overflow-hidden rounded-2xl border-none bg-white p-0 sm:max-w-[500px] dark:bg-slate-900">
        <div className="ml-3 border-b border-slate-100 p-3 dark:border-slate-800">
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            프로필 수정
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            SideMate에서 사용될 내 프로필 정보를 관리합니다.
          </DialogDescription>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-8 py-6">
          <div className="mb-10 flex flex-col items-center gap-3">
            <div
              className="group relative cursor-pointer"
              onClick={handleImageClick}
            >
              <div
                className={`h-28 w-28 rounded-full border-4 border-slate-50 bg-cover bg-center shadow-md transition-opacity dark:border-slate-800 ${isUploading ? 'opacity-50' : 'opacity-100'}`}
                style={{
                  backgroundImage: `url(${previewImage || 'https://github.com/shadcn.png'})`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {isUploading ? (
                  <Loader2 className="animate-spin text-white" size={32} />
                ) : (
                  <Camera className="text-white" size={32} />
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                이름
              </label>
              <Input
                className="focus:ring-primary focus:border-primary h-12 px-4 dark:border-slate-700 dark:bg-slate-800"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                한 줄 소개 (Bio)
                <span
                  className={`ml-3 text-xs font-medium ${bio.length >= MAX_BIO_LENGTH ? 'text-red-500' : 'text-slate-400'}`}
                >
                  {bio.length} / {MAX_BIO_LENGTH}
                </span>
              </label>
              <Textarea
                className="focus:ring-primary focus:border-primary h-12 px-4 dark:border-slate-700 dark:bg-slate-800"
                placeholder="자신을 간단히 소개해주세요"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={MAX_BIO_LENGTH}
              />
            </div>
            <TechStackSelector
              selectedStacks={techStack}
              onAdd={handleAddStack}
              onRemove={handleRemoveStack}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                GitHub 주소
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-medium text-slate-500 select-none dark:text-slate-400">
                  github.com/
                </span>
                <Input
                  className="focus:ring-primary focus:border-primary h-12 pr-4 pl-[100px] dark:border-slate-700 dark:bg-slate-800"
                  placeholder="username"
                  value={gitUrl}
                  onChange={(e) => setGitUrl(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mr-3 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11 px-6 font-semibold dark:border-slate-700 dark:bg-slate-800"
            >
              취소
            </Button>
          </DialogTrigger>
          <Button
            className="bg-primary hover:bg-primary/90 h-11 px-6 font-semibold shadow-sm"
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            변경사항 저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileEditModal
