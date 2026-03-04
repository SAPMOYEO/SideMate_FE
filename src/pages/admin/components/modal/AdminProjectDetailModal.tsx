import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDateTime } from '@/utils/formatter'
import {
  Calendar,
  Github,
  MessageSquare,
  Users,
  Clock,
  Layers,
  BookOpen,
  Target,
} from 'lucide-react'

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────
type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ALL'
type Role = 'FULLSTACK' | 'BACKEND' | 'FRONTEND' | 'DESIGNER' | 'ETC'
type Status = 'RECRUITING' | 'CLOSED' | 'COMPLETED'
type CommunicationMethod = 'DISCORD' | 'OPEN_CHAT' | 'OFFLINE'

interface RecruitRole {
  role: Role
  count: number
}

interface Project {
  _id: string
  title: string
  category: string
  description: string
  goal?: string
  expectedPeriodStart?: string
  expectedPeriodEnd?: string
  requiredTechStack: string[]
  mandatoryTechStack: string[]
  level: Level
  recruitRoles: RecruitRole[]
  totalRecruitCount: number
  deadline?: Date
  communicationMethod: CommunicationMethod
  status: Status
  author: string
  githubUrl?: string
  hiddenYn: boolean
  createdAt: Date
  updatedAt: Date
}

interface AdminProjectDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
}

// ────────────────────────────────────────────────────────────────
// Dummy data
// ────────────────────────────────────────────────────────────────
const DUMMY_PROJECT: Project = {
  _id: '507f1f77bcf86cd799439011',
  title: 'AI 기반 인재 매칭 시스템 구축',
  category: '인공지능 / AI',
  description:
    '채용 시장의 비효율을 해소하기 위해 AI로 지원자와 포지션을 자동 매칭하는 플랫폼을 개발합니다. NLP 기반 이력서 분석과 직무 요건 벡터화를 활용하여 정밀한 매칭 스코어를 제공합니다.',
  goal: '6개월 내 MVP 완성 후 실제 스타트업 채용 파일럿 적용. 매칭 정확도 80% 이상 달성.',
  expectedPeriodStart: '2024-01-01',
  expectedPeriodEnd: '2024-06-30',
  requiredTechStack: ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL'],
  mandatoryTechStack: ['Docker', 'AWS', 'Redis'],
  level: 'INTERMEDIATE',
  recruitRoles: [
    { role: 'BACKEND', count: 2 },
    { role: 'FRONTEND', count: 1 },
    { role: 'DESIGNER', count: 1 },
  ],
  totalRecruitCount: 4,
  deadline: new Date('2024-01-15'),
  communicationMethod: 'DISCORD',
  status: 'RECRUITING',
  author: '507f1f77bcf86cd799439099',
  githubUrl: 'https://github.com/example/ai-matching',
  hiddenYn: false,
  createdAt: new Date('2023-11-20T09:32:00'),
  updatedAt: new Date('2023-11-24T14:10:00'),
}

// ────────────────────────────────────────────────────────────────
// Label maps
// ────────────────────────────────────────────────────────────────
const LEVEL_MAP: Record<Level, string> = {
  BEGINNER: '입문자',
  INTERMEDIATE: '중급자',
  ALL: '누구나',
}

const STATUS_MAP: Record<Status, { label: string; className: string }> = {
  RECRUITING: {
    label: '모집 중',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  CLOSED: {
    label: '모집 마감',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
  },
  COMPLETED: {
    label: '완료',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
}

const ROLE_MAP: Record<Role, string> = {
  FULLSTACK: '풀스택',
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DESIGNER: '디자이너',
  ETC: '기타',
}

const COMM_MAP: Record<CommunicationMethod, string> = {
  DISCORD: 'Discord',
  OPEN_CHAT: '오픈채팅',
  OFFLINE: '오프라인',
}

// ────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────
const SectionTitle = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType
  title: string
}) => (
  <div className="mb-3 flex items-center gap-2">
    <Icon size={15} className="text-muted-foreground" />
    <span className="text-sm font-semibold">{title}</span>
  </div>
)

const InfoRow = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="flex items-start gap-2">
    <span className="text-muted-foreground w-24 shrink-0 pt-0.5 text-xs">
      {label}
    </span>
    <div className="flex-1 text-sm">{children}</div>
  </div>
)

// ────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────
const AdminProjectDetailModal = ({
  open,
  onOpenChange,
  project = DUMMY_PROJECT,
}: AdminProjectDetailModalProps) => {
  const status = STATUS_MAP[project.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent
        className="flex max-h-[88vh] w-[80vw] max-w-[80vw] flex-col gap-0 p-0"
        showCloseButton={false}
      >
        {/* ── Header ── */}
        <DialogHeader className="border-b px-6 py-5">
          <div className="mb-2 flex items-center gap-2">
            <Badge className={status.className}>{status.label}</Badge>
            <Badge variant="outline">{project.category}</Badge>
            {project.hiddenYn && <Badge variant="secondary">숨김 처리</Badge>}
          </div>
          <DialogTitle className="text-xl leading-tight">
            {project.title}
          </DialogTitle>
          <p className="text-muted-foreground text-xs">ID: {project._id}</p>
        </DialogHeader>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-7">
            {/* 기본 정보 */}
            <section>
              <SectionTitle icon={Layers} title="기본 정보" />
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="레벨">{LEVEL_MAP[project.level]}</InfoRow>
                <InfoRow label="소통 방식">
                  {COMM_MAP[project.communicationMethod]}
                </InfoRow>
                <InfoRow label="마감일">
                  {project.deadline ? formatDate(project.deadline) : '—'}
                </InfoRow>
                <InfoRow label="공개 여부">
                  {project.hiddenYn ? (
                    <span className="text-muted-foreground">숨김</span>
                  ) : (
                    <span className="text-green-600">공개</span>
                  )}
                </InfoRow>
              </div>
            </section>

            <hr />

            {/* 프로젝트 소개 */}
            <section>
              <SectionTitle icon={BookOpen} title="프로젝트 소개" />
              <div className="flex flex-col gap-3">
                <InfoRow label="설명">
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                </InfoRow>
                {project.goal && (
                  <InfoRow label="목표">
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {project.goal}
                    </p>
                  </InfoRow>
                )}
              </div>
            </section>

            <hr />

            {/* 진행 기간 */}
            <section>
              <SectionTitle icon={Calendar} title="예상 진행 기간" />
              <InfoRow label="기간">
                {project.expectedPeriodStart && project.expectedPeriodEnd
                  ? `${project.expectedPeriodStart} ~ ${project.expectedPeriodEnd}`
                  : '—'}
              </InfoRow>
            </section>

            <hr />

            {/* 기술 스택 */}
            <section>
              <SectionTitle icon={Target} title="기술 스택" />
              <div className="flex flex-col gap-3">
                <InfoRow label="필수 스택">
                  <div className="flex flex-wrap gap-1.5">
                    {project.requiredTechStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </InfoRow>
                <InfoRow label="우대 스택">
                  <div className="flex flex-wrap gap-1.5">
                    {project.mandatoryTechStack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </InfoRow>
              </div>
            </section>

            <hr />

            {/* 모집 포지션 */}
            <section>
              <SectionTitle icon={Users} title="모집 포지션" />
              <div className="flex flex-col gap-3">
                <InfoRow label="총 모집 인원">
                  <span>{project.totalRecruitCount}명</span>
                </InfoRow>
                <InfoRow label="역할별 인원">
                  <div className="flex flex-wrap gap-2">
                    {project.recruitRoles.map(({ role, count }) => (
                      <div
                        key={role}
                        className="bg-muted flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
                      >
                        <span className="font-medium">{ROLE_MAP[role]}</span>
                        <span className="text-muted-foreground">{count}명</span>
                      </div>
                    ))}
                  </div>
                </InfoRow>
              </div>
            </section>

            <hr />

            {/* 소통 방식 */}
            <section>
              <SectionTitle icon={MessageSquare} title="소통 방식" />
              <InfoRow label="채널">
                {COMM_MAP[project.communicationMethod]}
              </InfoRow>
            </section>

            {/* GitHub */}
            {project.githubUrl && (
              <>
                <hr />
                <section>
                  <SectionTitle icon={Github} title="GitHub" />
                  <InfoRow label="저장소">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary break-all hover:underline"
                    >
                      {project.githubUrl}
                    </a>
                  </InfoRow>
                </section>
              </>
            )}

            <hr />

            {/* 등록 정보 */}
            <section>
              <SectionTitle icon={Clock} title="등록 정보" />
              <div className="flex flex-col gap-3">
                <InfoRow label="작성자 ID">
                  <span className="text-muted-foreground font-mono text-xs">
                    {project.author}
                  </span>
                </InfoRow>
                <InfoRow label="등록일">
                  {formatDateTime(project.createdAt)}
                </InfoRow>
                <InfoRow label="수정일">
                  {formatDateTime(project.updatedAt)}
                </InfoRow>
              </div>
            </section>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="border-t px-6 py-4">
          <Button
            variant={project.hiddenYn ? 'outline' : 'destructive'}
            size="sm"
          >
            {project.hiddenYn ? '숨김 해제' : '숨김 처리'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AdminProjectDetailModal
