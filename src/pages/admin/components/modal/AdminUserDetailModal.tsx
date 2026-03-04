import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShieldCheck, User, Mail, Calendar, Hash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ── Types ────────────────────────────────────────────────────────
interface User {
  _id: string
  name: string
  email: string
  joinedAt: Date
  role: 'USER' | 'ADMIN'
  isActive: boolean
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
}

// ── Schema ───────────────────────────────────────────────────────
const schema = z.object({
  role: z.enum(['USER', 'ADMIN']),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

// ── Helpers ──────────────────────────────────────────────────────
const DUMMY_USER: User = {
  _id: '507f1f77bcf86cd799439001',
  name: '김민준',
  email: 'minjun@example.com',
  joinedAt: new Date('2024-01-15'),
  role: 'USER',
  isActive: true,
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

// 읽기 전용 정보 한 줄
const InfoRow = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) => (
  <div className="flex items-center gap-3 py-3">
    <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
      <Icon size={15} className="text-muted-foreground" />
    </div>
    <span className="text-muted-foreground w-20 shrink-0 text-sm">{label}</span>
    <div className="flex-1 text-sm font-medium">{children}</div>
  </div>
)

// ── Component ────────────────────────────────────────────────────
const AdminUserDetailModal = ({
  open,
  onOpenChange,
  user = DUMMY_USER,
}: Props) => {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: user.role, isActive: user.isActive },
  })

  // user/open 변경 시 폼 초기화
  useEffect(() => {
    reset({ role: user.role, isActive: user.isActive })
  }, [user, open, reset])

  const isActive = watch('isActive')

  const onSubmit = (data: FormValues) => {
    console.log('submit', data) // TODO: API 연동
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className="flex w-[45vw] max-w-[45vw] flex-col gap-0 p-0"
        showCloseButton={false}
      >
        <DialogHeader className="border-b px-6 py-5">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
              {user.role === 'ADMIN' ? '관리자' : '일반 회원'}
            </Badge>
            {user.isActive ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                활성
              </Badge>
            ) : (
              <Badge variant="destructive">정지</Badge>
            )}
          </div>
          <DialogTitle className="text-xl">{user.name}</DialogTitle>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5">
            {/* 계정 정보 (읽기 전용) */}
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              계정 정보
            </p>
            <div className="divide-y rounded-2xl border px-2">
              <InfoRow icon={Hash} label="사용자 ID">
                <span className="text-muted-foreground font-mono text-xs">
                  {user._id}
                </span>
              </InfoRow>
              <InfoRow icon={User} label="이름">
                {user.name}
              </InfoRow>
              <InfoRow icon={Mail} label="이메일">
                {user.email}
              </InfoRow>
              <InfoRow icon={Calendar} label="가입일">
                {formatDate(user.joinedAt)}
              </InfoRow>
            </div>

            {/* 계정 설정 (편집 가능) */}
            <p className="text-muted-foreground mt-5 mb-3 text-xs font-semibold tracking-wider uppercase">
              계정 설정
            </p>
            <div className="divide-y rounded-2xl border px-2">
              {/* 역할 */}
              <div className="flex items-center gap-3 py-3">
                <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <ShieldCheck size={15} className="text-muted-foreground" />
                </div>
                <span className="text-muted-foreground w-20 shrink-0 text-sm">
                  역할
                </span>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-8 w-32 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">일반 회원</SelectItem>
                        <SelectItem value="ADMIN">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* 계정 상태 */}
              <div className="flex items-center gap-3 py-3">
                <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <User size={15} className="text-muted-foreground" />
                </div>
                <span className="text-muted-foreground w-20 shrink-0 text-sm">
                  계정 상태
                </span>
                <div className="flex items-center gap-2.5">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-destructive'}`}
                  >
                    {isActive ? '활성' : '정지'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" size="sm">
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AdminUserDetailModal
