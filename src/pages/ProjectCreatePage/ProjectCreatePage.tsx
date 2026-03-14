import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronDown,
  CircleCheck,
  Lightbulb,
  Sparkles,
  Plus,
  Trash2,
  RotateCw,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FRAMEWORKS } from '@/constants/stack'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { fetchMyQuota } from '@/features/slices/aiQuotaSlice'
import {
  clearFeedback,
  createProjectFeedback,
  setFeedback,
  setFeedbackId,
} from '@/features/slices/feedbackSlice'
import {
  useCreateProject,
  useProjectById,
  useUpdateProject,
} from '@/hooks/project/useProject'
import { fetchLatestDraftProjectFeedback } from '@/utils/api/feedback'
import axios from 'axios'

type RecruitRoleForm = {
  // 목록 렌더링 키/수정/삭제에 쓰는 프론트 전용 id
  id: number
  // 모집 역할명 (예: 프론트엔드 개발자)
  role: string
  // 해당 역할 모집 인원
  cnt: number
}

type AiFeedback = {
  // 우측 AI 리포트 상단 설명 문구
  subtitle: string
  // AI가 판단한 강점 항목
  strengths: string[]
  // AI가 판단한 보완 필요 항목
  warnings: string[]
  // 개선 제안 항목
  suggestions: string[]
  // 종합 내용 문단
  detail: string
}

// 폼 선택 옵션 상수
const CATEGORY_OPTIONS = ['웹개발', '모바일앱', 'AI & 머신러닝', '블록체인']
const COMMUNICATION_OPTIONS = [
  { value: 'DISCORD', label: '디스코드' },
  { value: 'OPEN_CHAT', label: '오픈채팅' },
  { value: 'OFFLINE', label: '오프라인' },
]

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDaysToDateString = (dateString: string, days: number) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return formatDateInputValue(date)
}

const ProjectCreatePage = () => {
  // id가 있으면 수정 모드, 없으면 등록 모드
  const { id = '' } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)

  // feedback slice 상태 조회
  const feedbackData = useAppSelector((state) => state.feedback.feedback)
  const isAnalyzingFeedback = useAppSelector(
    (state) => state.feedback.submitLoading
  )

  // 생성 전 draft 프로젝트 식별용 임시 ID
  const [tempProjectId] = useState(() => crypto.randomUUID())

  // 타임아웃/응답 유실 시 복구 패널 노출 상태
  const [showFeedbackRecovery, setShowFeedbackRecovery] = useState(false)
  const [isRecoveringFeedback, setIsRecoveringFeedback] = useState(false)

  // 등록/수정 mutation 훅
  const { mutateAsync: createProject, isPending: isCreating } =
    useCreateProject()
  const { mutateAsync: updateProject, isPending: isUpdating } =
    useUpdateProject()

  // 수정 모드일 때 기존 프로젝트 데이터 로드
  const {
    data: editingProject,
    isLoading: isEditingProjectLoading,
    isError: isEditingProjectError,
  } = useProjectById(id)

  // ===== 프로젝트 기본 입력 상태 =====
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [communicationMethod, setCommunicationMethod] = useState('')
  type GitUrlSource = 'LATER' | 'PROFILE_GITHUB' | 'CUSTOM'
  const [gitUrlSource, setGitUrlSource] = useState<GitUrlSource>('LATER')
  const [gitUrl, setGitUrl] = useState('')

  // ===== 기술 스택 선택 UI 상태 =====
  const [requiredTechStack, setRequiredTechStack] = useState<string[]>([])
  const [openTechStack, setOpenTechStack] = useState(false)

  // ===== 모집 역할 입력 상태 =====
  const [recruitRoles, setRecruitRoles] = useState<RecruitRoleForm[]>([
    { id: 1, role: '', cnt: 1 },
  ])

  // ===== AI 피드백 UI 상태 =====
  const todayDate = useMemo(() => formatDateInputValue(new Date()), [])
  const tomorrowDate = useMemo(
    () => addDaysToDateString(todayDate, 1),
    [todayDate]
  )
  const quickDeadlineOptions = useMemo(
    () => [
      { label: '내일', value: addDaysToDateString(todayDate, 1) },
      { label: '1주일', value: addDaysToDateString(todayDate, 7) },
      { label: '2주일', value: addDaysToDateString(todayDate, 14) },
    ],
    [todayDate]
  )
  const minEndDate = startDate
    ? addDaysToDateString(startDate, 1)
    : addDaysToDateString(todayDate, 1)
  // feedback slice 데이터를 UI 전용 형태로 변환
  const aiFeedback = useMemo<AiFeedback | null>(() => {
    if (!feedbackData) return null

    return {
      subtitle: '현재 작성 중인 프로젝트 모집글에 대한 AI 분석 리포트입니다.',
      strengths: feedbackData.strengths,
      warnings: feedbackData.weaknesses,
      suggestions: feedbackData.suggestions,
      detail: [
        feedbackData.overallComment || '종합 내용을 아직 불러오지 못했습니다',
      ].join('\n\n'),
    }
  }, [feedbackData])

  // 페이지 진입 시 스크롤을 상단으로 고정
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  // 페이지 진입 시 이전 피드백 초기화
  useEffect(() => {
    dispatch(clearFeedback())
  }, [dispatch])

  // 수정 모드에서 기존 데이터로 폼을 채워 넣는 구간
  useEffect(() => {
    if (!isEditMode || !editingProject) return

    // 작성자 본인만 수정 가능하도록 한 번 더 방어
    if (
      user?._id &&
      editingProject.author?._id &&
      editingProject.author._id !== user._id
    ) {
      toast.error('본인이 작성한 프로젝트만 수정할 수 있습니다.')
      navigate(`/projects/${editingProject._id}`, { replace: true })
      return
    }

    // 수정 폼 기본값 세팅
    setTitle(editingProject.title ?? '')
    setCategory(editingProject.category ?? '')
    setDescription(editingProject.description ?? '')
    setGoal(editingProject.goal ?? '')
    setStartDate(editingProject.startDate?.slice(0, 10) ?? '')
    setEndDate(editingProject.endDate?.slice(0, 10) ?? '')
    setDeadline(editingProject.deadline?.slice(0, 10) ?? '')
    setCommunicationMethod(editingProject.communicationMethod ?? '')
    const repoUrl = editingProject.gitUrl?.trim() ?? ''
    const profileGitFull = user?.profile?.gitUrl
      ? `https://github.com/${user.profile.gitUrl}`
      : ''
    if (!repoUrl) {
      setGitUrlSource('LATER')
      setGitUrl('')
    } else if (profileGitFull && repoUrl === profileGitFull) {
      setGitUrlSource('PROFILE_GITHUB')
      setGitUrl('')
    } else {
      setGitUrlSource('CUSTOM')
      setGitUrl(repoUrl)
    }
    setRequiredTechStack(editingProject.requiredTechStack ?? [])
    setRecruitRoles(
      editingProject.recruitRoles.length
        ? editingProject.recruitRoles.map((role, index) => ({
            id: Date.now() + index,
            role: role.role,
            cnt: role.cnt,
          }))
        : [{ id: 1, role: '', cnt: 1 }]
    )
  }, [isEditMode, editingProject, user?._id, navigate])

  // 서버로 보낼 totalCnt = 역할별 cnt 합계
  const totalCnt = useMemo(
    () => recruitRoles.reduce((sum, role) => sum + role.cnt, 0),
    [recruitRoles]
  )
  // 등록/수정 중 버튼 비활성화를 위한 통합 상태
  const isSubmitting = isEditMode ? isUpdating : isCreating
  const getResolvedGitUrl = (): string => {
    if (gitUrlSource === 'LATER') return ''
    if (gitUrlSource === 'PROFILE_GITHUB' && user?.profile?.gitUrl)
      return `https://github.com/${user.profile.gitUrl}`
    return gitUrl.trim()
  }

  // 기술 스택 토글 (선택/해제)
  const toggleTechStack = (stack: string) => {
    setRequiredTechStack((prev) =>
      prev.includes(stack)
        ? prev.filter((item) => item !== stack)
        : [...prev, stack]
    )
  }

  // 모집 역할 입력 행 추가
  const addRoleRow = () => {
    setRecruitRoles((prev) => [...prev, { id: Date.now(), role: '', cnt: 1 }])
  }

  // 모집 역할 입력 행 삭제 (최소 1행은 유지)
  const removeRoleRow = (id: number) => {
    setRecruitRoles((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((row) => row.id !== id)
    })
  }

  // 역할명 수정
  const changeRole = (id: number, role: string) => {
    setRecruitRoles((prev) =>
      prev.map((row) => (row.id === id ? { ...row, role } : row))
    )
  }

  // 역할 인원 증감 (최소 1명 보장)
  const changeCount = (id: number, delta: number) => {
    setRecruitRoles((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, cnt: Math.max(1, row.cnt + delta) } : row
      )
    )
  }

  // 제출 전 클라이언트 검증
  const validateForm = () => {
    if (!title.trim()) return '프로젝트 제목을 입력해주세요.'
    if (!category) return '카테고리를 선택해주세요.'
    if (!description.trim()) return '프로젝트 설명을 입력해주세요.'
    if (!goal.trim()) return '프로젝트 목표를 입력해주세요.'
    if (!startDate || !endDate) return '프로젝트 기간을 입력해주세요.'
    if (!deadline) return '모집 마감일을 입력해주세요.'
    if (startDate < todayDate)
      return '프로젝트 시작일은 오늘 이전으로 선택할 수 없습니다.'
    if (endDate <= startDate)
      return '프로젝트 종료일은 시작일보다 이후 날짜여야 합니다.'
    if (deadline < tomorrowDate)
      return '모집 마감일은 내일부터 선택할 수 있습니다.'
    if (!communicationMethod) return '소통 방식을 선택해주세요.'
    if (requiredTechStack.length === 0)
      return '기술 스택을 1개 이상 선택해주세요.'
    if (recruitRoles.some((row) => !row.role.trim()))
      return '모집 역할명을 입력해주세요.'
    return null
  }

  // 생성된 draft 피드백 다시 불러오기
  const handleRecoverFeedback = async () => {
    if (isRecoveringFeedback) return

    try {
      setIsRecoveringFeedback(true)

      const result = await fetchLatestDraftProjectFeedback(tempProjectId)

      if (!result.data) {
        toast.message('아직 생성된 피드백이 없습니다.')
        return
      }

      dispatch(
        setFeedback({
          overallComment: result.data.overallComment || '',
          strengths: result.data.strengths,
          weaknesses: result.data.weaknesses,
          suggestions: result.data.suggestions,
        })
      )
      dispatch(setFeedbackId(result.data._id))
      setShowFeedbackRecovery(false)
      dispatch(fetchMyQuota())

      toast.success('생성된 AI 피드백 내용을 다시 불러왔습니다.')
    } catch (error) {
      console.error(error)
      toast.error('생성된 피드백 내용을 다시 불러오지 못했습니다.')
    } finally {
      setIsRecoveringFeedback(false)
    }
  }

  // AI 피드백 요청 핸들러
  // AI 피드백 요청 핸들러
  const handleRequestAiFeedback = async () => {
    if (isAnalyzingFeedback) return

    const errorMessage = validateForm()

    if (errorMessage) {
      toast.error(errorMessage)
      return
    }

    try {
      const payload = {
        projectId: null,
        requestId: crypto.randomUUID(),
        tempProjectId,
        type: 'project-create-draft' as const,
        inputSnapshot: {
          title: title.trim(),
          category,
          description: description.trim(),
          goal: goal.trim(),
          startDate,
          endDate,
          requiredTechStack,
          recruitRoles: recruitRoles
            .filter((row) => row.role.trim())
            .map((row) => ({
              role: row.role.trim(),
              cnt: row.cnt,
            })),
          totalCnt,
          deadline,
          communicationMethod,
          gitUrl: getResolvedGitUrl(),
        },
      }

      await dispatch(createProjectFeedback(payload)).unwrap()

      // AI 가능 횟수 리프레시
      dispatch(fetchMyQuota())
      setShowFeedbackRecovery(false)

      toast.success('AI 피드백을 불러왔습니다.')
    } catch (error) {
      console.error(error)

      const isUncertainFailure =
        axios.isAxiosError(error) &&
        (error.code === 'ECONNABORTED' ||
          error.message.includes('timeout') ||
          error.message.includes('Network Error'))

      if (isUncertainFailure) {
        setShowFeedbackRecovery(true)
        toast.message(
          'AI 피드백 응답이 지연되고 있습니다. 이미 생성되었을 수 있어요. 오른쪽 영역에서 다시 불러와 보세요.'
        )
        return
      }

      toast.error(
        typeof error === 'string'
          ? error
          : 'AI 피드백 생성 중 오류가 발생했습니다.'
      )
    }
  }

  // 등록/수정 공통 submit 핸들러
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errorMessage = validateForm()

    if (errorMessage) {
      toast.error(errorMessage)
      return
    }

    try {
      // create/update API 공통 payload
      const payload = {
        title: title.trim(),
        category,
        description: description.trim(),
        goal: goal.trim(),
        startDate,
        endDate,
        requiredTechStack,
        recruitRoles: recruitRoles.map((row) => ({
          role: row.role.trim(),
          cnt: row.cnt,
        })),
        totalCnt,
        deadline,
        communicationMethod,
        status: isEditMode
          ? (editingProject?.status ?? 'RECRUITING')
          : 'RECRUITING',
        gitUrl: getResolvedGitUrl(),
        tempProjectId: isEditMode ? undefined : tempProjectId,
      }

      const project =
        isEditMode && id
          ? await updateProject({ id, payload })
          : await createProject(payload)

      toast.success(
        isEditMode ? '프로젝트가 수정되었습니다.' : '프로젝트가 등록되었습니다.'
      )
      navigate(`/projects/${project._id}`)
    } catch (error) {
      console.error(error)
      toast.error(
        isEditMode
          ? '프로젝트 수정 중 오류가 발생했습니다.'
          : '프로젝트 등록 중 오류가 발생했습니다.'
      )
    }
  }

  // 수정 모드 + 초기 데이터 로딩 중 화면
  if (isEditMode && isEditingProjectLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <div className="rounded-2xl border bg-white px-6 py-12 text-center text-sm text-gray-500">
          프로젝트 정보를 불러오는 중입니다...
        </div>
      </div>
    )
  }

  // 수정 모드 + 초기 데이터 조회 실패 화면
  if (isEditMode && isEditingProjectError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <div className="rounded-2xl border bg-white px-6 py-12 text-center text-sm text-red-500">
          프로젝트 정보를 불러오지 못했습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f7f8fc]">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        {/* AI 피드백이 있으면 좌(폼):우(리포트) 7:3 레이아웃 */}
        <div
          className={
            aiFeedback ? 'grid items-start gap-6 xl:grid-cols-[7fr_3fr]' : ''
          }
        >
          {/* 프로젝트 등록/수정 메인 폼 */}
          <form
            onSubmit={handleSubmit}
            className="relative space-y-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                {isEditMode ? '프로젝트 수정' : '새 프로젝트 등록'}
              </h1>
              <p className="text-sm text-slate-500">
                {isEditMode
                  ? '등록한 내용을 수정하고 다시 저장할 수 있습니다.'
                  : '멋진 팀원을 모집하기 위해 프로젝트의 상세 내용을 입력해 주세요.'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                프로젝트 제목
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: AI 기반 건강 관리 어시스턴트"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  카테고리
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border-input h-10 w-full appearance-none rounded-md border bg-transparent px-3 py-2 pr-12 text-sm shadow-xs"
                  >
                    <option value="">카테고리 선택</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  소통 방식
                </label>
                <div className="relative">
                  <select
                    value={communicationMethod}
                    onChange={(e) => setCommunicationMethod(e.target.value)}
                    className="border-input h-10 w-full appearance-none rounded-md border bg-transparent px-3 py-2 pr-12 text-sm shadow-xs"
                  >
                    <option value="">소통 방식 선택</option>
                    {COMMUNICATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                프로젝트 설명
              </label>
              <Textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="어떤 프로젝트인지 간단하게 설명해 주세요..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                프로젝트 목표
              </label>
              <Textarea
                rows={4}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="이 프로젝트를 통해 무엇을 달성하고 싶나요?"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  모집 마감일
                </label>
                <Input
                  type="date"
                  value={deadline}
                  min={tomorrowDate}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickDeadlineOptions.map((option) => {
                    const selected = deadline === option.value

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setDeadline(option.value)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          selected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  저장소 주소 (선택)
                </label>
                <div className="space-y-2 rounded-md border border-gray-200 bg-slate-50/50 p-3">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="gitUrlSource"
                      checked={gitUrlSource === 'LATER'}
                      onChange={() => setGitUrlSource('LATER')}
                      className="h-4 w-4 border-gray-300 text-indigo-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      추후 공개 예정
                    </span>
                  </label>
                  {user?.profile?.gitUrl &&
                    user?.privacySettings?.isGithubPublic === true && (
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="gitUrlSource"
                          checked={gitUrlSource === 'PROFILE_GITHUB'}
                          onChange={() => setGitUrlSource('PROFILE_GITHUB')}
                          className="h-4 w-4 border-gray-300 text-indigo-600"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          내 GitHub 주소 사용 ( github.com/{user.profile.gitUrl}
                          )
                        </span>
                      </label>
                    )}
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="gitUrlSource"
                      checked={gitUrlSource === 'CUSTOM'}
                      onChange={() => setGitUrlSource('CUSTOM')}
                      className="h-4 w-4 border-gray-300 text-indigo-600"
                    />
                    <span className="shrink-0 text-sm font-medium whitespace-nowrap text-slate-700">
                      직접 입력
                    </span>
                  </label>
                  {gitUrlSource === 'CUSTOM' && (
                    <div className="w-full min-w-0">
                      <Input
                        value={gitUrl}
                        onChange={(e) => setGitUrl(e.target.value)}
                        placeholder="https://github.com/..."
                        className="mt-1 w-full min-w-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                프로젝트 기간
              </label>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input
                  type="date"
                  value={startDate}
                  min={todayDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="text-slate-400">~</span>
                <Input
                  type="date"
                  value={endDate}
                  min={minEndDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                모집
              </label>
              <div className="space-y-3">
                {recruitRoles.map((row) => (
                  <div
                    key={row.id}
                    className="grid gap-2 md:grid-cols-[1fr_146px_auto]"
                  >
                    <Input
                      value={row.role}
                      onChange={(e) => changeRole(row.id, e.target.value)}
                      placeholder="역할 (예: 프론트엔드 개발자)"
                    />

                    <div className="flex items-center rounded-md border px-2">
                      <button
                        type="button"
                        onClick={() => changeCount(row.id, -1)}
                        className="h-8 w-8 rounded text-slate-500 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-sm font-semibold">
                        {row.cnt}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeCount(row.id, 1)}
                        className="h-8 w-8 rounded text-slate-500 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRoleRow(row.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-md border text-slate-500 hover:bg-slate-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addRoleRow}
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600"
              >
                <Plus className="h-4 w-4" />
                역할 추가하기
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                기술 스택
              </label>
              <div className="rounded-xl border bg-slate-50 p-3">
                <div className="mb-2 flex min-h-8 flex-wrap gap-2">
                  {requiredTechStack.length === 0 && (
                    <span className="text-xs text-slate-400">
                      선택된 기술스택이 없습니다.
                    </span>
                  )}
                  {requiredTechStack.map((stack) => (
                    <button
                      key={stack}
                      type="button"
                      onClick={() => toggleTechStack(stack)}
                      className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {stack} x
                    </button>
                  ))}
                </div>

                <Popover open={openTechStack} onOpenChange={setOpenTechStack}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-sm font-normal text-slate-500"
                    >
                      태그 추가...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[320px] p-0">
                    <Command>
                      <CommandInput placeholder="기술스택 검색..." />
                      <CommandList className="max-h-[250px]">
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {FRAMEWORKS.map((stack) => {
                            const selected = requiredTechStack.includes(stack)

                            return (
                              <CommandItem
                                key={stack}
                                onSelect={() => toggleTechStack(stack)}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${selected ? 'opacity-100' : 'opacity-0'}`}
                                />
                                {stack}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* 하단 액션 영역: 등록/수정 + AI 피드백 */}
            <div className="grid gap-3 border-t pt-7 md:grid-cols-2">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? '수정 중...'
                    : '등록 중...'
                  : isEditMode
                    ? '수정 완료'
                    : '바로 등록하기'}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleRequestAiFeedback}
                disabled={isAnalyzingFeedback}
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                {isAnalyzingFeedback
                  ? 'AI 분석 중...'
                  : aiFeedback
                    ? 'AI 피드백 다시 받기'
                    : 'AI 피드백 받기'}
              </Button>
            </div>
          </form>

          {/* AI 피드백 결과 패널 */}
          {aiFeedback && (
            <aside className="space-y-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
              <div className="space-y-2 border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                  <Sparkles className="h-3.5 w-3.5" /> AI 분석 완료
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  프로젝트 피드백 리포트
                </h2>
                <p className="text-sm text-slate-500">{aiFeedback.subtitle}</p>
              </div>

              <div className="space-y-3">
                <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CircleCheck className="h-4 w-4" /> 강점
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {aiFeedback.strengths.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700">
                    <AlertTriangle className="h-4 w-4" /> 보완점
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {aiFeedback.warnings.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-700">
                    <Lightbulb className="h-4 w-4" /> 개선 제안
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {aiFeedback.suggestions.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="rounded-2xl border border-gray-200 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-800">
                  종합 내용
                </h3>
                <p className="text-xs leading-6 whitespace-pre-line text-slate-600">
                  {aiFeedback.detail}
                </p>
              </section>
            </aside>
          )}

          {/* 타임아웃/응답 유실 시 복구 패널 */}
          {!aiFeedback && showFeedbackRecovery && (
            <aside className="space-y-4 rounded-3xl border border-amber-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
              <div className="space-y-2 border-b border-amber-100 pb-4">
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                  <AlertTriangle className="h-3.5 w-3.5" /> 응답 확인 필요
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  AI 피드백 응답이 지연되고 있어요
                </h2>
                <p className="text-sm text-slate-500">
                  서버에서 이미 피드백이 생성되었을 수 있습니다. 아래 버튼을
                  눌러 생성된 피드백 내용을 다시 불러와 보세요.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <p className="text-sm leading-6 text-slate-700">
                  현재 화면에서는 응답을 받지 못했지만, 실제로는 AI 피드백이
                  저장된 상태일 수 있습니다.
                </p>
              </div>

              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleRecoverFeedback}
                disabled={isRecoveringFeedback}
              >
                <RotateCw className="mr-1.5 h-4 w-4" />
                {isRecoveringFeedback
                  ? '불러오는 중...'
                  : '생성된 피드백 내용 다시 불러오기'}
              </Button>
            </aside>
          )}
        </div>
      </div>

      {/* AI 분석 중 오버레이 (배경 비활성 + 중앙 로딩 카드) */}
      {isAnalyzingFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-[2px]">
          <div className="w-[min(92vw,380px)] rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600" />
            <div className="mx-auto mb-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
              <Sparkles className="h-3.5 w-3.5" /> AI 분석 중
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Analysing your project with AI...
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              프로젝트 정보를 바탕으로 AI 피드백을 생성하고 있어요.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCreatePage
