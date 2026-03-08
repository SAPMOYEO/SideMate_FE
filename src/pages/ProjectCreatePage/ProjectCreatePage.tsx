import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Plus, Sparkles, Trash2 } from 'lucide-react'
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
import { useAppSelector } from '@/hooks'
import {
  useCreateProject,
  useProjectById,
  useUpdateProject,
} from '@/hooks/project/useProject'

type RecruitRoleForm = {
  id: number
  role: string
  cnt: number
}

const CATEGORY_OPTIONS = ['웹개발', '모바일앱', 'AI & 머신러닝', '블록체인']
const COMMUNICATION_OPTIONS = [
  { value: 'DISCORD', label: '디스코드' },
  { value: 'OPEN_CHAT', label: '오픈채팅' },
  { value: 'OFFLINE', label: '오프라인' },
]

const ProjectCreatePage = () => {
  const { id = '' } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.user)
  const { mutateAsync: createProject, isPending: isCreating } =
    useCreateProject()
  const { mutateAsync: updateProject, isPending: isUpdating } =
    useUpdateProject()
  const {
    data: editingProject,
    isLoading: isEditingProjectLoading,
    isError: isEditingProjectError,
  } = useProjectById(id)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [communicationMethod, setCommunicationMethod] = useState('')
  const [gitUrl, setGitUrl] = useState('')
  const [requiredTechStack, setRequiredTechStack] = useState<string[]>([])
  const [openTechStack, setOpenTechStack] = useState(false)
  const [recruitRoles, setRecruitRoles] = useState<RecruitRoleForm[]>([
    { id: 1, role: '', cnt: 1 },
  ])

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    if (!isEditMode || !editingProject) return

    if (
      user?._id &&
      editingProject.author?._id &&
      editingProject.author._id !== user._id
    ) {
      toast.error('본인이 작성한 프로젝트만 수정할 수 있습니다.')
      navigate(`/projects/${editingProject._id}`, { replace: true })
      return
    }

    setTitle(editingProject.title ?? '')
    setCategory(editingProject.category ?? '')
    setDescription(editingProject.description ?? '')
    setGoal(editingProject.goal ?? '')
    setStartDate(editingProject.startDate?.slice(0, 10) ?? '')
    setEndDate(editingProject.endDate?.slice(0, 10) ?? '')
    setDeadline(editingProject.deadline?.slice(0, 10) ?? '')
    setCommunicationMethod(editingProject.communicationMethod ?? '')
    setGitUrl(editingProject.gitUrl ?? '')
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
  /* eslint-enable react-hooks/set-state-in-effect */

  // totalCnt는 모집 역할 인원 합계를 보낸다.
  const totalCnt = useMemo(
    () => recruitRoles.reduce((sum, role) => sum + role.cnt, 0),
    [recruitRoles]
  )
  const isSubmitting = isEditMode ? isUpdating : isCreating

  const toggleTechStack = (stack: string) => {
    setRequiredTechStack((prev) =>
      prev.includes(stack)
        ? prev.filter((item) => item !== stack)
        : [...prev, stack]
    )
  }

  const addRoleRow = () => {
    setRecruitRoles((prev) => [...prev, { id: Date.now(), role: '', cnt: 1 }])
  }

  const removeRoleRow = (id: number) => {
    setRecruitRoles((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((row) => row.id !== id)
    })
  }

  const changeRole = (id: number, role: string) => {
    setRecruitRoles((prev) =>
      prev.map((row) => (row.id === id ? { ...row, role } : row))
    )
  }

  const changeCount = (id: number, delta: number) => {
    setRecruitRoles((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, cnt: Math.max(1, row.cnt + delta) } : row
      )
    )
  }

  const validateForm = () => {
    if (!title.trim()) return '프로젝트 제목을 입력해주세요.'
    if (!category) return '카테고리를 선택해주세요.'
    if (!description.trim()) return '프로젝트 설명을 입력해주세요.'
    if (!goal.trim()) return '프로젝트 목표를 입력해주세요.'
    if (!startDate || !endDate) return '프로젝트 기간을 입력해주세요.'
    if (!deadline) return '모집 마감일을 입력해주세요.'
    if (new Date(startDate) > new Date(endDate))
      return '프로젝트 시작일은 종료일보다 늦을 수 없습니다.'
    if (!communicationMethod) return '소통 방식을 선택해주세요.'
    if (requiredTechStack.length === 0)
      return '기술 스택을 1개 이상 선택해주세요.'
    if (recruitRoles.some((row) => !row.role.trim()))
      return '모집 역할명을 입력해주세요.'
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errorMessage = validateForm()

    if (errorMessage) {
      toast.error(errorMessage)
      return
    }

    try {
      const payload = {
        title: title.trim(),
        category,
        description: description.trim(),
        goal: goal.trim(),
        startDate,
        endDate,
        requiredTechStack,
        mandatoryTechStack: [],
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
        gitUrl: gitUrl.trim() || undefined,
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

  if (isEditMode && isEditingProjectLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <div className="rounded-2xl border bg-white px-6 py-12 text-center text-sm text-gray-500">
          프로젝트 정보를 불러오는 중입니다...
        </div>
      </div>
    )
  }

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
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-input h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
              >
                <option value="">카테고리 선택</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                소통 방식
              </label>
              <select
                value={communicationMethod}
                onChange={(e) => setCommunicationMethod(e.target.value)}
                className="border-input h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
              >
                <option value="">소통 방식 선택</option>
                {COMMUNICATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                저장소 주소 (선택)
              </label>
              <Input
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
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
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-slate-400">~</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">모집</label>
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
            <Button type="button" size="lg" variant="outline">
              <Sparkles className="mr-1.5 h-4 w-4" />
              AI 피드백 받기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectCreatePage
