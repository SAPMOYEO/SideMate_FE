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
import type { ProjectResponse } from '@/types/project.type'

// ── Label maps ──────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; className: string }> = {
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

const ROLE_MAP: Record<string, string> = {
  FULLSTACK: '풀스택',
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DESIGNER: '디자이너',
  ETC: '기타',
}

const COMM_MAP: Record<string, string> = {
  DISCORD: 'Discord',
  OPEN_CHAT: '오픈채팅',
  OFFLINE: '오프라인',
}

// ── Sub-components ──────────────────────────────────────────────
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

// ── Types ────────────────────────────────────────────────────────
interface AdminProjectDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: ProjectResponse | null
}

// ── Main Component ───────────────────────────────────────────────
const AdminProjectDetailModal = ({
  open,
  onOpenChange,
  project,
}: AdminProjectDetailModalProps) => {
  if (!project) return null

  const statusInfo = STATUS_MAP[project.status] ?? {
    label: project.status,
    className: '',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent
        className="flex max-h-[88vh] max-w-4xl min-w-[60vw] flex-col gap-0 p-0"
        showCloseButton={false}
      >
        {/* ── Header ── */}
        <DialogHeader className="border-b px-6 py-5">
          <div className="mb-2 flex items-center gap-2">
            <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
            <Badge variant="outline">{project.category}</Badge>
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
                <InfoRow label="소통 방식">
                  {COMM_MAP[project.communicationMethod] ??
                    project.communicationMethod}
                </InfoRow>
                <InfoRow label="마감일">
                  {project.deadline
                    ? formatDate(new Date(project.deadline))
                    : '—'}
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
                {project.startDate && project.endDate
                  ? `${project.startDate} ~ ${project.endDate}`
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
                  <span>{project.totalCnt}명</span>
                </InfoRow>
                <InfoRow label="역할별 인원">
                  <div className="flex flex-wrap gap-2">
                    {project.recruitRoles.map(({ _id, role, cnt }) => (
                      <div
                        key={_id}
                        className="bg-muted flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
                      >
                        <span className="font-medium">
                          {ROLE_MAP[role] ?? role}
                        </span>
                        <span className="text-muted-foreground">{cnt}명</span>
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
                {COMM_MAP[project.communicationMethod] ??
                  project.communicationMethod}
              </InfoRow>
            </section>

            {/* GitHub */}
            {project.gitUrl && (
              <>
                <hr />
                <section>
                  <SectionTitle icon={Github} title="GitHub" />
                  <InfoRow label="저장소">
                    <a
                      href={project.gitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary break-all hover:underline"
                    >
                      {project.gitUrl}
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
                  {formatDateTime(new Date(project.createdAt))}
                </InfoRow>
                <InfoRow label="수정일">
                  {formatDateTime(new Date(project.updatedAt))}
                </InfoRow>
              </div>
            </section>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="border-t px-6 py-4">
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
