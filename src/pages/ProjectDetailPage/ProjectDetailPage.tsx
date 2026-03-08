import { useMemo } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Link as LinkIcon,
  MessageSquareText,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks'
import { useDeleteProject, useProjectById } from '@/hooks/project/useProject'
import { formatDate } from '@/utils/formatter'

const STATUS_LABEL: Record<string, string> = {
  RECRUITING: '모집 중',
  CLOSED: '모집 마감',
  COMPLETED: '진행 완료',
}

const COMMUNICATION_LABEL: Record<string, string> = {
  DISCORD: '디스코드',
  OPEN_CHAT: '오픈채팅',
  OFFLINE: '오프라인',
}

const STATUS_STYLE: Record<string, string> = {
  RECRUITING: 'bg-indigo-100 text-indigo-700',
  CLOSED: 'bg-gray-200 text-gray-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
}

const toDateText = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return formatDate(date)
}

const getDeadlineText = (deadline?: string) => {
  if (!deadline) return '마감일 정보 없음'
  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return '마감일 정보 없음'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return '마감됨'
  if (diff === 0) return '오늘 마감'
  return `마감 ${diff}일 전`
}

const ProjectDetailPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)
  const { data: project, isLoading, isError } = useProjectById(id)
  const { mutateAsync: deleteProject, isPending: isDeleting } =
    useDeleteProject()

  const totalCnt = useMemo(() => {
    if (!project) return 0
    if (project.totalCnt > 0) return project.totalCnt
    return project.recruitRoles.reduce((sum, role) => sum + role.cnt, 0)
  }, [project])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="rounded-2xl border bg-white px-6 py-12 text-center text-sm text-gray-500">
          프로젝트 상세 정보를 불러오는 중입니다...
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="rounded-2xl border bg-white px-6 py-12 text-center text-sm text-red-500">
          프로젝트 상세 정보를 불러오지 못했습니다.
        </div>
      </div>
    )
  }

  const communicationLabel =
    COMMUNICATION_LABEL[project.communicationMethod] ??
    project.communicationMethod
  const statusLabel = STATUS_LABEL[project.status] ?? project.status
  const statusStyle =
    STATUS_STYLE[project.status] ?? 'bg-gray-100 text-gray-700'
  const deadlineText = getDeadlineText(project.deadline)
  const authorInitial = (project.author?.name ?? '?').slice(0, 1)
  const isOwner = Boolean(
    user?._id && project.author?._id && user._id === project.author._id
  )

  const handleEdit = () => {
    navigate(`/projects/${project._id}/edit`)
  }

  const handleDelete = async () => {
    if (!window.confirm('이 프로젝트를 삭제하시겠습니까?')) return

    try {
      await deleteProject(project._id)
      toast.success('프로젝트가 삭제되었습니다.')
      navigate('/projects')
    } catch (error) {
      console.error(error)
      toast.error('프로젝트 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
              >
                {statusLabel}
              </span>
              <span className="text-gray-500">{project.category}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {toDateText(project.startDate)} - {toDateText(project.endDate)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-500">
              프로젝트 설명
            </h2>
            <p className="leading-8 whitespace-pre-line text-gray-700">
              {project.description}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-500">
              프로젝트 목표
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <p className="whitespace-pre-line">{project.goal}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-500">
              필요 기술 스택
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.requiredTechStack.map((stack) => (
                <span
                  key={stack}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-6 border-t pt-6 text-sm text-gray-700 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <MessageSquareText className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">소통 방식</p>
                <p>{communicationLabel || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <LinkIcon className="h-4 w-4 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-500">저장소</p>
                {project.gitUrl ? (
                  <a
                    href={project.gitUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-indigo-600 hover:underline"
                  >
                    {project.gitUrl}
                  </a>
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                수정
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">모집 인원</span>
                <span className="font-semibold text-gray-900">
                  {totalCnt}명
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">마감일</span>
                <span className="font-semibold text-rose-500">
                  {toDateText(project.deadline)}
                </span>
              </div>
            </div>

            {new Date(project.deadline) > new Date() && (
              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-600"
              >
                지원하기
              </button>
            )}

            <p className="mt-3 text-center text-xs text-gray-400">
              {deadlineText}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">모집</h3>
            <div className="space-y-2">
              {project.recruitRoles.map((role) => (
                <div
                  key={role.role}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-gray-700">{role.role}</span>
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                    {role.cnt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
              {authorInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {project.author?.name ?? '작성자 없음'}
              </p>
              <p className="truncate text-xs text-gray-500">
                {project.author?.email ?? '이메일 정보 없음'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ProjectDetailPage
