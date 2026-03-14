import React, { useRef, useState } from 'react'
import { Camera, CircleUser, Edit, Eye, EyeOff, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { Checkbox } from '@/components/ui/checkbox'
import { TERMS_CONTENT } from '@/constants/terms'
import { usePhoneValidation } from '@/hooks/usePhoneValidation'

interface PrivacyCheckboxProps {
  checked: boolean
  onCheckedChange: () => void
}

const PrivacyCheckbox = React.memo(
  ({ checked, onCheckedChange }: PrivacyCheckboxProps) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onCheckedChange()
      }}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-200 duration-500 ease-in-out ${
        checked
          ? 'border border-indigo-100 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
          : 'border border-slate-200 bg-slate-50 text-slate-400 dark:bg-slate-800/50'
      }`}
    >
      {checked ? (
        <>
          <Eye size={14} className="animate-in fade-in zoom-in-75" />
          <span className="text-[10px] font-extrabold tracking-tight">
            공개
          </span>
        </>
      ) : (
        <>
          <EyeOff size={14} className="animate-in fade-in zoom-in-75" />
          <span className="text-[10px] font-extrabold tracking-tight">
            비공개
          </span>
        </>
      )}
    </button>
  )
)
PrivacyCheckbox.displayName = 'PrivacyCheckbox'
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
  const [marketingAgree, setMarketingAgree] = useState(
    user?.marketingAgree || false
  )
  const [privacySettings, setPrivacySettings] = useState(
    user?.privacySettings || {
      isImagePublic: false,
      isEmailPublic: false,
      isGithubPublic: false,
      isBioPublic: false,
    }
  )
  const [gitUrlError, setGitUrlError] = useState('')

  const {
    phone,
    setPhone,
    phoneError,
    isPhoneTouched,
    setIsPhoneTouched,
    handlePhoneChange,
    checkPhoneDuplicate,
    phoneRegex,
  } = usePhoneValidation(user?.phone || '', user?.phone)

  const handleGitUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (/[^a-zA-Z0-9-]/.test(value)) {
      setGitUrlError('영문, 숫자, 하이픈(-)만 입력 가능합니다.')
    } else {
      setGitUrlError('')
    }
    const filteredValue = value.replace(/[^a-zA-Z0-9-]/g, '')
    setGitUrl(filteredValue)
  }

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
      setPhone(user?.phone || '')
      setIsPhoneTouched(false)
    }
  }

  const isChanged =
    previewImage !== (user?.profile?.profileImage || '') ||
    name !== user?.name ||
    phone !== (user?.phone || '') ||
    bio !== (user?.profile?.bio || '') ||
    gitUrl !== (user?.profile?.gitUrl || '') ||
    marketingAgree !== (user?.marketingAgree || false) ||
    JSON.stringify(privacySettings) !== JSON.stringify(user?.privacySettings) ||
    JSON.stringify(techStack) !== JSON.stringify(user?.profile?.techStack || [])

  const isNameEmpty = name.trim().length === 0

  const isSaveDisabled =
    !isChanged ||
    isNameEmpty ||
    phone.trim().length === 0 ||
    techStack.length === 0 ||
    !!phoneError ||
    !phoneRegex.test(phone)

  const handleSave = async () => {
    if (isNameEmpty) {
      toast.error('이름은 필수 입력 항목입니다.')
      return
    }
    if (!isChanged) {
      setOpen(false)
      return
    }
    try {
      const updateData = {
        name: name,
        phone: phone,
        marketingAgree: marketingAgree,
        privacySettings: privacySettings,
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

  const isAllChecked = Object.values(privacySettings).every(
    (val) => val === true
  )

  const handleToggleAll = (checked: boolean) => {
    setPrivacySettings({
      isImagePublic: checked,
      isEmailPublic: checked,
      isGithubPublic: checked,
      isBioPublic: checked,
    })
  }

  const handlePrivacyChange = React.useCallback(
    (key: keyof typeof privacySettings) => {
      setPrivacySettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }))
    },
    []
  )

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

      <DialogContent className="top-[50%] flex max-h-[95vh] flex-col overflow-hidden rounded-2xl border-none bg-white p-0 sm:max-w-[500px] dark:bg-slate-900">
        <div className="border-b border-slate-100 p-6 dark:border-slate-800">
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            프로필 수정
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            SideMate에서 사용될 내 프로필 정보를 관리합니다.
          </DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-3">
          <div className="flex flex-col gap-10">
            <section className="space-y-6">
              <div className="mb-8 flex flex-col items-center gap-3">
                <div className="group relative">
                  <div
                    className={`relative h-28 w-28 overflow-hidden rounded-full border-4 border-slate-50 bg-zinc-100 shadow-lg transition-opacity dark:border-slate-800 dark:bg-slate-800 ${
                      isUploading ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    {previewImage ? (
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${previewImage})` }}
                      />
                    ) : (
                      <div className="flex h-full w-full translate-y-0.5 transform items-center justify-center text-zinc-300">
                        <CircleUser size={80} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div
                    onClick={handleImageClick}
                    className="absolute right-0 bottom-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-4 border-slate-50 border-white bg-zinc-100 text-zinc-400 shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {isUploading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Camera size={18} />
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

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-slate-300">
                    이름 <span className="ml-0.5 text-red-500">*</span>
                  </label>
                </div>
                <Input
                  className={`h-12 px-4 transition-all duration-200 dark:bg-slate-800 ${
                    isNameEmpty
                      ? 'border-red-500 focus-visible:ring-red-500/20'
                      : 'dark:border-slate-700'
                  }`}
                  placeholder="이름을 입력해 주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {isNameEmpty && (
                  <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-xs text-red-500">
                    이름은 필수 입력 항목입니다.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <TechStackSelector
                  selectedStacks={techStack}
                  onAdd={handleAddStack}
                  onRemove={handleRemoveStack}
                  error={
                    techStack.length === 0
                      ? '최소 1개 이상의 기술 스택을 선택해 주세요.'
                      : ''
                  }
                />
              </div>
            </section>

            <div className="space-y-3">
              <h3 className="text-md ml-2 font-extrabold tracking-tight text-slate-900 dark:text-indigo-300">
                부가 정보
              </h3>
              <section className="rounded-2xl border border-indigo-100 bg-slate-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                <div className="mb-3 flex items-center justify-between border-b border-indigo-100/50 pb-4 dark:border-indigo-900/50">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="text-xs font-bold tracking-tight">
                      * 프로젝트 지원 시 리더에게 <br className="sm:hidden" />
                      공개될 항목을 일괄 설정합니다.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAll(!isAllChecked)}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-200 duration-500 ease-in-out ${
                        isAllChecked
                          ? 'border border-indigo-100 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                          : 'border border-slate-200 bg-slate-50 text-slate-400 dark:bg-slate-800/50'
                      }`}
                    >
                      {isAllChecked ? (
                        <>
                          <Eye size={14} />
                          <span className="text-[10px] font-black">
                            전체 공개
                          </span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          <span className="text-[10px] font-black">
                            전체 비공개
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-400">
                      프로필 사진
                    </span>
                    <PrivacyCheckbox
                      checked={privacySettings.isImagePublic}
                      onCheckedChange={() =>
                        handlePrivacyChange('isImagePublic')
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        한 줄 소개 (Bio)
                        <span
                          className={`ml-3 text-xs font-medium ${bio.length >= MAX_BIO_LENGTH ? 'text-red-500' : 'text-slate-400'}`}
                        >
                          {bio.length} / {MAX_BIO_LENGTH}
                        </span>
                      </label>
                      <PrivacyCheckbox
                        checked={privacySettings.isBioPublic}
                        onCheckedChange={() =>
                          handlePrivacyChange('isBioPublic')
                        }
                      />
                    </div>
                    <Textarea
                      className="min-h-[100px] bg-white px-4 py-3 dark:bg-slate-800"
                      placeholder="자신을 간단히 소개해 주세요"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={MAX_BIO_LENGTH}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        GitHub 주소
                      </label>
                      <PrivacyCheckbox
                        checked={privacySettings.isGithubPublic}
                        onCheckedChange={() =>
                          handlePrivacyChange('isGithubPublic')
                        }
                      />
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-sm font-medium text-slate-400 select-none">
                        github.com/
                      </span>
                      <Input
                        className={`h-12 bg-white pl-[100px] transition-all dark:bg-slate-800 ${
                          gitUrlError
                            ? 'border-red-400 focus-visible:ring-red-400/20'
                            : ''
                        }`}
                        placeholder="username"
                        value={gitUrl}
                        onChange={handleGitUrlChange}
                      />
                    </div>
                    {gitUrlError && (
                      <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-600 dark:text-red-400">
                        {gitUrlError}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="mb-3 space-y-3">
              <h4 className="text-md mb-3 ml-2 font-extrabold tracking-tight text-zinc-900 dark:text-indigo-300">
                개인 보안 정보
              </h4>
              <section className="rounded-2xl border border-zinc-100 bg-zinc-200 p-4 dark:bg-slate-800/50">
                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      이메일 주소 (계정 ID)
                    </label>
                    <Input
                      value={user?.email || ''}
                      readOnly
                      className="h-11 cursor-not-allowed border-none bg-zinc-100/80 text-slate-500 focus-visible:ring-0 dark:bg-slate-800/80"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-semibold text-zinc-700">
                      휴대폰 번호 <span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={(e) => checkPhoneDuplicate(e.target.value)}
                      maxLength={13}
                      placeholder="010-0000-0000"
                      className={`h-11 bg-white dark:bg-slate-800 ${
                        isPhoneTouched &&
                        (phoneError ||
                          phone.trim() === '' ||
                          !phoneRegex.test(phone))
                          ? 'border-red-500 focus-visible:ring-red-500/20'
                          : ''
                      }`}
                    />
                    {isPhoneTouched && (
                      <div className="min-h-[1.25rem]">
                        {phone.trim() === '' ? (
                          <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-500">
                            휴대폰 번호는 필수 입력 항목입니다.
                          </p>
                        ) : !phoneRegex.test(phone) ? (
                          <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-500">
                            올바른 휴대폰 번호 형식이 아닙니다.
                          </p>
                        ) : phoneError ? (
                          <p className="animate-in fade-in slide-in-from-top-1 ml-1 text-[10px] font-bold text-red-500">
                            {phoneError}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        id="marketing"
                        checked={marketingAgree}
                        onCheckedChange={(val) => setMarketingAgree(!!val)}
                        className="cursor-pointer border-zinc-400 data-[state=checked]:border-zinc-900 data-[state=checked]:bg-zinc-900"
                      />
                      <label
                        htmlFor="marketing"
                        className="cursor-pointer text-xs font-semibold text-zinc-700"
                      >
                        이벤트 및 마케팅 정보 수신 (선택)
                      </label>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="mr-2 cursor-pointer text-[11px] font-bold text-zinc-500 underline underline-offset-2 transition-colors hover:text-slate-600"
                        >
                          보기
                        </button>
                      </DialogTrigger>
                      <DialogContent className="mx-auto w-[calc(100%-40px)] max-w-[400px] overflow-hidden rounded-lg dark:bg-slate-900">
                        <DialogHeader>
                          <DialogTitle className="text-left text-base">
                            이벤트 및 마케팅 정보 수신 (선택)
                          </DialogTitle>
                        </DialogHeader>

                        <div className="mt-4 max-h-[450px] overflow-y-auto text-sm leading-relaxed break-keep whitespace-pre-wrap text-slate-900 dark:text-slate-400">
                          {TERMS_CONTENT.marketing}
                        </div>

                        <DialogFooter className="mt-4 flex flex-row gap-2">
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            >
                              취소
                            </Button>
                          </DialogTrigger>

                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800"
                              onClick={() => setMarketingAgree(true)}
                            >
                              동의
                            </Button>
                          </DialogTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11 px-6 font-semibold"
            >
              취소
            </Button>
          </DialogTrigger>
          <Button
            className="hover:bg-primary/90 h-11 bg-zinc-900 px-6 font-semibold shadow-sm"
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
