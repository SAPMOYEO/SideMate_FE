import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  CircleAlert,
  ChevronDown,
  Compass,
  Github,
  Lock,
  ScrollText,
  Settings,
  UserCircle,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Applicant {
  name: string
  time: string
  role: string
  stack: string
  status?: string
  motivation?: string
  profileImage?: string
  gitUrl?: string
  bio?: string
  privacySettings?: {
    isImagePublic: boolean
    isGithubPublic: boolean
    isBioPublic: boolean
  }
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicant: Applicant | null
  onApprove?: () => void
  onReject?: () => void
  isRoleFilled?: boolean
}

const ApplicantDetailModal = ({
  open,
  onOpenChange,
  applicant,
  onApprove,
  onReject,
  isRoleFilled = false,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지원자 상세정보</DialogTitle>
        </DialogHeader>
        {applicant && (
          <div className="space-y-6 border-t pt-3 lg:px-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white bg-zinc-100 shadow-xl lg:h-38 lg:w-38 dark:border-slate-800">
                {applicant.privacySettings?.isImagePublic &&
                applicant.profileImage ? (
                  <AvatarImage
                    src={applicant.profileImage}
                    alt={applicant.name}
                    className="object-cover"
                  />
                ) : null}

                <AvatarFallback className="flex items-center justify-center bg-zinc-100 dark:bg-slate-800">
                  <UserCircle
                    className="h-[90%] w-[90%] text-zinc-300 dark:text-slate-700"
                    strokeWidth={1}
                  />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <p className="text-xl font-bold text-zinc-900 lg:text-3xl dark:text-white">
                  {applicant.name}
                </p>
                {applicant.privacySettings?.isGithubPublic ? (
                  applicant.gitUrl ? (
                    <a
                      href={`https://github.com/${applicant.gitUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-indigo-500"
                    >
                      <Github size={15} /> github.com/{applicant.gitUrl}
                    </a>
                  ) : (
                    <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                      <CircleAlert
                        size={14}
                        className="shrink-0 text-indigo-400"
                      />
                      등록된 GitHub 주소가 없습니다.
                    </p>
                  )
                ) : (
                  <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <Lock size={14} className="shrink-0 text-indigo-400" />
                    GitHub 주소는 비공개 상태입니다.
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {applicant.privacySettings?.isBioPublic ? (
                applicant.bio ? (
                  <div className="flex flex-col gap-1.5 pt-3">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <ScrollText size={14} className="shrink-0" />
                      <span className="text-[11px] font-bold tracking-tight">
                        한 줄 소개
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed font-normal break-keep text-zinc-700 dark:text-zinc-400">
                      {applicant.bio}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <CircleAlert
                      size={14}
                      className="shrink-0 text-indigo-400"
                    />
                    <span>등록된 한 줄 소개가 없습니다.</span>
                  </div>
                )
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-lg py-2 text-sm text-zinc-400 dark:bg-slate-800/50">
                  <Lock size={14} className="shrink-0 text-indigo-400" />
                  <span>한 줄 소개는 비공개 상태입니다.</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3">
              <p className="flex items-center gap-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                <Settings size={14} className="shrink-0" />
                기술 스택
              </p>
              <div className="flex flex-wrap gap-1">
                {applicant.stack.split(', ').map((s) => (
                  <span
                    key={s}
                    className="my-1 mr-1 rounded-lg border border-indigo-400 bg-zinc-50/50 px-2 text-xs font-bold text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/30"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-3 pb-3">
              <p className="flex items-center gap-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                <Compass size={14} className="shrink-0" />
                지원 역할 및 지원 동기
              </p>
              <p className="text-sm font-semibold text-zinc-800">
                {applicant.role}
              </p>
              <p className="text-sm leading-relaxed font-normal break-keep text-zinc-800 dark:text-zinc-400">
                {applicant.motivation || '지원 동기가 없습니다.'}
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-row justify-end gap-2 border-t pt-4">
          {applicant &&
            (() => {
              const isApproved =
                applicant.status === 'APPROVED' ||
                applicant.status === 'ACCEPTED'
              const isRejected = applicant.status === 'REJECTED'
              const isPending = applicant.status === 'PENDING'
              if (isPending && isRoleFilled) {
                return (
                  <p className="text-sm text-zinc-500">
                    모집이 완료된 역할입니다
                  </p>
                )
              }
              if (isApproved) {
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="inline-flex items-center gap-1.5 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        승인됨
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={onReject}
                      >
                        거절하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
              if (isRejected) {
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="inline-flex items-center gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      >
                        거절됨
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer text-emerald-600 focus:text-emerald-600"
                        onClick={onApprove}
                      >
                        승인하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
              return (
                <>
                  <Button
                    variant="outline"
                    className="w-24 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    onClick={onReject}
                  >
                    거절
                  </Button>
                  <Button
                    className="w-24 bg-indigo-600 hover:bg-indigo-700"
                    onClick={onApprove}
                  >
                    승인
                  </Button>
                </>
              )
            })()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicantDetailModal
