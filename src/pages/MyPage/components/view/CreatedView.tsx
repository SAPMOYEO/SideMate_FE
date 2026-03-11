import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BarChart2, ChevronDown, ChevronUp, Users } from 'lucide-react'
import ApplicantItem from '../ApplicantItem'
import ApplicantDetailModal from '../ApplicantDetailModal'

const MOCK_APPLICANTS = [
  {
    name: '김철수',
    time: '2시간 전',
    role: 'Back-end Developer',
    stack: 'Spring Boot, Node.js',
    motivation: 'Spring Boot와 Node.js 경험을 바탕으로 기여하고 싶습니다.',
  },
  {
    name: '이영희',
    time: '어제',
    role: 'UI/UX Designer',
    stack: 'Figma, Prototyping',
    motivation: 'Figma로 다양한 프로젝트를 진행한 경험이 있습니다.',
  },
  {
    name: '박지민',
    time: '3일 전',
    role: 'Front-end Developer',
    stack: 'React, TailwindCSS',
    motivation: 'React와 TailwindCSS를 활용해 사용자 경험을 개선하고 싶습니다.',
  },
]

type Applicant = (typeof MOCK_APPLICANTS)[number]

const CreatedView = () => {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  )
  const [showApplicants, setShowApplicants] = useState(false)
  const [showAIFeedback, setShowAIFeedback] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <>
      <ul className="w-full space-y-4">
        <li className="rounded-2xl bg-white p-6">
          {/* 프로젝트 헤더 */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="rounded-md">
                  모집중
                </Badge>
                <span className="text-xs font-medium text-slate-500">
                  모집 마감 D-5
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-500">
                  웹 서비스
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                AI 기반 사이드 프로젝트 매칭 서비스
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                팀원들과 함께 성장하는 매칭 알고리즘을 개발하고 있습니다. 기획자
                1명, 개발자 2명을 추가 모집합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDetailOpen(true)}
              >
                상세
              </Button>
              {/* AI 피드백 → 토글 */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAIFeedback((prev) => !prev)}
              >
                <BarChart2 className="mr-1 size-4" />
                AI 피드백 보기
                {showAIFeedback ? (
                  <ChevronUp className="ml-1 size-3" />
                ) : (
                  <ChevronDown className="ml-1 size-3" />
                )}
              </Button>
              {/* 지원자 보기 → 토글 */}
              <Button
                size="sm"
                onClick={() => setShowApplicants((prev) => !prev)}
              >
                <Users className="mr-1 size-4" />
                지원자 보기 ({MOCK_APPLICANTS.length})
                {showApplicants ? (
                  <ChevronUp className="ml-1 size-3" />
                ) : (
                  <ChevronDown className="ml-1 size-3" />
                )}
              </Button>
            </div>
          </div>

          {/* AI 피드백 토글 영역 */}
          {showAIFeedback && (
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                AI 피드백
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                AI 피드백 내용이 여기에 표시됩니다.
              </p>
            </div>
          )}

          {/* 지원자 현황 토글 영역 */}
          {showApplicants && (
            <div className="border-t border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50/50 px-6 py-4 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  지원 현황{' '}
                  <span className="text-primary ml-1">
                    {MOCK_APPLICANTS.length}명
                  </span>
                </h4>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_APPLICANTS.map((applicant) => (
                  <ApplicantItem
                    key={applicant.name}
                    applicant={applicant}
                    onDetail={() => setSelectedApplicant(applicant)}
                  />
                ))}
              </ul>
            </div>
          )}
        </li>
      </ul>

      {/* 프로젝트 상세 모달 */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI 기반 사이드 프로젝트 매칭 서비스</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            프로젝트 상세 내용이 여기에 표시됩니다.
          </p>
        </DialogContent>
      </Dialog>

      <ApplicantDetailModal
        open={!!selectedApplicant}
        onOpenChange={(open) => !open && setSelectedApplicant(null)}
        applicant={selectedApplicant}
      />
    </>
  )
}

export default CreatedView
